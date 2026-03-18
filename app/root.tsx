import type { LinksFunction } from 'react-router';
import type { IGlobalData } from './services/get-global-data.ts';

import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	data,
	isRouteErrorResponse,
	useLoaderData,
	useRouteError,
} from 'react-router';
import { Fragment } from 'react/jsx-runtime';

import { getGlobalData } from './services/get-global-data.ts';

import { Banner } from './components/molecules/banner/banner.tsx';
import { Footer } from '~/components/molecules/footer/footer.tsx';
import { HeaderComponent } from '~/components/molecules/header/header.tsx';
import { LogoCloud } from './components/molecules/logo-cloud/logo-cloud.tsx';
import { Strip } from './components/molecules/strip/strip.tsx';

import './app.css';
import { NotFound } from './components/layouts/404/404.tsx';
import { PreviewWrapper } from './components/layouts/previews/previews.tsx';

export const links: LinksFunction = () => [
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{
		rel: 'preconnect',
		href: 'https://fonts.gstatic.com',
		crossOrigin: 'anonymous',
	},
	{
		rel: 'stylesheet',
		href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
	},
];

export const loader = async (): Promise<{
	globalData: IGlobalData;
	ENV: {
		HYGRAPH_ENDPOINT: string;
		HYGRAPH_STUDIO_URL: string;
	};
}> => {
	try {
		const globalData = await getGlobalData();
		return {
			globalData,
			ENV: {
				HYGRAPH_ENDPOINT: process.env.HYGRAPH_ENDPOINT!,
				HYGRAPH_STUDIO_URL: process.env.HYGRAPH_STUDIO_URL!,
			},
		};
	} catch (error) {
		console.error('Error fetching global data:', error);
		throw data('Error connecting to the CMS.', { status: 404 });
	}
};

export const Structure = ({
	children,
}: {
	children: React.ReactNode;
}): React.ReactNode => (
	<html
		lang="en"
		className="h-full bg-white dark:bg-gray-900 scheme-light dark:scheme-dark"
	>
		<head>
			<meta charSet="utf-8" />
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1"
			/>
			<Meta />
			<Links />
		</head>
		<body className="min-h-full flex flex-col">
			<PreviewWrapper>{children}</PreviewWrapper>
			<ScrollRestoration />
			<Scripts />
		</body>
	</html>
);

export function ErrorBoundary(): React.ReactNode {
	const error = useRouteError();

	let status = '500';
	let message = 'Oops!';
	let details = 'An unexpected error occurred.';
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		status = error.status.toString();
		message = error.status === 404 ? '404' : 'Error';
		details =
			error.status === 404
				? 'The requested page could not be found.'
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<Structure>
			<NotFound
				status={status}
				details={details}
				message={message}
				stack={stack}
			/>
		</Structure>
	);
}

export default function Layout(): React.ReactNode {
	const data = useLoaderData<typeof loader>();
	return (
		<Structure>
			<script
				dangerouslySetInnerHTML={{
					__html: `window.ENV = ${JSON.stringify(data.ENV)}`,
				}}
			/>
			<HeaderComponent {...data.globalData} />
			{data.globalData.headerComponents &&
			data.globalData.headerComponents.length > 0
				? data.globalData.headerComponents.map((component, index) => (
						<Fragment key={`${component.__typename}-${index}`}>
							{component.__typename === 'LogoCloud' ? (
								<LogoCloud {...component} />
							) : null}
							{component.__typename === 'Strip' ? (
								<Strip {...component} />
							) : null}
						</Fragment>
					))
				: null}
			<main id="main" className="flex-1">
				<Outlet />
			</main>
			{data.globalData.footerComponents &&
			data.globalData.footerComponents.length > 0
				? data.globalData.footerComponents.map((component, index) => (
						<Fragment key={`${component.__typename}-${index}`}>
							{component.__typename === 'LogoCloud' ? (
								<LogoCloud {...component} />
							) : null}
							{component.__typename === 'Banner' ? (
								<Banner
									{...component}
									contentId={data.globalData.siteName}
								/>
							) : null}
						</Fragment>
					))
				: null}
			<Footer {...data.globalData} />
		</Structure>
	);
}
