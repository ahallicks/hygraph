import type { IFeature, IFeatureBlock } from './feature-types.ts';
import type { RichTextProps } from '@graphcms/rich-text-react-renderer';

import {
	CloudArrowUpIcon,
	LockClosedIcon,
	ServerIcon,
} from '@heroicons/react/20/solid';
import { createElement } from 'react';
import { RichText } from '@graphcms/rich-text-react-renderer';

const iconmapper = (icon: string): React.ElementType => {
	switch (icon) {
		case 'cloudArrowUpIcon':
			return CloudArrowUpIcon;
		case 'lockClosedIcon':
			return LockClosedIcon;
		case 'serverIcon':
			return ServerIcon;
		default:
			return CloudArrowUpIcon;
	}
};

const rte: RichTextProps['renderers'] = {
	p: ({ children }) => (
		<p className="mt-6 text-lg/8 text-gray-700 dark:text-gray-400">
			{children}
		</p>
	),
};

export const SingleFeature: React.FC<IFeature> = ({
	title,
	icon,
	headline,
	description,
	contentId,
}) => (
	<div key={title} className="relative pl-9">
		<dt
			className="inline font-semibold text-gray-900 dark:text-gray-300"
			data-hygraph-entry-id={contentId}
			data-hygraph-field-api-id="headline"
		>
			{createElement(iconmapper(icon), {
				'aria-hidden': 'true',
				className: 'absolute top-1 left-1 size-5 text-indigo-600',
			})}
			{headline}
		</dt>{' '}
		<dd
			className="inline"
			data-hygraph-entry-id={contentId}
			data-hygraph-field-api-id="description"
		>
			{description}
		</dd>
	</div>
);

export const Features: React.FC<IFeatureBlock> = ({
	pretitle,
	title,
	content,
	image,
	features,
	contentId,
}) => {
	return (
		<section className="segment overflow-hidden bg-white dark:bg-gray-900">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
					<div className="lg:pt-4 lg:pr-8">
						<div className="lg:max-w-lg">
							<h2
								className="text-base/7 font-semibold text-indigo-600"
								data-hygraph-entry-id={contentId}
								data-hygraph-field-api-id="pretitle"
							>
								{pretitle}
							</h2>
							<p
								className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 dark:text-gray-300 sm:text-5xl"
								data-hygraph-entry-id={contentId}
								data-hygraph-field-api-id={title}
							>
								{title}
							</p>
							<RichText content={content.raw} renderers={rte} />
							<dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 dark:text-gray-400 lg:max-w-none">
								{features.map((feature) => (
									<SingleFeature
										key={feature.title}
										{...feature}
										contentId={contentId}
									/>
								))}
							</dl>
						</div>
					</div>
					<img
						src={image.url}
						alt=""
						className="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 dark:ring-gray-600/10 sm:w-228 md:-ml-4 lg:ml-0"
						width={image.width}
						height={image.height}
					/>
				</div>
			</div>
		</section>
	);
};
