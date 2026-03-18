import { ButtonLink } from '~/components/atoms/button/button.tsx';
import type { ICard } from './card-types.ts';

import { RichText } from '@graphcms/rich-text-react-renderer';

export const Card: React.FC<ICard> = ({
	id,
	contentId,
	cardListId,
	cardTitle,
	cardContent,
	cardImage,
	cardLinks,
}) => (
	<div className="flex flex-col gap-4 bg-neutral-primary-soft p-6 rounded-md shadow-xs dark:bg-gray-950 ring-1 ring-gray-900/10 dark:ring-white/10">
		{cardImage ? (
			<img
				className="rounded-base"
				src={cardImage.url}
				width={cardImage.width}
				height={cardImage.height}
				alt=""
				data-hygraph-entry-id={contentId}
				data-hygraph-field-api-id="cardImage"
				data-hygraph-component-chain={`[{"fieldApiId":"Sections","instanceId":"${cardListId}"},{"fieldApiId":"Cards","instanceId":"${id}"}]`}
			/>
		) : null}
		<h3
			className="text-2xl font-semibold tracking-tight text-heading text-gray-900 dark:text-gray-300"
			data-hygraph-entry-id={contentId}
			data-hygraph-field-api-id="cardTitle"
			data-hygraph-component-chain={`[{"fieldApiId":"Sections","instanceId":"${cardListId}"},{"fieldApiId":"Cards","instanceId":"${id}"}]`}
		>
			{cardTitle}
		</h3>
		<div
			data-hygraph-entry-id={contentId}
			data-hygraph-field-api-id="cardContent"
			data-hygraph-component-chain={`[{"fieldApiId":"Sections","instanceId":"${cardListId}"},{"fieldApiId":"Cards","instanceId":"${id}"}]`}
			data-hygraph-rich-text-format="html"
			className="prose text-gray-700 dark:text-gray-400"
		>
			<RichText content={cardContent.raw} />
		</div>
		{cardLinks?.length ? (
			<div className="flex flex-wrap gap-4 mt-auto">
				{cardLinks.map((link) => (
					<ButtonLink
						key={link.id}
						{...link}
						data-hygraph-entry-id={contentId}
						data-hygraph-field-api-id="linkText"
						data-hygraph-component-chain={`[{"fieldApiId":"Sections","instanceId":"${cardListId}"},{"fieldApiId":"Cards","instanceId":"${id}"},{"fieldApiId":"cardLinks","instanceId":"${link.id}"}]`}
					/>
				))}
			</div>
		) : null}
		{/* <a
			href="#"
			className="inline-flex items-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
		>
			Read more
			<svg
				className="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M19 12H5m14 0-4 4m4-4-4-4"
				/>
			</svg>
		</a> */}
	</div>
);
