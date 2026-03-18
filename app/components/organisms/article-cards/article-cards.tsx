import type { IArticleCards } from './article-cards-types.ts';

import { ArticleCard } from '~/components/molecules/article-card/article-card.tsx';

export const ArticleCards: React.FC<IArticleCards> = ({
	id,
	cardsTitle,
	subtitle,
	pageReference,
	contentId,
}) => {
	return (
		<section className="bg-white dark:bg-gray-900 segment">
			<div className="px-6 mx-auto max-w-7xl lg:px-8">
				{cardsTitle || subtitle ? (
					<div className="max-w-2xl mx-auto lg:mx-0">
						{cardsTitle ? (
							<h2
								className="text-4xl font-semibold tracking-tight text-gray-900 text-pretty sm:text-5xl dark:text-gray-300"
								data-hygraph-entry-id={contentId}
								data-hygraph-field-api-id="title"
								data-hygraph-component-chain={`[{"fieldApiId":"Sections","instanceId":"${id}"},{"fieldApiId":"Article Cards","instanceId":"${id}"}]`}
							>
								{cardsTitle}
							</h2>
						) : null}
						{subtitle ? (
							<p
								className="mt-2 text-gray-600 text-lg/8 dark:text-gray-400"
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
					<ul className="grid max-w-2xl grid-cols-1 gap-8 pt-10 mx-auto mt-10 border-t border-gray-200 dark:border-gray-700 sm:mt-16 sm:pt-16 md:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
						{pageReference.childPages.map((post) => (
							<li key={post.id} className="flex">
								<ArticleCard
									post={post}
									contentId={contentId}
								/>
							</li>
						))}
					</ul>
				) : null}
			</div>
		</section>
	);
};
