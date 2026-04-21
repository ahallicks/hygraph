import type { IArticleCards } from './article-cards-types.ts';

import {
	Carousel,
	CarouselButtons,
	CarouselContainer,
} from '~/components/layouts/carousel/carousel.tsx';
import { ArticleCard } from '~/components/molecules/article-card/article-card.tsx';

export const ArticleCards: React.FC<IArticleCards> = ({
	id,
	cardsTitle,
	subtitle,
	showCarousel,
	pageReference,
	contentId,
}) => {
	return (
		<section className="segment bg-white dark:bg-gray-900">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				{cardsTitle || subtitle ? (
					<div className="mx-auto max-w-2xl lg:mx-0">
						{cardsTitle ? (
							<h2
								className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-gray-300"
								data-hygraph-entry-id={contentId}
								data-hygraph-field-api-id="title"
								data-hygraph-component-chain={`[{"fieldApiId":"Sections","instanceId":"${id}"},{"fieldApiId":"Article Cards","instanceId":"${id}"}]`}
							>
								{cardsTitle}
							</h2>
						) : null}
						{subtitle ? (
							<p
								className="mt-2 mb-12 text-lg/8 text-gray-600 dark:text-gray-400"
								data-hygraph-entry-id={contentId}
								data-hygraph-field-api-id="subtitle"
								data-hygraph-component-chain={`[{"fieldApiId":"Sections","instanceId":"${id}"},{"fieldApiId":"Article Cards","instanceId":"${id}"}]`}
							>
								{subtitle}
							</p>
						) : null}
					</div>
				) : null}
				{pageReference?.childPages?.length ? (
					showCarousel ? (
						<CarouselContainer steps={1}>
							<CarouselButtons />
							<Carousel>
								{pageReference.childPages.map((post) => (
									<li
										key={post.id}
										className="flex snap-start"
									>
										<ArticleCard
											post={post}
											contentId={contentId}
										/>
									</li>
								))}
							</Carousel>
						</CarouselContainer>
					) : (
						<ul className="mx-auto grid max-w-2xl grid-cols-1 gap-4 pt-4 pb-10 md:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 xl:gap-8 dark:border-gray-700">
							{pageReference.childPages.map((post) => (
								<li key={post.id} className="flex snap-start">
									<ArticleCard
										post={post}
										contentId={contentId}
									/>
								</li>
							))}
						</ul>
					)
				) : null}
			</div>
		</section>
	);
};
