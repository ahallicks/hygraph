import type { SetupWorker } from 'msw/browser';

import { mswHandlers } from './handlers.ts';

// export const worker = setupWorker(...handlers)
let mswWorker: SetupWorker | null = null;

export const worker = async (): Promise<SetupWorker | undefined> => {
	if (typeof window !== 'undefined' && !mswWorker) {
		const { setupWorker } = await import('msw/browser');
		mswWorker = setupWorker(...mswHandlers);
		return mswWorker;
	}
};
