import type { LoaderFunctionArgs } from 'react-router';
import type { ICategoryPage } from '~/services/get-category-page.ts';

import { useLoaderData } from 'react-router';

import { getCategoryPage } from '~/services/get-category-page.ts';

import { ArticleCards } from '~/components/organisms/article-cards/article-cards.tsx';

export const loader = async ({
	params,
}: LoaderFunctionArgs): Promise<ICategoryPage> => {
	const slug = params['categorySlug'];

	if (!slug) {
		throw new Response('Category not found', { status: 404 });
	}

	try {
		const { articleCategory, pages } = await getCategoryPage({ slug });
		return { articleCategory, pages };
	} catch (error) {
		console.error('Error fetching page data:', error);
		throw new Response('Page not found', { status: 404 });
	}
};

export default function CategoryPage(): React.ReactNode {
	const { articleCategory, pages } = useLoaderData<typeof loader>();
	return (
		<>
			<title>
				{`Articles in the category ${articleCategory.categoryName}`}
			</title>
			<meta
				name="description"
				content={`Articles within the category ${articleCategory.categoryName}`}
			/>
			<ArticleCards
				__typename="ArticleCards"
				contentId={articleCategory.id}
				id={articleCategory.id}
				cardsTitle={`Articles in ${articleCategory.categoryName}`}
				pageReference={{
					id: articleCategory.id,
					slug: articleCategory.slug,
					pageName: articleCategory.categoryName,
					childPages: pages,
				}}
			/>
		</>
	);
}
