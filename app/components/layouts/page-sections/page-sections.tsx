import type { IPage } from '~/services/get-page.ts';
import type { IHomepage } from '~/services/get-homepage.ts';

import { Fragment } from 'react/jsx-runtime';

import { ArticleCards } from '~/components/organisms/article-cards/article-cards.tsx';
import { AuthorCard } from '~/components/molecules/author-card/author-card.tsx';
import { Banner, BannerSmall } from '~/components/molecules/banner/banner.tsx';
import { CardList } from '~/components/organisms/card-list/card-list.tsx';
import { Content } from '~/components/molecules/content/content.tsx';
import { Features } from '~/components/molecules/feature/feature.tsx';
import { Hero } from '~/components/molecules/hero/hero.tsx';
import { LogoCloud } from '~/components/molecules/logo-cloud/logo-cloud.tsx';
import { Statistics } from '~/components/molecules/statistics/statistics.tsx';
import {
	Divider,
	DividerWithText,
} from '~/components/atoms/divider/divider.tsx';
import { RelatedArticles } from '~/components/organisms/related-articles/related-articles.tsx';

export const PageSections: React.FC<{ page: IPage | IHomepage }> = ({
	page,
}) => (
	<>
		{page.sections.map((section, index) => (
			<Fragment key={`${section.__typename}-${index}`}>
				{/* Render hero section */}
				{section.__typename === 'Hero' ? (
					<Hero {...section} contentId={page.id} />
				) : null}
				{/* Render feature section */}
				{section.__typename === 'FeatureBlock' ? (
					<Features {...section} contentId={page.id} />
				) : null}
				{/* Render statistics section */}
				{section.__typename === 'Statistics' ? (
					<Statistics {...section} contentId={page.id} />
				) : null}
				{/* Render banner section */}
				{section.__typename === 'Banner' ? (
					section.bannerImage ? (
						<BannerSmall {...section} contentId={page.id} />
					) : (
						<Banner {...section} contentId={page.id} />
					)
				) : null}
				{section.__typename === 'LogoCloud' ? (
					<LogoCloud {...section} contentId={page.id} />
				) : null}
				{section.__typename === 'Content' ? (
					<Content
						{...section}
						contentId={page.id}
						categories={(page as IPage).categories}
					/>
				) : null}
				{section.__typename === 'ArticleCards' ? (
					<ArticleCards {...section} contentId={page.id} />
				) : null}
				{section.__typename === 'AuthorCard' && section.author ? (
					<>
						<Divider noSpacing={true} />
						<AuthorCard {...section} contentId={page.id} />
					</>
				) : null}
				{section.__typename === 'CardList' ? (
					<CardList {...section} contentId={page.id} />
				) : null}
				{section.__typename === 'Divider' ? (
					section.text ? (
						<DividerWithText {...section} contentId={page.id} />
					) : (
						<Divider />
					)
				) : null}
				{section.__typename === 'RelatedArticles' ? (
					<>
						<Divider noSpacing={true} />
						<RelatedArticles {...section} contentId={page.id} />
					</>
				) : null}
			</Fragment>
		))}
	</>
);
