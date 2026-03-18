import type { IHero } from './hero-types.ts';
import type { RichTextProps } from '@graphcms/rich-text-react-renderer';

import { RichText } from '@graphcms/rich-text-react-renderer';

import { ButtonLink } from '~/components/atoms/button/button.tsx';

const rte: RichTextProps['renderers'] = {
	p: ({ children }) => (
		<p className="mt-8 text-lg font-medium text-pretty text-gray-500 dark:text-gray-400 sm:text-xl/8">
			{children}
		</p>
	),
};

const rte2: RichTextProps['renderers'] = {
	p: ({ children }) => (
		<p className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 dark:text-gray-300 ring-1 ring-gray-900/10 hover:ring-gray-900/20 dark:ring-white/10 dark:hover:ring-white/20">
			{children}
		</p>
	),
	a: ({ children, href }) => (
		<a
			href={href}
			className="font-semibold text-indigo-600 dark:text-indigo-400"
		>
			{children} <span aria-hidden="true">&rarr;</span>
		</a>
	),
};

export const Hero: React.FC<
	IHero & {
		contentId: string;
	}
> = ({ id, keyline, title, content, links, contentId }) => {
	return (
		<section className="bg-white dark:bg-gray-900">
			<div className="relative isolate px-6 pt-14 lg:px-8">
				<div
					aria-hidden="true"
					className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
				>
					<div
						style={{
							clipPath:
								'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
						}}
						className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
					/>
				</div>
				<div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
					{keyline?.raw ? (
						<div
							className="hidden sm:mb-8 sm:flex sm:justify-center"
							data-hygraph-entry-id={contentId}
							data-hygraph-field-api-id="keyline"
							data-hygraph-component-chain={`[{"fieldApiId":"Sections","instanceId":"${id}"},{"fieldApiId":"Hero","instanceId":"${id}"}]`}
						>
							<RichText content={keyline.raw} renderers={rte2} />
						</div>
					) : null}
					<div className="text-center">
						<h1
							data-hygraph-entry-id={contentId}
							data-hygraph-field-api-id="title"
							data-hygraph-component-chain={`[{"fieldApiId":"Sections","instanceId":"${id}"},{"fieldApiId":"Hero","instanceId":"${id}"}]`}
							className="text-5xl font-semibold tracking-tight text-balance text-gray-900 dark:text-gray-300 sm:text-7xl"
						>
							{title}
						</h1>
						{content?.raw ? (
							<div
								data-hygraph-entry-id={contentId}
								data-hygraph-field-api-id="content"
								data-hygraph-component-chain={`[{"fieldApiId":"Sections","instanceId":"${id}"},{"fieldApiId":"Hero","instanceId":"${id}"}]`}
							>
								<RichText
									content={content.raw}
									renderers={rte}
								/>
							</div>
						) : null}
						<div className="mt-10 flex items-center justify-center gap-x-6">
							{links.map((link) => (
								<ButtonLink {...link} key={link.linkUrl} />
							))}
						</div>
					</div>
				</div>
				<div
					aria-hidden="true"
					className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
				>
					<div
						style={{
							clipPath:
								'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
						}}
						className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
					/>
				</div>
			</div>
		</section>
	);
};
