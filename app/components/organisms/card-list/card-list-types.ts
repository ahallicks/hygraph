import type { RichTextProps } from '@graphcms/rich-text-react-renderer';
import type { ICard } from '~/components/molecules/card/card-types.ts';

export interface ICardList {
	__typename: 'CardList';
	id: string;
	contentId: string;
	cardListTitle: string;
	cardListContent: {
		json: RichTextProps['content'];
		references: {
			__typename: 'Asset';
			width: number;
			height: number;
			url: string;
		};
	};
	cards: ICard[];
}
