import type { TAuthor } from '~/types/global-types.ts';
import type { IAuthorCard } from '~/components/molecules/author-card/author-card-types.ts';

export interface IArticleCard {
	id: string;
	slug: string;
	pageName: string;
	introduction?: string;
	published?: string;
	created: string;
	updated?: string;
	createdBy: TAuthor;
	parentPage?: {
		id: string;
		slug: string;
	};
	sections?: IAuthorCard[];
};
