import type { LoaderFunctionArgs } from 'react-router';
import type { IHomepage } from '~/services/get-homepage.ts';
import type { IPage } from '~/services/get-page.ts';

import { useLoaderData } from 'react-router';

import { getPreviewPage } from '~/services/get-page.ts';

import { PageSections } from '~/components/layouts/page-sections/page-sections.tsx';

export const loader = async ({
	params,
	request,
}: LoaderFunctionArgs): Promise<{ page: IPage | IHomepage }> => {
	try {
		const id = params.id;
		let isHome = false;
		if (request.url.includes('Homepage')) {
			isHome = true;
		}
		if (!id) {
			throw new Error('No ID provided');
		}
		const page = await getPreviewPage(id, isHome);
		return { page };
	} catch (error) {
		console.error('Error fetching page data:', error);
		throw new Response('Page not found', { status: 404 });
	}
};

export default function Preview(): React.ReactNode {
	const { page } = useLoaderData<typeof loader>();
	return (
		<>
			<title>{page.pageName}</title>
			<meta
				name="description"
				content={`This is the ${page.pageName} page`}
			/>
			<PageSections page={page} />
		</>
	);
}
