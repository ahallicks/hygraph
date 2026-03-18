import { tc } from '~/services/terminal-colours.ts';

/**
 * NotRedis - A simple in-memory cache implementation with the following features:
 * - HashMap-based storage for fast lookups
 * - Maximum cache size limit set to 10,000 entries
 * - Random cache eviction when size limit is reached
 * - Time-based expiration after a month
 * - Automatic cleanup of bottom 10% least accessed pages every 24 hours
 * - Document invalidation by ID
 */
type CacheEntry<T> = {
	data: T;
	timestamp: number; // When the entry was created
	expiresAt: number; // When the entry expires
	accessCount: number; // How many times the entry was accessed
	lastAccessTime: number; // When the entry was last accessed
};

export class NotRedis {
	private static instance: NotRedis;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private cache: Map<string, CacheEntry<any>> = new Map();

	// Default TTL: 1 month in seconds
	private ttlSeconds: number = 30 * 24 * 60 * 60;

	// Maximum cache size. Not sure what number this should be really - we may need to adjust in future
	private maxCacheSize: number = 10000;

	// For tracking and deduplicating frequent calls
	private recentCalls: Map<string, number> = new Map();
	private callThreshold: number = 1000;

	// For scheduled cleanup
	private lastCleanupTime: number = Date.now();

	// Do some maintenance cleaning every 24 hours
	private cleanupInterval: number = 24 * 60 * 60 * 1000;

	// Rolling purge invalidation
	private rollingPurgeActive: boolean = false;
	private rollingPurgeInterval: ReturnType<typeof setInterval> | null = null;
	private rollingPurgeTarget: string[] = [];
	private rollingPurgeTotal: number = 0;
	private rollingPurgeCompleted: number = 0;
	private rollingPurgeStartTime: number = 0;

	// Purge lock
	private purgeLockSet: Set<string> = new Set();
	private purgeLockTTL: number = 60 * 1000; // 60 seconds default

	private constructor() {
		console.log(tc.box(tc.bold(tc.green('NotRedis starting...'))));
		// Schedule periodic cleanup
		setInterval(() => this.performPeriodicCleanup(), this.cleanupInterval);
		// Add lock cleanup every minute
		setInterval(() => this.cleanupOrphanedLocks(), 60000);
	}

	public static getInstance(): NotRedis {
		if (!NotRedis.instance) {
			NotRedis.instance = new NotRedis();
		}
		return NotRedis.instance;
	}

	/**
	 * Formats a cache key for display in logs
	 */
	private getDisplayKey(key: string): string {
		const parts = key.split(':');
		if (parts.length >= 3) {
			// For keys like "hygraph:type:homepage:{...params...}"
			// Return "hygraph:type:homepage"
			return parts.slice(0, 3).join(':');
		}
		return key;
	}

	/**
	 * Checks if a similar call was made recently to prevent my console from looking spammy
	 */
	private isDuplicateCall(key: string): boolean {
		const now = Date.now();
		const lastCallTime = this.recentCalls.get(key);

		if (lastCallTime && now - lastCallTime < this.callThreshold) {
			this.recentCalls.set(key, now);
			return true;
		}

		this.recentCalls.set(key, now);
		return false;
	}

	/**
	 * Removes old entries from the recent calls tracking
	 */
	private cleanupRecentCalls(): void {
		const now = Date.now();
		for (const [key, time] of this.recentCalls.entries()) {
			if (now - time > this.callThreshold * 10) {
				this.recentCalls.delete(key);
			}
		}
	}

	/**
	 * Evicts a random entry from the cache when size limit is reached
	 */
	private evictRandomEntry(): void {
		if (this.cache.size <= 0) return;

		const keys = Array.from(this.cache.keys());
		const randomIndex = Math.floor(Math.random() * keys.length);
		const keyToEvict = keys[randomIndex];

		if (keyToEvict) {
			console.log(
				`${tc.blue('NotRedis')} ${tc.yellow('EVICT')} ${tc.yellow(this.getDisplayKey(keyToEvict))} (random eviction due to size limit)`,
			);

			this.cache.delete(keyToEvict);
		}
	}

	/**
	 *  Prevent the cache from immediately refilling during the purge.
	 */
	private lockKeyFromReCaching(key: string): void {
		this.purgeLockSet.add(key);

		// Auto-release lock after TTL
		setTimeout(() => {
			this.purgeLockSet.delete(key);
		}, this.purgeLockTTL);
	}

	/**
	 * Performs periodic cleanup of least accessed entries
	 */
	private performPeriodicCleanup(): void {
		const now = Date.now();

		// Check if it's time for cleanup
		if (now - this.lastCleanupTime < this.cleanupInterval) {
			return;
		}

		this.lastCleanupTime = now;

		// Nothing to clean if cache is small
		if (this.cache.size <= 2000) {
			return;
		}

		console.log(
			`${tc.blue('NotRedis')} ${tc.yellow('CLEANUP')} Starting periodic cleanup of least accessed entries`,
		);

		// Sort entries by access count
		const entries = Array.from(this.cache.entries())
			.map(([key, entry]) => ({
				key,
				entry,
				score:
					entry.accessCount * 0.7 +
					(now - entry.lastAccessTime) * 0.3,
			}))
			.sort((a, b) => a.score - b.score);

		// Remove bottom 10%
		const entriesToRemove = Math.ceil(entries.length * 0.1);
		let removed = 0;

		for (let i = 0; i < entriesToRemove && i < entries.length; i++) {
			const entry = entries[i];
			if (entry && entry.key) {
				this.cache.delete(entry.key);
				removed++;
			}
		}

		console.log(
			`${tc.blue('NotRedis')} ${tc.yellow('CLEANUP')} Removed ${tc.bold(removed.toString())} least accessed entries (${Math.round((removed / this.cache.size) * 100)}% of cache)`,
		);
	}

	/**
	 * Cleanup any orphaned locks that are still outstanding
	 */
	private cleanupOrphanedLocks(): void {
		if (!this.rollingPurgeActive && this.purgeLockSet.size > 0) {
			const count = this.purgeLockSet.size;
			this.purgeLockSet.clear();
			console.log(
				`${tc.blue('NotRedis')} ${tc.yellow('CLEANUP')} Cleared ${count} orphaned purge locks`,
			);
		}
	}

	/**
	 * Stores a value in the cache
	 */
	public set<T>(
		key: string,
		data: T,
		ttlSeconds: number = this.ttlSeconds,
	): void {
		// Only block keys if there's an active purge
		if (this.rollingPurgeActive && this.purgeLockSet.has(key)) {
			if (!this.isDuplicateCall(`purge-lock:${key}`)) {
				console.log(
					`${tc.blue('NotRedis')} ${tc.red('BLOCKED')} ${tc.yellow(this.getDisplayKey(key))} (key is being purged)`,
				);
			}
			return; // Skip caching this item
		} else if (!this.rollingPurgeActive && this.purgeLockSet.has(key)) {
			// Clear lingering locks if no active purge
			this.purgeLockSet.delete(key);
		}

		const now = Date.now();
		const entry: CacheEntry<T> = {
			data,
			timestamp: now,
			expiresAt: now + ttlSeconds * 1000,
			accessCount: 0,
			lastAccessTime: now,
		};

		this.cache.set(key, entry);

		if (!this.isDuplicateCall(`set:${key}`)) {
			console.log(
				`${tc.blue('NotRedis')} ${tc.yellow('STORE')} ${tc.yellow(this.getDisplayKey(key))} (expires in ${ttlSeconds}s)`,
			);
		}
		if (Math.random() < 0.1) {
			this.cleanupRecentCalls();
		}
	}

	/**
	 * Retrieves a value from the cache
	 */
	public get<T>(key: string): T | null {
		const startTime = performance.now();
		const entry = this.cache.get(key);

		if (!entry) {
			if (!this.isDuplicateCall(`miss:${key}`)) {
				console.log(
					`${tc.blue('NotRedis')} ${tc.red('MISS')} ${tc.red(this.getDisplayKey(key))}`,
				);
			}
			return null;
		}

		const now = Date.now();
		if (now > entry.expiresAt) {
			if (!this.isDuplicateCall(`expired:${key}`)) {
				console.log(
					`${tc.blue('NotRedis')} ${tc.red('EXPIRED')} ${tc.dim(this.getDisplayKey(key))}`,
				);
			}
			this.cache.delete(key);
			return null;
		}

		// Update stats cause we are nerds
		entry.accessCount++;
		entry.lastAccessTime = now;

		const endTime = performance.now();
		const responseTime = (endTime - startTime).toFixed(2);
		const ageSeconds = Math.round((now - entry.timestamp) / 1000);

		if (!this.isDuplicateCall(`hit:${key}`)) {
			console.log(
				`${tc.blue('NotRedis')} ${tc.green('HIT')} ${tc.green(this.getDisplayKey(key))} [${responseTime}ms], [age: ${ageSeconds}s], [hits: ${entry.accessCount}]`,
			);
		}

		return entry.data;
	}

	/**
	 * Deletes a specific key from the cache
	 */
	public delete(key: string): boolean {
		const existed = this.cache.has(key);
		if (existed) {
			this.cache.delete(key);
			console.log(
				`${tc.blue('NotRedis')} ${tc.red('DELETE')} ${tc.dim(this.getDisplayKey(key))}`,
			);
		}
		return existed;
	}

	/**
	 * Clears the entire cache
	 */
	public clear(): void {
		const size = this.cache.size;
		// Calculate a reasonable duration based on cache size
		const calculatedDuration = Math.min(
			300,
			Math.max(10, Math.floor(size / 200)),
		);

		console.log(
			`${tc.blue('NotRedis')} ${tc.yellow('CLEAR')} Converting to rolling purge over ${calculatedDuration}s for ${tc.bold(`${size} entries`)}`,
		);

		this.rollingClear(calculatedDuration, 'lru');
	}

	/**
	 * Initiates a rolling cache purge over a specified duration
	 * @param durationSeconds The time over which to spread the purge (default: 60s)
	 * @param strategy The eviction strategy to use
	 */
	public rollingClear(
		durationSeconds: number = 60,
		strategy: 'lru' | 'lfa' | 'random' = 'lru',
	): void {
		// Cancel any active purge currently happening
		if (this.rollingPurgeActive) {
			this.cancelRollingPurge();
		}

		const size = this.cache.size;
		if (size === 0) {
			console.log(
				`${tc.blue('NotRedis')} ${tc.yellow('NOTICE')} Cache already empty`,
			);
			return;
		}

		// Sort entries based on the purge strategy
		const entries = Array.from(this.cache.entries());

		switch (strategy) {
			case 'lru':
				// Least Recently Used first
				entries.sort(
					(a, b) => a[1].lastAccessTime - b[1].lastAccessTime,
				);
				break;
			case 'lfa':
				// Least Frequently Accessed first
				entries.sort((a, b) => a[1].accessCount - b[1].accessCount);
				break;
			case 'random':
				// Shuffle array
				entries.sort(() => Math.random() - 0.5);
				break;
		}

		// Setup purge state
		this.rollingPurgeActive = true;
		this.rollingPurgeTarget = entries.map(([key]) => key);
		this.rollingPurgeTotal = this.rollingPurgeTarget.length;
		this.rollingPurgeCompleted = 0;
		this.rollingPurgeStartTime = Date.now();

		// Calculate timing parameters based on cache size and duration
		const purgeInterval = Math.max(
			50,
			Math.min(500, (durationSeconds * 1000) / Math.min(100, size)),
		);
		const batchSize = Math.max(
			1,
			Math.ceil(size / ((durationSeconds * 1000) / purgeInterval)),
		);

		console.log(
			`${tc.blue('NotRedis')} ${tc.yellow('ROLLING PURGE')} Starting staged purge of ${tc.bold(`${size} entries`)} over ${durationSeconds}s using ${strategy} strategy`,
		);

		// Start the purge
		this.rollingPurgeInterval = setInterval(() => {
			this.processPurgeBatch(batchSize, durationSeconds * 1000);
		}, purgeInterval);
	}

	/**
	 * Process a batch of items during rolling purge
	 */
	private processPurgeBatch(batchSize: number, totalDuration: number): void {
		if (!this.rollingPurgeActive || this.rollingPurgeTarget.length === 0) {
			this.finalizePurge();
			return;
		}

		// Calculate dynamic batch size based on time elapsed
		const elapsed = Date.now() - this.rollingPurgeStartTime;
		const progress = elapsed / totalDuration;
		const expectedProgress =
			this.rollingPurgeCompleted / this.rollingPurgeTotal;

		// Adjust batch size if we're behind/ahead of schedule
		let adjustedBatchSize = batchSize;
		if (progress > expectedProgress * 1.2) {
			// We're ahead of schedule, slow down
			adjustedBatchSize = Math.max(1, Math.floor(batchSize * 0.8));
		} else if (progress > expectedProgress * 1.5) {
			// We're way behind schedule, speed up
			adjustedBatchSize = Math.ceil(batchSize * 1.5);
		}

		// Get the next batch
		const batch = this.rollingPurgeTarget.splice(0, adjustedBatchSize);

		// Remove these entries and lock them
		for (const key of batch) {
			this.cache.delete(key);
			this.lockKeyFromReCaching(key);
			this.rollingPurgeCompleted++;
		}

		// Log progress at regular intervals
		const percentComplete = Math.round(
			(this.rollingPurgeCompleted / this.rollingPurgeTotal) * 100,
		);
		if (percentComplete % 10 === 0 && percentComplete > 0) {
			console.log(
				`${tc.blue('NotRedis')} ${tc.yellow('PURGE PROGRESS')} ${percentComplete}% complete (${this.rollingPurgeCompleted}/${this.rollingPurgeTotal})`,
			);
		}
	}

	/**
	 * Finalizes a rolling purge operation
	 */
	private finalizePurge(): void {
		if (this.rollingPurgeInterval) {
			clearInterval(this.rollingPurgeInterval);
			this.rollingPurgeInterval = null;
		}

		// Handle any remaining entries
		if (this.rollingPurgeTarget.length > 0) {
			for (const key of this.rollingPurgeTarget) {
				this.cache.delete(key);
				this.rollingPurgeCompleted++;
			}
		}

		const duration = (
			(Date.now() - this.rollingPurgeStartTime) /
			1000
		).toFixed(1);
		console.log(
			`${tc.blue('NotRedis')} ${tc.green('PURGE COMPLETE')} Cleared ${tc.bold(String(this.rollingPurgeCompleted))} entries over ${duration}s`,
		);

		// Clear all locks when purge is complete
		const lockCount = this.purgeLockSet.size;
		if (lockCount > 0) {
			console.log(
				`${tc.blue('NotRedis')} ${tc.yellow('LOCKS CLEARED')} Released ${lockCount} purge locks`,
			);
			this.purgeLockSet.clear();
		}

		// Reset state
		this.rollingPurgeActive = false;
		this.rollingPurgeTarget = [];
		this.rollingPurgeTotal = 0;
		this.rollingPurgeCompleted = 0;
		this.recentCalls.clear();
	}

	/**
	 * Cancels an active rolling purge
	 */
	public cancelRollingPurge(): void {
		if (!this.rollingPurgeActive) return;

		if (this.rollingPurgeInterval) {
			clearInterval(this.rollingPurgeInterval);
			this.rollingPurgeInterval = null;
		}

		console.log(
			`${tc.blue('NotRedis')} ${tc.red('PURGE CANCELED')} After clearing ${this.rollingPurgeCompleted} of ${this.rollingPurgeTotal} entries`,
		);

		this.rollingPurgeActive = false;
		this.rollingPurgeTarget = [];
		this.rollingPurgeTotal = 0;
		this.rollingPurgeCompleted = 0;
		this.purgeLockSet.clear();
	}

	/**
	 * Invalidates all cache entries containing the specified document ID
	 */
	public invalidateById(documentId: string): number {
		console.log(
			`${tc.blue('NotRedis')} ${tc.bold('INVALIDATE')} document ID: ${tc.dim(documentId)}`,
		);

		const keysToDelete: string[] = [];
		for (const key of this.cache.keys()) {
			if (key.includes(documentId)) {
				keysToDelete.push(key);
			}
		}

		if (keysToDelete.length === 0) {
			return 0;
		}

		// For small purges (<10 items), just delete immediately
		if (keysToDelete.length < 10) {
			for (const key of keysToDelete) {
				this.delete(key);
			}

			console.log(
				`${tc.blue('NotRedis')} Invalidated ${tc.bold(String(keysToDelete.length))} entries for document ID: ${tc.dim(documentId)}`,
			);
			return keysToDelete.length;
		}

		// For larger purges, use a rolling approach
		// Calculate duration based on number of entries (5-30 seconds)
		const duration = Math.min(
			30,
			Math.max(5, Math.floor(keysToDelete.length / 50)),
		);

		console.log(
			`${tc.blue('NotRedis')} Using rolling invalidation over ${duration}s for ${tc.bold(String(keysToDelete.length))} entries matching document ID: ${tc.dim(documentId)}`,
		);

		// Setup purge state
		this.rollingPurgeActive = true;
		this.rollingPurgeTarget = keysToDelete;
		this.rollingPurgeTotal = keysToDelete.length;
		this.rollingPurgeCompleted = 0;
		this.rollingPurgeStartTime = Date.now();

		const purgeInterval = Math.max(
			50,
			Math.min(
				300,
				(duration * 1000) / Math.min(50, keysToDelete.length),
			),
		);
		const batchSize = Math.max(
			1,
			Math.ceil(
				keysToDelete.length / ((duration * 1000) / purgeInterval),
			),
		);

		// Start the rolling purge
		this.rollingPurgeInterval = setInterval(() => {
			this.processPurgeBatch(batchSize, duration * 1000);
		}, purgeInterval);

		return keysToDelete.length;
	}

	/**
	 * Finds all cache keys containing the specified document ID
	 */
	public findKeysByDocumentId(documentId: string): string[] {
		const matchingKeys: string[] = [];

		for (const key of this.cache.keys()) {
			if (key.includes(documentId)) {
				matchingKeys.push(key);
			}
		}

		return matchingKeys;
	}

	/**
	 * Returns statistics about the current cache state
	 */
	public getStats(): {
		size: number;
		keys: string[];
		accessStats: Array<{ key: string; hits: number; lastAccess: number }>;
		cacheUtilization: number;
		averageAccessCount: number;
	} {
		const accessStats = Array.from(this.cache.entries())
			.map(([key, entry]) => ({
				key,
				hits: entry.accessCount,
				lastAccess: entry.lastAccessTime,
			}))
			.sort((a, b) => b.hits - a.hits); // Sort by most accessed

		// Calculate average access count
		let totalAccessCount = 0;
		for (const entry of this.cache.values()) {
			totalAccessCount += entry.accessCount;
		}
		const averageAccessCount =
			this.cache.size > 0 ? totalAccessCount / this.cache.size : 0;

		return {
			size: this.cache.size,
			keys: Array.from(this.cache.keys()),
			accessStats,
			cacheUtilization: this.cache.size / this.maxCacheSize,
			averageAccessCount,
		};
	}

	/**
	 * Prints detailed statistics about the cache
	 */
	public printStats(): void {
		const stats = this.getStats();
		console.log(tc.box(tc.bold(`NotRedis Cache Stats`)));
		console.log(
			`${tc.blue('Size:')} ${tc.bold(stats.size.toString())} entries (${Math.round(stats.cacheUtilization * 100)}% of max ${this.maxCacheSize})`,
		);
		console.log(
			`${tc.blue('Average hits per entry:')} ${tc.bold(stats.averageAccessCount.toFixed(2))}`,
		);
		console.log(
			`${tc.blue('Next cleanup in:')} ${tc.bold(String(Math.round((this.lastCleanupTime + this.cleanupInterval - Date.now()) / 60000)))} minutes`,
		);

		if (stats.size > 0) {
			console.log(`${tc.blue('Most accessed keys:')}`);
			stats.accessStats.slice(0, 10).forEach((stat, index) => {
				const entry = this.cache.get(stat.key);
				if (entry) {
					const now = Date.now();
					const ageSeconds = Math.round(
						(now - entry.timestamp) / 1000,
					);
					const ttlRemaining = Math.round(
						(entry.expiresAt - now) / 1000,
					);
					const lastAccessAgo = Math.round(
						(now - stat.lastAccess) / 1000,
					);
					console.log(
						`  ${index + 1}. ${tc.dim(this.getDisplayKey(stat.key))} (hits: ${stat.hits}, last: ${lastAccessAgo}s ago, age: ${ageSeconds}s, ttl: ${ttlRemaining}s)`,
					);
				}
			});
		}

		console.log(
			`${tc.blue('Recent calls:')} ${this.recentCalls.size} tracked`,
		);
	}
}

type CachePart = string | number | boolean | object;

export const createCacheKey = (
	prefix: string,
	...parts: CachePart[]
): string => {
	return `hygraph:${prefix}:${parts
		.map((p) => (typeof p === 'object' ? JSON.stringify(p) : p))
		.join(':')}`;
};
