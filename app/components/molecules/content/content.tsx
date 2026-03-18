import type { IContent } from './content-types.ts';
import type { RichTextProps } from '@graphcms/rich-text-react-renderer';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { RichText } from '@graphcms/rich-text-react-renderer';

import { SingleFeature } from '../feature/feature.tsx';
import { CodePen } from '~/components/atoms/codepen/codepen.tsx';
import { YouTube } from '~/components/atoms/youtube/youtube.tsx';
import { BannerSmall } from '../banner/banner.tsx';

import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const rte: RichTextProps['renderers'] = {
	h2: ({ children }) => (
		<h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-300">
			{children}
		</h2>
	),
	p: ({ children }) => (
		<p className="mt-6 text-gray-600 dark:text-gray-300">{children}</p>
	),
	li: ({ children }) => (
		<li className="text-gray-600 dark:text-gray-300">{children}</li>
	),
	code_block: ({ children }) => (
		<pre className="line-numbers language-none">
			<code>{children}</code>
		</pre>
	),
	embed: {
		CodeBlock: ({ codeBlock, language }) => (
			<SyntaxHighlighter
				language={language}
				style={oneDark}
				showLineNumbers
			>
				{codeBlock}
			</SyntaxHighlighter>
		),
		Codepen: ({ id, codepenId, codepenUrl, codepenTitle, author }) => (
			<CodePen
				id={id}
				codepenId={codepenId}
				codepenUrl={codepenUrl}
				codepenTitle={codepenTitle}
				author={author}
			/>
		),
		YouTube: ({
			id,
			youTubeTitle,
			youTubeVideoId,
			youTubeVideoUrl,
			author,
		}) => (
			<YouTube
				id={id}
				youTubeTitle={youTubeTitle}
				youTubeVideoId={youTubeVideoId}
				youTubeVideoUrl={youTubeVideoUrl}
				author={author}
				className="dark:ring-1 dark:ring-gray-700/50"
			/>
		),
	},
};

const SubContent: React.FC<{
	id: IContent['id'];
	article: IContent['article'];
	contentId: string;
}> = ({ id, article, contentId }) => (
	<div className="prose dark:prose-invert lg:prose-xl max-w-none">
		{article && article.length > 0
			? article.map((articleItem, index) => {
					if (articleItem.__typename === 'Article') {
						return articleItem.content?.json ? (
							<div
								className="text-base/7 text-gray-600"
								data-hygraph-entry-id={contentId}
								data-hygraph-field-api-id="content"
								data-hygraph-component-chain={`[{"fieldApiId":"Sections","instanceId":"${id}"},{"fieldApiId":"Content","instanceId":"${id}"},{"fieldApiId":"Content","instanceId":"${id}"},{"fieldApiId":"Article","instanceId":"${articleItem.id}"}]`}
								key={articleItem.id}
							>
								<RichText
									key={articleItem.id}
									content={articleItem.content.json}
									renderers={rte}
									references={articleItem.content.references}
								/>
							</div>
						) : null;
					}
					if (
						articleItem.__typename === 'FeatureBlock' &&
						articleItem.features?.length
					) {
						return (
							<div className="not-prose" key={articleItem.id}>
								<ul
									className="mt-8 space-y-8 text-gray-600"
									key={articleItem.id}
								>
									{articleItem.features.map(
										(feature, featureIndex) => (
											<SingleFeature
												key={`article-part-${index}-feature-${featureIndex}`}
												{...feature}
												contentId={contentId}
											/>
										),
									)}
								</ul>
							</div>
						);
					}
					if (articleItem.__typename === 'Banner') {
						return (
							<div className="not-prose" key={articleItem.id}>
								<BannerSmall
									key={articleItem.id}
									{...articleItem}
									contentId={contentId}
								/>
							</div>
						);
					}
				})
			: null}
	</div>
);

const Title: React.FC<IContent> = ({
	id,
	title,
	pretitle,
	introduction,
	contentId,
}) => (
	<>
		{pretitle ? (
			<p
				className="text-base/7 font-semibold text-indigo-600"
				data-hygraph-entry-id={contentId}
				data-hygraph-field-api-id="pretitle"
				data-hygraph-component-chain={`[{"fieldApiId":"Sections","instanceId":"${id}"},{"fieldApiId":"Content","instanceId":"${id}"}]`}
			>
				{pretitle}
			</p>
		) : null}
		<h1
			className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-gray-300"
			data-hygraph-entry-id={contentId}
			data-hygraph-field-api-id="title"
			data-hygraph-component-chain={`[{"fieldApiId":"Sections","instanceId":"${id}"},{"fieldApiId":"Content","instanceId":"${id}"}]`}
		>
			{title}
		</h1>
		{introduction ? (
			<p
				className="mt-6 text-xl/8 text-gray-700 dark:text-gray-400"
				data-hygraph-entry-id={contentId}
				data-hygraph-field-api-id="introduction"
				data-hygraph-component-chain={`[{"fieldApiId":"Sections","instanceId":"${id}"},{"fieldApiId":"Content","instanceId":"${id}"}]`}
			>
				{introduction}
			</p>
		) : null}
	</>
);

export const Content: React.FC<IContent> = ({
	id,
	title,
	pretitle,
	introduction,
	contentImage,
	article,
	contentId,
}) => (
	<section className="segment relative isolate overflow-hidden bg-white dark:bg-gray-900 px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
		<div className="absolute inset-0 -z-10 overflow-hidden">
			<svg
				aria-hidden="true"
				className="absolute top-0 left-[max(50%,25rem)] h-256 w-512 -translate-x-1/2 mask-[radial-gradient(64rem_64rem_at_top,white,transparent)] stroke-gray-200 dark:stroke-gray-700/40"
			>
				<defs>
					<pattern
						x="50%"
						y={-1}
						id="e813992c-7d03-4cc4-a2bd-151760b470a0"
						width={200}
						height={200}
						patternUnits="userSpaceOnUse"
					>
						<path d="M100 200V.5M.5 .5H200" fill="none" />
					</pattern>
				</defs>
				<svg
					x="50%"
					y={-1}
					className="overflow-visible fill-gray-50 dark:fill-gray-800/50"
				>
					<path
						d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
						strokeWidth={0}
					/>
				</svg>
				<rect
					fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
					width="100%"
					height="100%"
					strokeWidth={0}
				/>
			</svg>
		</div>
		{contentImage ? (
			<div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
				<div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
					<div className="lg:pr-4 prose">
						<div className="lg:max-w-lg">
							<Title
								__typename={'Content'}
								id={id}
								title={title}
								pretitle={pretitle}
								introduction={introduction}
								contentId={contentId}
							/>
						</div>
					</div>
				</div>
				<div className="-mt-12 -ml-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
					<img
						alt=""
						src={contentImage.url}
						className="w-3xl max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-228"
					/>
				</div>
				<div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
					<SubContent
						id={id}
						article={article}
						contentId={contentId}
					/>
				</div>
			</div>
		) : (
			<div className="mx-auto flex flex-col max-w-2xl lg:mx-0 lg:max-w-none lg:items-start gap-y-16 lg:gap-y-10">
				<div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-5xl lg:gap-x-8 lg:px-8">
					<div className="lg:pr-4 prose">
						<Title
							__typename={'Content'}
							id={id}
							title={title}
							pretitle={pretitle}
							introduction={introduction}
							contentId={contentId}
						/>
					</div>
				</div>
				<div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-5xl lg:gap-x-8 lg:px-8">
					<SubContent
						id={id}
						article={article}
						contentId={contentId}
					/>
				</div>
			</div>
		)}
	</section>
);
