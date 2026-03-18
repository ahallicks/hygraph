import type { RichTextProps } from '@graphcms/rich-text-react-renderer';
import type { TButtonLink } from '~/components/atoms/button/button.tsx';

export interface ICard {
	__typename: 'Card';
	id: string;
	contentId: string;
	cardListId: string;
	cardTitle: string;
	cardContent: {
		raw: RichTextProps['content'];
	};
	cardImage?: {
		width: number;
		height: number;
		url: string;
	};
	cardLinks: TButtonLink[];
}
