import type { IBanner } from './banner-types.ts';
import type { RichTextProps } from '@graphcms/rich-text-react-renderer';

import { RichText } from '@graphcms/rich-text-react-renderer';
import { ButtonLink } from '~/components/atoms/button/button.tsx';

const smallRte: RichTextProps['renderers'] = {
	p: ({ children }) => (
		<p className="mt-6 text-lg/8 text-pretty text-gray-300">{children}</p>
	),
};

const BannerImage: React.FC<{
	id: IBanner['id'];
	bannerImage: IBanner['bannerImage'];
	flipped: IBanner['flipped'];
	contentId: string;
}> = ({ id, bannerImage, flipped, contentId }) => (
	<div
		className="relative mt-16 h-80 flex-1 lg:mt-8"
		data-hygraph-entry-id={contentId}
		data-hygraph-field-api-id="image"
		data-hygraph-component-chain={`[{"fieldApiId":"Sections","instanceId":"${id}"},{"fieldApiId":"Banner","instanceId":"${id}"}]`}
	>
		{bannerImage ? (
			<img
				src={bannerImage.url}
				alt=""
				width={bannerImage.width}
				height={bannerImage.height}
				className={`absolute top-0 ${flipped ? 'right-0' : 'left-0'} w-228 max-w-none rounded-md bg-white/5 ring-1 ring-white/10`}
			/>
		) : (
			<img
				alt="App screenshot"
				src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
				width={1824}
				height={1080}
				className={`absolute top-0 ${flipped ? 'right-0' : 'left-0'} w-228 max-w-none rounded-md bg-white/5 ring-1 ring-white/10`}
			/>
		)}
	</div>
);

export const BannerSmall: React.FC<IBanner> = ({
	id,
	title,
	content,
	links,
	bannerImage,
	flipped,
	contentId,
}) => (
	<section className="segment mx-auto max-w-7xl px-6 lg:px-8">
		<div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0 dark:ring-1 dark:ring-gray-700">
			<svg
				viewBox="0 0 1024 1024"
				aria-hidden="true"
				className="absolute top-1/2 left-1/2 -z-10 size-256 -translate-y-1/2 mask-[radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
			>
				<circle
					r={512}
					cx={512}
					cy={512}
					fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
					fillOpacity="0.7"
				/>
				<defs>
					<radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
						<stop stopColor="#7775D6" />
						<stop offset={1} stopColor="#E935C1" />
					</radialGradient>
				</defs>
			</svg>
			{flipped ? (
				<BannerImage
					id={id}
					bannerImage={bannerImage}
					flipped={flipped}
					contentId={contentId}
				/>
			) : null}
			<div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
				<h2
					className="text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl"
					data-hygraph-entry-id={contentId}
					data-hygraph-field-api-id="title"
					data-hygraph-component-chain={`[{"fieldApiId":"Sections","instanceId":"${id}"},{"fieldApiId":"Banner","instanceId":"${id}"}]`}
				>
					{title}
				</h2>
				{content?.raw ? (
					<div
						data-hygraph-entry-id={contentId}
						data-hygraph-field-api-id="content"
						data-hygraph-component-chain={`[{"fieldApiId":"Sections","instanceId":"${id}"},{"fieldApiId":"Banner","instanceId":"${id}"}]`}
					>
						<RichText content={content.raw} renderers={smallRte} />
					</div>
				) : null}
				{links.length ? (
					<div
						className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start"
						data-hygraph-entry-id={contentId}
						data-hygraph-field-api-id="links"
						data-hygraph-component-chain={`[{"fieldApiId":"Sections","instanceId":"${id}"},{"fieldApiId":"Banner","instanceId":"${id}"}]`}
					>
						{links.map((link) => (
							<ButtonLink
								key={link.linkUrl}
								{...link}
								className="min-w-32 text-center text-white ring-white hover:text-gray-900 hover:ring-gray-300"
							/>
						))}
					</div>
				) : null}
			</div>
			{flipped ? null : (
				<BannerImage
					id={id}
					bannerImage={bannerImage}
					flipped={flipped}
					contentId={contentId}
				/>
			)}
		</div>
	</section>
);

const rte: RichTextProps['renderers'] = {
	p: ({ children }) => (
		<p className="mt-8 text-lg font-medium text-pretty text-gray-300 sm:text-xl/8">
			{children}
		</p>
	),
};

export const Banner: React.FC<IBanner> = ({
	title,
	content,
	links,
	bannerStats,
}) => (
	<section className="segment relative isolate overflow-hidden bg-gray-900">
		<img
			alt=""
			src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
			className="absolute inset-0 -z-10 size-full object-cover object-right md:object-center"
		/>
		<div
			aria-hidden="true"
			className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
		>
			<div
				style={{
					clipPath:
						'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
				}}
				className="aspect-1097/845 w-274.25 bg-linear-to-tr from-[#ff4694] to-[#776fff] opacity-20"
			/>
		</div>
		<div
			aria-hidden="true"
			className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:-top-112 sm:ml-16 sm:translate-x-0"
		>
			<div
				style={{
					clipPath:
						'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
				}}
				className="aspect-1097/845 w-274.25 bg-linear-to-tr from-[#ff4694] to-[#776fff] opacity-20"
			/>
		</div>
		<div className="mx-auto max-w-7xl px-6 lg:px-8">
			<div className="mx-auto max-w-2xl lg:mx-0">
				<h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
					{title}
				</h2>
				<RichText content={content.raw} renderers={rte} />
			</div>
			{bannerStats || links.length ? (
				<div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
					{links.length > 0 ? (
						<div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base/7 font-semibold text-white sm:grid-cols-2 md:flex lg:gap-x-10">
							{links.map((link) => (
								<a key={link.linkUrl} href={link.linkUrl}>
									{link.linkText}{' '}
									<span aria-hidden="true">&rarr;</span>
								</a>
							))}
						</div>
					) : null}
					{bannerStats ? (
						<dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
							{bannerStats.statistics.map((stat) => (
								<div
									key={stat.title}
									className="flex flex-col-reverse gap-1"
								>
									<dt className="text-base/7 text-gray-300">
										{stat.title}
									</dt>
									<dd className="text-4xl font-semibold tracking-tight text-white">
										{stat.description}
									</dd>
								</div>
							))}
						</dl>
					) : null}
				</div>
			) : null}
		</div>
	</section>
);
