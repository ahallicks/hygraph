import type { TImage } from '~/types/global-types.ts';
import type { IFeatureBlock } from '../feature/feature-types.ts';
import type { IBanner } from '../banner/banner-types.ts';
import type { RichTextProps } from "@graphcms/rich-text-react-renderer";

export interface IArticle {
	__typename: 'Article';
	id: string;
	contentId: string;
	content?: {
		raw?: RichTextProps['content'];
		json?: RichTextProps['content'];
		references?: RichTextProps['references'];
	};
}

export interface IContent {
	__typename: 'Content';
	id: string;
	contentId: string;
	title?: string;
	pretitle?: string;
	introduction?: string;
	contentImage?: TImage;
	article?: IBanner[] | IArticle[] | IFeatureBlock[];
}

/**
 * {
		__typename: 'Article' | 'FeatureBlock' | 'Banner';
		id: string;
		content?: {
			raw?: RichTextProps['content'];
			json?: RichTextProps['content'];
			references?: RichTextProps['references'];
		};
		features?: IFeature[];
	}
 */