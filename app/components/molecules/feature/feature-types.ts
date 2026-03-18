import type { RichTextContent } from '@graphcms/rich-text-types';
import type { TImage } from '~/types/global-types.ts';

export interface IFeatureBlock {
	__typename: 'FeatureBlock';
	id: string;
	contentId: string;
	title: string;
	pretitle: string;
	content: {
		html: string;
		raw: RichTextContent;
	};
	image: TImage;
	features: IFeature[];
};

export interface IFeature {
	__typename: 'Feature';
	contentId: string;
	title: string;
	headline: string;
	description: string;
	icon: string;
}
