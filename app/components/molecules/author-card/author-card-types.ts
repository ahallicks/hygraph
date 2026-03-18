import type { TButtonLink } from '../../atoms/button/button.tsx';
import type { RichTextProps } from '@graphcms/rich-text-react-renderer';

export interface IAuthorCard {
	__typename: 'AuthorCard';
	id: string;
	contentId: string;
	author: {
		id: string;
		name: string;
		biography: {
			raw: RichTextProps['content'];
		};
		emailAddress?: string;
		image?: {
			url: string;
			width: number;
			height: number;
		};
		socialLinks?: TButtonLink[];
	};
};
