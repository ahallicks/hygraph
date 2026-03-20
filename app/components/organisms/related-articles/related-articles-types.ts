import type { RichTextProps } from '@graphcms/rich-text-react-renderer';
import type { IArticleCard } from '~/components/molecules/article-card/article-card-types.ts';

export interface IRelatedArticles {
	__typename: 'RelatedArticles';
	id: string;
	contentId: string;
	relatedTitle?: string;
	relatedContent?: {
		raw: RichTextProps['content'];
	};
	pages: IArticleCard[];
}
