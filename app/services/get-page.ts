import type { IArticleCards } from '~/components/organisms/article-cards/article-cards-types.ts';
import type { IAuthorCard } from '~/components/molecules/author-card/author-card-types.ts';
import type { IBanner } from '~/components/molecules/banner/banner-types.ts';
import type { ICardList } from '~/components/organisms/card-list/card-list-types.ts';
import type { TCategoryPage } from '~/types/global-types.ts';
import type { IContent } from '~/components/molecules/content/content-types.ts';
import type { IDivider } from '~/components/atoms/divider/divider-types.ts';
import type { IFeatureBlock } from '~/components/molecules/feature/feature-types.ts';
import type { IHero } from '~/components/molecules/hero/hero-types.ts';
import type { IHomepage } from './get-homepage.ts';
import type { ILogoCloud } from '~/components/molecules/logo-cloud/logo-cloud-types.ts';
import type { IRelatedArticles } from '~/components/organisms/related-articles/related-articles-types.ts';
import type { IStatistics } from '~/components/molecules/statistics/statistics-types.ts';

// import { writeFileSync } from 'node:fs';
import { GraphQLClient, gql } from 'graphql-request';

import { NotRedis, createCacheKey } from '~/services/notredis.ts';
import { fixThePage, randomiseThePage } from '~/utils/page-fixer.ts';
import { tc } from '~/services/terminal-colours.ts';
import { getAllPages } from './get-all-pages.ts';

import { ArticleCardsFragment } from '~/components/organisms/article-cards/article-cards-fragment.ts';
import { AuthorCardFragment } from '~/components/molecules/author-card/author-card-fragment.ts';
import { BannerFragment } from '~/components/molecules/banner/banner-fragment.tsx';
import { CardListFragment } from '~/components/organisms/card-list/card-list-fragment.ts';
import { ContentFragment } from '~/components/molecules/content/content-fragment.ts';
import { DividerFragment } from '~/components/atoms/divider/divider-fragment.ts';
import { FeatureFragment } from '~/components/molecules/feature/feature-fragment.tsx';
import { HeroFragment } from '~/components/molecules/hero/hero-fragment.tsx';
import { LogoCloudFragment } from '~/components/molecules/logo-cloud/logo-cloud-fragment.ts';
import {
	ArticleCategoryFragment,
	RelatedArticlesFragment,
} from '~/components/organisms/related-articles/related-articles-fragment.ts';
import { StatisticsFragment } from '~/components/molecules/statistics/statistics-fragment.ts';

export interface IPage {
	id: string;
	pageName: string;
	seoDescription?: string;
	slug: string;
	categories?: {
		id: string;
		categoryName: string;
		slug: string;
		pages: TCategoryPage[];
	}[];
	introduction?: string;
	sections:
		| ICardList[]
		| IHero[]
		| IFeatureBlock[]
		| IStatistics[]
		| IBanner[]
		| ILogoCloud[]
		| IContent[]
		| IArticleCards[]
		| IAuthorCard[]
		| IDivider[]
		| IRelatedArticles[];
}

// The actual query to get the current page
const getPageQuery = (id: string): string => gql`
{
	page(where: { id: "${id}" }) {
		id
		pageName
		seoDescription
		slug
		categories: articleCategories {
			${ArticleCategoryFragment(id)}
		}
		introduction
		sections {
			__typename
			${ArticleCardsFragment}
			${AuthorCardFragment}
			${BannerFragment}
			${CardListFragment}
			${ContentFragment}
			${FeatureFragment}
			${HeroFragment}
			${LogoCloudFragment}
			${StatisticsFragment}
			${DividerFragment}
			${RelatedArticlesFragment}
		}
	}
}
`;

export type TSinglePage =
	| {
			id: string;
			slug: string;
			parentPage: {
				slug: string;
			} | null;
			childPages: {
				slug: string;
			}[];
	  }
	| undefined;

export const getPage = async ({
	filePath,
}: {
	filePath?: string;
}): Promise<IPage> => {
	const fileParts = filePath ? filePath.split('/') : [];
	const slug = fileParts.at(-1);

	try {
		const allPages = await getAllPages();

		const thisPage = allPages.pages.find((page) =>
			fileParts.length > 1
				? page?.slug === slug &&
					page?.parentPage?.slug === fileParts.at(-2)
				: page?.slug === slug,
		);

		if (!thisPage) {
			throw new Error('Page not found');
		}

		const pageCache = NotRedis.getInstance();
		const pageCacheKey = createCacheKey('id', thisPage.id, {});

		const pagedCachedResult = pageCache.get(pageCacheKey);
		if (pagedCachedResult) {
			// writeFileSync('cachedPage.json', JSON.stringify(pagedCachedResult, null, 2));
			return randomiseThePage(pagedCachedResult as IPage);
		}

		const pageStartTime = performance.now();
		const pageQuery = getPageQuery(thisPage.id);

		// If required spit out the query to debug it
		// writeFileSync('pageQuery.gql', pageQuery);
		const hygraph = new GraphQLClient(
			process.env.HYGRAPH_ENDPOINT as string,
		);

		const { page }: { page: IPage } = await hygraph.request(pageQuery);
		if (!page) {
			throw new Response('Page not found', { status: 404 });
		}

		const pageEndTime = performance.now();
		const responseTime = (pageEndTime - pageStartTime).toFixed(2);
		console.log(
			`${tc.blue('Hygraph')} ${tc.dim('getPage')} ${tc.dim(thisPage.id)} (${responseTime}ms)`,
		);

		// If required write out the raw page data to debug it
		// writeFileSync('fetchedPage.json', JSON.stringify(fixThePage<IPage>(page), null, 2));

		const fixedPage = fixThePage<IPage>(page);

		pageCache.set(pageCacheKey, fixedPage);
		return randomiseThePage(fixedPage);
	} catch (error) {
		console.error('Error fetching page data:', error);
		throw new Response('Page not found', { status: 404 });
	}
};

export const getPreviewPage = async (
	id: string,
	isHome?: boolean,
): Promise<IPage | IHomepage> => {
	const hygraph = new GraphQLClient(process.env.HYGRAPH_ENDPOINT as string, {
		headers: {
			Authorization: `Bearer ${process.env.HYGRAPH_DEV_AUTH_TOKEN}`,
		},
	});

	try {
		const pageQuery = isHome
			? gql`{
					homepage(where: { siteName: ${process.env.SITE_NAME} }, stage: DRAFT) {
						pageName
						seoDescription
						sections {
							__typename
							${ArticleCardsFragment}
							${CardListFragment}
							${BannerFragment}
							${ContentFragment}
							${FeatureFragment}
							${HeroFragment}
							${LogoCloudFragment}
							${DividerFragment}
						}
					}
				}`
			: getPageQuery(id);

		if (isHome) {
			const { homepage }: { homepage: IHomepage } =
				await hygraph.request(pageQuery);
			if (!homepage) {
				throw new Response('Page not found', { status: 404 });
			}
			return fixThePage<IHomepage>(homepage);
		}
		const { page }: { page: IPage } = await hygraph.request(pageQuery);
		if (!page) {
			throw new Response('Page not found', { status: 404 });
		}

		return fixThePage<IPage>(page);
	} catch (error) {
		console.error('Error fetching page data:', error);
		throw new Response('Page not found', { status: 404 });
	}
};
