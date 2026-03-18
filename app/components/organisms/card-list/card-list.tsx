import type { ICardList } from './card-list-types.ts';

import { RichText } from '@graphcms/rich-text-react-renderer';

import { Card } from '~/components/molecules/card/card.tsx';

export const CardList: React.FC<ICardList> = ({
	id,
	cardListTitle,
	cardListContent,
	cards,
	contentId,
}) => (
	<section className="px-6 bg-white segment dark:bg-gray-900 lg:px-0">
		<div className="flex flex-col max-w-2xl mx-auto lg:max-w-7xl lg:px-8 lg:items-start gap-y-16 lg:gap-y-10">
			<div className="lg:max-w-lg">
				{cardListTitle ? (
					<h2
						className="text-4xl font-semibold tracking-tight text-gray-900 text-pretty dark:text-gray-300 sm:text-5xl"
						data-hygraph-entry-id={contentId}
						data-hygraph-field-api-id="cardListTitle"
						data-hygraph-component-chain={`[{"fieldApiId":"sections","instanceId":"${id}"},{"fieldApiId":"CardList","instanceId":"${id}"}]`}
					>
						{cardListTitle}
					</h2>
				) : null}
				{cardListContent?.json ? (
					<div
						className="mt-6 prose text-gray-700 text-xl/8 dark:text-gray-400"
						data-hygraph-entry-id={contentId}
						data-hygraph-field-api-id="cardListContent"
						data-hygraph-component-chain={`[{"fieldApiId":"sections","instanceId":"${id}"},{"fieldApiId":"CardList","instanceId":"${id}"}]`}
					>
						<RichText content={cardListContent.json} />
					</div>
				) : null}
			</div>
			{cards?.length ? (
				<ul className="grid grid-cols-1 gap-8 pt-10 border-t border-gray-200 md:grid-cols-2 dark:border-gray-700 sm:pt-16 lg:mx-0 lg:grid-cols-3">
					{cards.map((card) => (
						<li key={card.id} className="flex w-full gap-6">
							<Card
								{...card}
								cardListId={id}
								contentId={contentId}
							/>
						</li>
					))}
				</ul>
			) : null}
		</div>
	</section>
);
