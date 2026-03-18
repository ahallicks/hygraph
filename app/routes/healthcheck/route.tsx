// learn more: https://fly.io/docs/reference/configuration/#services-http_checks
import type { LoaderFunctionArgs } from 'react-router';

export const loader = async ({
	request,
}: LoaderFunctionArgs): Promise<Response> => {
	const host =
		request.headers.get('X-Forwarded-Host') ?? request.headers.get('host');

	try {
		const url = new URL('/', `https://${host}`);
		await Promise.all([
			fetch(url.toString(), { method: 'HEAD' }).then((r) => {
				if (!r.ok) return Promise.reject(r);
			}),
		]);
		return new Response('OK');
	} catch (error: unknown) {
		console.log('healthcheck ❌', { error });
		return new Response('ERROR', { status: 500 });
	}
};
