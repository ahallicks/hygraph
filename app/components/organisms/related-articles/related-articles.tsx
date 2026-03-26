import {
	RichText,
	type RichTextProps,
} from '@graphcms/rich-text-react-renderer';
import type { IRelatedArticles } from './related-articles-types.ts';

import { ArticleCard } from '~/components/molecules/article-card/article-card.tsx';
import {
	Carousel,
	CarouselButtons,
	CarouselContainer,
} from '~/components/layouts/carousel/carousel.tsx';

const rte: RichTextProps['renderers'] = {
	p: ({ children }) => (
		<p className="mt-2 text-lg/8 text-gray-600 dark:text-gray-400">
			{children}
		</p>
	),
};

export const RelatedArticles: React.FC<IRelatedArticles> = ({
	id,
	relatedTitle,
	relatedContent,
	pages,
	contentId,
}) => {
	return (
		<section className="segment bg-white dark:bg-gray-900">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				{relatedTitle || relatedContent ? (
					<div className="mx-auto mb-8 max-w-2xl lg:mx-0">
						{relatedTitle ? (
							<h2
								className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-gray-300"
								data-hygraph-entry-id={contentId}
								data-hygraph-field-api-id="title"
								data-hygraph-component-chain={`[{"fieldApiId":"Sections","instanceId":"${id}"},{"fieldApiId":"Article Cards","instanceId":"${id}"}]`}
							>
								{relatedTitle}
							</h2>
						) : null}
						{relatedContent ? (
							<RichText
								content={relatedContent.raw}
								renderers={rte}
							/>
						) : null}
					</div>
				) : null}
				{pages?.length ? (
					<CarouselContainer steps={1}>
						<CarouselButtons />
						<Carousel>
							{pages.map((post) => (
								<li key={post.id} className="flex snap-start">
									<ArticleCard
										post={post}
										contentId={contentId}
									/>
								</li>
							))}
						</Carousel>
					</CarouselContainer>
				) : null}
			</div>
		</section>
	);
};
