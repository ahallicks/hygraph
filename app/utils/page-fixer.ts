import type { IArticleCards } from '~/components/organisms/article-cards/article-cards-types.ts';
import type { IAuthorCard } from '~/components/molecules/author-card/author-card-types.ts';
import type { TCategoryPage } from '~/types/global-types.ts';
import type { IHomepage } from '~/services/get-homepage.ts';
import type { IPage } from '~/services/get-page.ts';

import { getGravatarUrl } from '~/utils/gravatar.ts';

const fixTheAuthorGravatar = (
	author: IAuthorCard['author'],
): IAuthorCard['author'] => {
	if (author?.emailAddress) {
		author.image = {
			url: getGravatarUrl(author.emailAddress),
			width: 80,
			height: 80,
		};
	}
	return author;
};

export const fixThePage = <T>(page: IPage | IHomepage): T => {
	// Fix up the Gravatar URL for an author
	if (page.sections.find((section) => section.__typename === 'AuthorCard')) {
		const authorSection = page.sections.find(
			(section) => section.__typename === 'AuthorCard',
		) as IAuthorCard;
		authorSection.author = fixTheAuthorGravatar(authorSection.author);
	}

	// Fix up the gravatar URL in sub sections
	if (
		page.sections.find((section) => section.__typename === 'ArticleCards')
	) {
		const articleCardsSections = page.sections.filter(
			(section) => section.__typename === 'ArticleCards',
		) as IArticleCards[];
		articleCardsSections.forEach((articleCardsSection) => {
			articleCardsSection.pageReference.childPages.forEach(
				(childPage) => {
					if (!childPage?.sections) {
						return;
					}
					if (
						childPage.sections.find(
							(section) => section.__typename === 'AuthorCard',
						)
					) {
						const authorSection = childPage.sections.find(
							(section) => section.__typename === 'AuthorCard',
						) as IAuthorCard;
						authorSection.author = fixTheAuthorGravatar(
							authorSection.author,
						);
					}
				},
			);
			articleCardsSection.pageReference.childPages =
				articleCardsSection.pageReference.childPages.sort(
					(a, b) =>
						new Date(a.created).getTime() -
						new Date(b.created).getTime(),
				);
		});
	}

	// If there are categories we need to loop through those and fix up any gravatar URLs in the child pages
	// and group those related category pages to remove duplicates
	if ((page as IPage).categories?.length) {
		const filteredCategories = (page as IPage).categories?.filter(
			(category) => category.pages && category.pages.length > 0,
		);
		if (!filteredCategories?.length) {
			return page as T;
		}
		const uniquePages: TCategoryPage[] = [];
		filteredCategories.map((category) => {
			category.pages.map((page) => {
				if (!uniquePages.find((p) => p.id === page.id)) {
					uniquePages.push(page);
				}
			});
		});

		if (
			page.sections.find(
				(section) => section.__typename === 'RelatedArticles',
			)
		) {
			const relatedArticlesSection = page.sections.find(
				(section) => section.__typename === 'RelatedArticles',
			);
			if (relatedArticlesSection?.id) {
				uniquePages.map((uniquePage) => {
					if (!uniquePage.sections) {
						return;
					}
					if (
						uniquePage.sections.find(
							(section) => section.__typename === 'AuthorCard',
						)
					) {
						const authorSection = uniquePage.sections.find(
							(section) => section.__typename === 'AuthorCard',
						) as IAuthorCard;
						authorSection.author = fixTheAuthorGravatar(
							authorSection.author,
						);
					}
				});
				relatedArticlesSection.pages = uniquePages.reverse();
			}
		}
	}

	return page as T;
};

// Randomise the unique pages so that the related articles section doesn't show the same articles every time
// TODO - work out where this is storing the limited number of articles
export const randomiseThePage = <T>(page: IPage): T => {
	if (
		page.sections.find(
			(section) => section.__typename === 'RelatedArticles',
		)
	) {
		const relatedArticlesSection = page.sections.find(
			(section) => section.__typename === 'RelatedArticles',
		);
		if (relatedArticlesSection) {
			relatedArticlesSection.pages = relatedArticlesSection.pages.sort(
				() => Math.random() - 0.5,
			); // Limit to 3 articles
		}
	}

	return page as T;
};
