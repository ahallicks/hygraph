import type { RichTextContent } from '@graphcms/rich-text-types';
import type { TButtonLink } from '~/components/atoms/button/button.tsx';

export interface IHero {
	__typename: 'Hero';
	id: string;
	keyline?: {
		html: string;
		raw: RichTextContent;
	};
	title: string;
	content?: {
		html: string;
		raw: RichTextContent;
	};
	links: TButtonLink[];
};
