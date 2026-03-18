import type { TTest } from './testMockFetch.ts';
import type { HttpHandler, HttpRequestHandler } from 'msw';

import { HttpResponse, http, passthrough } from 'msw';

export const mockedTest: TTest = {
	key: 'Great success!',
};

const createPassthroughHandlers = (domains: string[]): HttpHandler[] => {
	return domains.map((domain) => http.all(domain, () => passthrough()));
};

//List of domains to passthrough
const analyticsDomains = [
	'https://www.googletagmanager.com/*',
	'https://tagmanager.google.com/*',
	'https://analytics.google.com/*',
	'https://www.google-analytics.com/*',
	'https://*.google-analytics.com/*',
	'https://*.googlesyndication.com/*',
];

const mswHandlers: Array<HttpHandler> = [
	...createPassthroughHandlers(analyticsDomains),
	http.get<HttpRequestHandler>(`/api/test`, async () => {
		return HttpResponse.json(mockedTest);
	}),
];

export { mswHandlers };
