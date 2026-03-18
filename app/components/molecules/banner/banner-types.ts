import type { IStatistics } from '~/components/molecules/statistics/statistics-types.ts';
import type { RichTextProps } from '@graphcms/rich-text-react-renderer';
import type { TButtonLink } from '~/components/atoms/button/button.tsx';

export interface IBanner {
	__typename: 'Banner';
	id: string;
	contentId: string;
	title: string;
	content: {
		raw: RichTextProps['content'];
	};
	bannerImage?: {
		width: number;
		height: number;
		url: string;
	};
	flipped: boolean | null;
	links: TButtonLink[];
	bannerStats: IStatistics;
}
