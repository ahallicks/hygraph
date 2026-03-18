import type { IAuthorCard } from './author-card-types.ts';

import { RichText } from '@graphcms/rich-text-react-renderer';

import { ButtonLink } from '~/components/atoms/button/button.tsx';

export const AuthorCardMini: React.FC<IAuthorCard> = ({ author }) => (
	<div className="relative mt-8 flex items-center gap-x-4 justify-self-end">
		{author.image ? (
			<img
				alt=""
				src={author.image.url}
				className="size-10 rounded-full bg-gray-50 dark:bg-gray-800"
				width={author.image.width}
				height={author.image.height}
			/>
		) : null}
		<div className="text-sm/6">
			<p className="font-semibold text-gray-900 dark:text-gray-300">
				<a href={author.id}>
					<span className="absolute inset-0" />
					{author.name}
				</a>
			</p>
			{/* <p className="text-gray-600">{post.createdBy.role}</p> */}
		</div>
	</div>
);

export const AuthorCard: React.FC<IAuthorCard> = ({
	id,
	author,
	contentId,
}) => (
	<section className="segment mx-auto max-w-7xl px-6 lg:px-8">
		<div className="flex items-center justify-center dark:bg-gray-900">
			<div className="relative w-full max-w-2xl flex flex-col items-start space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 px-4 py-8 border-2 border-dashed border-gray-400 dark:border-gray-400 shadow-lg rounded-lg">
				<span className="absolute text-xs font-medium top-0 left-0 rounded-br-lg rounded-tl-lg px-2 py-1 bg-primary-100 dark:bg-gray-900 dark:text-gray-300 border-gray-400 dark:border-gray-400 border-b-2 border-r-2 border-dashed ">
					author
				</span>

				<div className="w-full flex justify-center sm:justify-start sm:w-auto shrink-0">
					{author.image ? (
						<img
							className="object-cover w-20 h-20 mt-3 mr-3 rounded-full"
							alt=""
							src={author.image.url}
							data-hygraph-entry-id={contentId}
							data-hygraph-field-api-id="image"
							data-hygraph-component-chain={`[{"fieldApiId":"Sections","instanceId":"${contentId}"},{"fieldApiId":"Author card","instanceId":"${id}"},{"fieldApiId":"Author","instanceId":"${author.id}"}]`}
						/>
					) : null}
				</div>

				<div className="w-full sm:w-auto flex flex-col items-center sm:items-start">
					<h2
						className="font-display mb-2 text-2xl font-semibold dark:text-gray-200"
						itemProp="author"
						data-hygraph-entry-id={contentId}
						data-hygraph-field-api-id="author"
						data-hygraph-component-chain={`[{"fieldApiId":"Sections","instanceId":"${id}"}]`}
					>
						{author.name}
					</h2>

					<div
						className="mb-4 md:text-lg text-gray-400 text-center sm:text-left prose dark:prose-invert"
						data-hygraph-entry-id={contentId}
						data-hygraph-field-api-id="author"
						data-hygraph-component-chain={`[{"fieldApiId":"Sections","instanceId":"${id}"}]`}
					>
						<RichText content={author.biography.raw} />
					</div>

					{author.socialLinks?.length ? (
						<div className="flex gap-4 flex-wrap justify-center sm:justify-start">
							{author.socialLinks.map((socialLink, index) => (
								<ButtonLink key={index} {...socialLink} />
							))}
						</div>
					) : null}
				</div>
			</div>
		</div>
	</section>
);

/**
 * <a
						title="youtube url"
						href="https://www.youtube.com/@mcqmate"
						target="_blank"
						rel="noopener noreferrer"
					>
						<svg
							className="h-6 w-6 dark:text-gray-300"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M20.5949 4.45999C21.5421 4.71353 22.2865 5.45785 22.54 6.40501C22.9982 8.12001 23 11.7004 23 11.7004C23 11.7004 23 15.2807 22.54 16.9957C22.2865 17.9429 21.5421 18.6872 20.5949 18.9407C18.88 19.4007 12 19.4007 12 19.4007C12 19.4007 5.12001 19.4007 3.405 18.9407C2.45785 18.6872 1.71353 17.9429 1.45999 16.9957C1 15.2807 1 11.7004 1 11.7004C1 11.7004 1 8.12001 1.45999 6.40501C1.71353 5.45785 2.45785 4.71353 3.405 4.45999C5.12001 4 12 4 12 4C12 4 18.88 4 20.5949 4.45999ZM15.5134 11.7007L9.79788 15.0003V8.40101L15.5134 11.7007Z"
								stroke="currentColor"
								strokeLinejoin="round"
							/>
						</svg>
					</a>

					<a
						title="website url"
						href="https://mcqmate.com/"
						target="_blank"
						rel="noopener noreferrer"
					>
						<svg
							className="h-6 w-6 dark:text-gray-300"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
							/>
						</svg>
					</a>
 */
