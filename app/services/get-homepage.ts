import type { IArticleCards } from '~/components/organisms/article-cards/article-cards-types.ts';
import type { IBanner } from '~/components/molecules/banner/banner-types.ts';
import type { IContent } from '~/components/molecules/content/content-types.ts';
import type { IDivider } from '~/components/atoms/divider/divider-types.ts';
import type { IFeatureBlock } from '~/components/molecules/feature/feature-types.ts';
import type { IHero } from '~/components/molecules/hero/hero-types.ts';
import type { ILogoCloud } from '~/components/molecules/logo-cloud/logo-cloud-types.ts';

import { GraphQLClient, gql } from 'graphql-request';

import { NotRedis, createCacheKey } from '~/services/notredis.ts';
import { fixThePage } from '~/utils/page-fixer.ts';
import { tc } from '~/services/terminal-colours.ts';

import { ArticleCardsFragment } from '~/components/organisms/article-cards/article-cards-fragment.ts';
import { BannerFragment } from '~/components/molecules/banner/banner-fragment.tsx';
import { ContentFragment } from '~/components/molecules/content/content-fragment.ts';
import { DividerFragment } from '~/components/atoms/divider/divider-fragment.ts';
import { FeatureFragment } from '~/components/molecules/feature/feature-fragment.tsx';
import { HeroFragment } from '~/components/molecules/hero/hero-fragment.tsx';
import { LogoCloudFragment } from '~/components/molecules/logo-cloud/logo-cloud-fragment.ts';

export interface IHomepage {
	id: string;
	pageName: string;
	seoDescription?: string;
	sections: IHero[] | IFeatureBlock[] | IBanner[] | ILogoCloud[] | IContent[] | IArticleCards[] | IDivider[];
}

const getHomepageQuery = gql`
	{
		homepage(where: { siteName: ${process.env.SITE_NAME} }) {
			id
			pageName
			seoDescription
			sections {
				__typename
				${HeroFragment}
				${FeatureFragment}
				${BannerFragment}
				${LogoCloudFragment}
				${ContentFragment}
				${ArticleCardsFragment}
				${DividerFragment}
			}
		}
	}
`;

export const getHomepage = async (): Promise<IHomepage> => {
	try {
		const cache = NotRedis.getInstance();
		const cacheKey = createCacheKey('id', 'homepage', {});

		const cachedResult = cache.get(cacheKey);
		if (cachedResult) {
			return cachedResult as IHomepage;
		}

		const startTime = performance.now();
		const hygraph = new GraphQLClient(process.env.HYGRAPH_ENDPOINT as string, {
			headers: {},
		});

		const { homepage }: { homepage: IHomepage } =
			await hygraph.request(getHomepageQuery);
		const endTime = performance.now();
		const responseTime = (endTime - startTime).toFixed(2);
		console.log(
			`${tc.blue('Hygraph')} ${tc.dim('getHomepage')} ${tc.dim(homepage.id)} (${responseTime}ms)`,
		);

		cache.set(cacheKey, homepage);
		return fixThePage<IHomepage>(homepage);
	} catch (error) {
		console.error('Error fetching page data:', error);
		throw new Response('Page not found', { status: 404 });
	}
}
