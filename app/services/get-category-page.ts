import type { IArticleCard } from '~/components/molecules/article-card/article-card-types.ts';
import type { TCategoryPage } from '~/types/global-types.ts';
import type { IPage } from './get-page.ts';
import type { RichTextProps } from '@graphcms/rich-text-react-renderer';

// import { writeFileSync } from 'node:fs';
import { GraphQLClient, gql } from 'graphql-request';

import { NotRedis, createCacheKey } from '~/services/notredis.ts';
import { fixThePage } from '~/utils/page-fixer.ts';
import { tc } from '~/services/terminal-colours.ts';

import { AuthorCardFragment } from '~/components/molecules/author-card/author-card-fragment.ts';

export interface ICategoryPage {
	articleCategory: {
		id: string;
		categoryName: string;
		description: RichTextProps['content'];
		slug: string;
	};
	pages: IArticleCard[];
}

// The actual query to get the current page
const getPageQuery = (slug: string): string => gql`
{
	pages (where: { articleCategories_some: { slug: "${slug}" }  }, orderBy: updatedAt_DESC) {
		... on Page {
			id
			slug
			pageName
			introduction
			published: publishedAt
			created: createdAt
			updated: updatedAt
			createdBy {
				... on User {
					id
					name
					picture
				}
			}
			categories: articleCategories {
				... on ArticleCategory {
					id
					categoryName
					slug
				}
			}
			sections {
				__typename
				${AuthorCardFragment}
			}
			parentPage {
				... on Page {
					id
					slug
				}
			}
		}
	}
	articleCategory (where: { slug : "${slug}" }) {
		... on ArticleCategory {
			id
			categoryName
			description {
				raw
			}
		}
	}
}
`;

export const getCategoryPage = async ({
	slug,
}: {
	slug: string;
}): Promise<ICategoryPage> => {
	try {
		const hygraph = new GraphQLClient(
			process.env.HYGRAPH_ENDPOINT as string,
			{
				headers: {},
			},
		);

		const pageCache = NotRedis.getInstance();
		const pageCacheKey = createCacheKey('id', `category:${slug}`, {});

		const pagedCachedResult = pageCache.get(pageCacheKey);
		if (pagedCachedResult) {
			// writeFileSync('cachedPage.json', JSON.stringify(pagedCachedResult, null, 2));
			return { ...pagedCachedResult } as ICategoryPage;
		}

		const pageStartTime = performance.now();
		const pageQuery = getPageQuery(slug);

		// If required spit out the query to debug it
		// writeFileSync('pageQuery.gql', pageQuery);

		const { articleCategory, pages }: ICategoryPage =
			await hygraph.request(pageQuery);
		if (!articleCategory) {
			throw new Response('Page not found', { status: 404 });
		}

		const pageEndTime = performance.now();
		const responseTime = (pageEndTime - pageStartTime).toFixed(2);
		console.log(
			`${tc.blue('Hygraph')} ${tc.dim('getPage')} ${tc.dim(slug)} (${responseTime}ms)`,
		);

		// If required write out the raw page data to debug it
		// writeFileSync('fetchedPage.json', JSON.stringify(fixThePage<IPage>(page), null, 2));
		pages.map((page) =>
			fixThePage<TCategoryPage>(page as unknown as IPage),
		);

		pageCache.set(pageCacheKey, { articleCategory, pages });

		return { articleCategory, pages };
	} catch (error) {
		console.error('Error fetching page data:', error);
		throw new Response('Page not found', { status: 404 });
	}
};
