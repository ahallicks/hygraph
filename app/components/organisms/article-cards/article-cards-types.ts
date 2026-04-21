import type { IArticleCard } from '~/components/molecules/article-card/article-card-types.ts';

export interface IArticleCards {
	__typename: 'ArticleCards';
	id: string;
	contentId: string;
	cardsTitle?: string;
	subtitle?: string;
	showCarousel?: boolean;
	pageReference: {
		id: string;
		slug: string;
		pageName: string;
		childPages: IArticleCard[];
	};
}
