import type { RichTextProps } from '@graphcms/rich-text-react-renderer';
import type { IAuthorCard } from '~/components/molecules/author-card/author-card-types.ts';

export type TImage = {
	url: string;
	width: number;
	height: number;
};

export type TNavLink = {
	linkText: string;
	linkUrl: string;
	variation?: 'primary' | 'secondary' | 'tertiary';
};

export type TAuthor = {
	id: string;
	name: string;
	picture: string;
};

export type TCategoryPage = {
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

export type TCategory = {
	id: string;
	categoryName: string;
	description?: {
		raw: RichTextProps['content'];
	};
	slug: string;
};
