import type { TSinglePage } from './get-page.ts';

import { GraphQLClient, gql } from 'graphql-request';
import { NotRedis, createCacheKey } from '~/services/notredis.ts';
import { tc } from '~/services/terminal-colours.ts';

export type TAllPages = {
	pages: TSinglePage[];
};

export const getPagesQuery = gql`
	{
		pages(where: { siteName: ${process.env.SITE_NAME} }, first: 100) {
			id
			slug
			parentPage {
				... on Page {
					slug
				}
			}
			childPages {
				slug
			}
		}
	}
`;

export const getAllPages = async (): Promise<TAllPages> => {
	let allPages: TAllPages;
	try {
		const hygraph = new GraphQLClient(process.env.HYGRAPH_ENDPOINT as string, {
			headers: {},
		});

		const cache = NotRedis.getInstance();
		const cacheKey = createCacheKey('id', 'pages', {});

		const cachedResult = cache.get(cacheKey);
		if (cachedResult) {
			allPages = cachedResult as TAllPages;
		} else {
			const startTime = performance.now();
			allPages = await hygraph.request(getPagesQuery);
			if (!allPages) {
				throw new Error('All pages - page not found');
			}
			const endTime = performance.now();
			const responseTime = (endTime - startTime).toFixed(2);
			console.log(
				`${tc.blue('Hygraph')} ${tc.dim('getPages')} ${tc.dim(allPages.pages.length.toString())} (${responseTime}ms)`,
			);

			cache.set(cacheKey, allPages);
		}
		return allPages;
	} catch (error) {
		console.error('Error fetching page data:', error);
		throw new Response('Page not found', { status: 404 });
	}
}
