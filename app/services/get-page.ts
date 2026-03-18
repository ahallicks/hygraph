import type { IArticleCards } from '~/components/organisms/article-cards/article-cards-types.ts';
import type { IAuthorCard } from '~/components/molecules/author-card/author-card-types.ts';
import type { IBanner } from '~/components/molecules/banner/banner-types.ts';
import type { ICardList } from '~/components/organisms/card-list/card-list-types.ts';
import type { IContent } from '~/components/molecules/content/content-types.ts';
import type { IDivider } from '~/components/atoms/divider/divider-types.ts';
import type { IFeatureBlock } from '~/components/molecules/feature/feature-types.ts';
import type { IHero } from '~/components/molecules/hero/hero-types.ts';
import type { IHomepage } from './get-homepage.ts';
import type { ILogoCloud } from '~/components/molecules/logo-cloud/logo-cloud-types.ts';
import type { IStatistics } from '~/components/molecules/statistics/statistics-types.ts';

import { GraphQLClient, gql } from 'graphql-request';

import { NotRedis, createCacheKey } from '~/services/notredis.ts';
import { fixThePage } from '~/utils/page-fixer.ts';
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
import { StatisticsFragment } from '~/components/molecules/statistics/statistics-fragment.ts';

export interface IPage {
	id: string;
	pageName: string;
	seoDescription?: string;
	slug: string;
	introduction?: string;
	sections: ICardList[] | IHero[] | IFeatureBlock[] | IStatistics[] | IBanner[] | ILogoCloud[] | IContent[] | IArticleCards[] | IAuthorCard[] | IDivider[];
}

export type TSinglePage = {
	id: string;
	slug: string;
	parentPage: {
		slug: string;
	} | null;
	childPages: {
		slug: string;
	}[];
} | undefined;

export const getPage = async ({ filePath }: { filePath?: string; }): Promise<IPage> => {
	const fileParts = filePath ? filePath.split('/') : [];
	const slug = fileParts.at(-1);

	try {
		const hygraph = new GraphQLClient(process.env.HYGRAPH_ENDPOINT as string, {
			headers: {},
		});

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
			return pagedCachedResult as IPage;
		}

		const pageStartTime = performance.now();
		const pageQuery = gql`
			{
				page(where: { id: "${thisPage.id}" }) {
					id
					pageName
					seoDescription
					slug
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
					}
				}
			}
		`;

		const { page }: { page: IPage } = await hygraph.request(pageQuery);
		if (!page) {
			throw new Response('Page not found', { status: 404 });
		}

		const pageEndTime = performance.now();
		const responseTime = (pageEndTime - pageStartTime).toFixed(2);
		console.log(
			`${tc.blue('Hygraph')} ${tc.dim('getPage')} ${tc.dim(thisPage.id)} (${responseTime}ms)`,
		);
		pageCache.set(pageCacheKey, page);
		return fixThePage<IPage>(page);
	} catch (error) {
		console.error('Error fetching page data:', error);
		throw new Response('Page not found', { status: 404 });
	}
};

export const getPreviewPage = async (id: string, isHome?: boolean): Promise<IPage | IHomepage> => {
	const hygraph = new GraphQLClient(process.env.HYGRAPH_ENDPOINT as string, {
		headers: {
			Authorization: `Bearer ${process.env.HYGRAPH_DEV_AUTH_TOKEN}`,
		},
	});

	try {
		const pageQuery = isHome ? gql`{
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
				}` : gql`
				{
					page(where: { id: "${id}" }, stage: DRAFT) {
						id
						pageName
						seoDescription
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
						}
					}
				}
			`;

		if (isHome) {
			const { homepage }: { homepage: IHomepage } = await hygraph.request(pageQuery);
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
