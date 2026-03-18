import type { IArticleCard } from './article-card-types.ts';

import { Link } from 'react-router';

import { formatDate } from '~/utils/date-utils.ts';

import { AuthorCardMini } from '~/components/molecules/author-card/author-card.tsx';

export const ArticleCard: React.FC<{
	post: IArticleCard;
	contentId: string;
}> = ({ post, contentId }) => {
	const authorCardSection = post.sections?.find(
		(section) => section.__typename === 'AuthorCard',
	);
	const author = authorCardSection?.author;
	return (
		<article className="flex max-w-xl flex-col items-start justify-between w-full p-8 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 hover:-translate-y-1 transition duration-300 rounded-lg shadow shadow-black/10">
			<div className="flex items-center gap-x-4 text-xs">
				<time
					dateTime={post.published ? post.published : post.created}
					className="text-gray-500"
				>
					{formatDate(post.created, {
						weekday: 'long',
						hour: 'numeric',
						minute: 'numeric',
					})}
					{post.published && post.updated ? (
						<p>
							Last updated:{' '}
							{formatDate(post.updated, {
								weekday: 'long',
								hour: 'numeric',
								minute: 'numeric',
							})}
						</p>
					) : null}
				</time>
				{/* <a
				href={post.category.href}
				className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
			>
				{post.category.title}
			</a> */}
			</div>
			<div className="group relative grow">
				<h3
					className="mt-3 text-lg/6 font-semibold text-gray-900 dark:text-gray-300 group-hover:text-gray-600 dark:group-hover:text-gray-400"
					data-hygraph-entry-id={contentId}
					data-hygraph-field-api-id="pageName"
					data-hygraph-component-chain={`[{"fieldApiId":"Sections","instanceId":"${contentId}"},{"fieldApiId":"Article Cards","instanceId":"${contentId}"},{"fieldApiId":"pageReference","instanceId":"${contentId}"},{"fieldApiId":"childPages","instanceId":"${contentId}"},{"fieldApiId":"pageName","instanceId":"${post.id}"}]`}
				>
					<Link to={`/${post.parentPage?.slug}/${post.slug}`}>
						<span className="absolute inset-0" />
						{post.pageName}
					</Link>
				</h3>
				<p
					className="mt-5 line-clamp-3 text-sm/6 text-gray-600 dark:text-gray-400"
					data-hygraph-entry-id={contentId}
					data-hygraph-field-api-id="introduction"
					data-hygraph-component-chain={`[{"fieldApiId":"Sections","instanceId":"${contentId}"},{"fieldApiId":"Article Cards","instanceId":"${contentId}"},{"fieldApiId":"pageReference","instanceId":"${contentId}"},{"fieldApiId":"childPages","instanceId":"${contentId}"},{"fieldApiId":"introduction","instanceId":"${post.id}"}]`}
				>
					{post.introduction}
				</p>
			</div>
			{author ? (
				<AuthorCardMini
					__typename="AuthorCard"
					contentId={contentId}
					id={authorCardSection?.id}
					author={author}
				/>
			) : (
				<div className="relative mt-8 flex items-center gap-x-4 justify-self-end">
					<img
						alt=""
						src={post.createdBy.picture}
						className="size-10 rounded-full bg-gray-50 dark:bg-gray-800"
					/>
					<div className="text-sm/6">
						<p className="font-semibold text-gray-900 dark:text-gray-300">
							<a href={post.createdBy.id}>
								<span className="absolute inset-0" />
								{post.createdBy.name}
							</a>
						</p>
						{/* <p className="text-gray-600">{post.createdBy.role}</p> */}
					</div>
				</div>
			)}
		</article>
	);
};
