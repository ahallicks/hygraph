import type { IArticleCards } from '~/components/organisms/article-cards/article-cards-types.ts';
import type { IAuthorCard } from '~/components/molecules/author-card/author-card-types.ts';
import type { IHomepage } from '~/services/get-homepage.ts';
import type { IPage } from '~/services/get-page.ts';

import { getGravatarUrl } from '~/utils/gravatar.ts';

export const fixThePage = <T>(page: IPage | IHomepage): T => {
	// Fix up the Gravatar URL for an author
	if (page.sections.find(section => section.__typename === 'AuthorCard')) {
		const authorSection = page.sections.find(section => section.__typename === 'AuthorCard') as IAuthorCard;
		if (authorSection.author?.emailAddress) {
			authorSection.author.image = {
				url: getGravatarUrl(authorSection.author.emailAddress),
				width: 80,
				height: 80,
			};
		}
	}

	// Fix up the gravatar URL in sub sections
	if (page.sections.find(section => section.__typename === 'ArticleCards')) {
		const articleCardsSections = page.sections.filter(section => section.__typename === 'ArticleCards') as IArticleCards[];
		articleCardsSections.forEach(articleCardsSection => {
			articleCardsSection.pageReference.childPages.forEach(childPage => {
				if (!childPage?.sections) {
					return;
				}
				if (childPage.sections.find(section => section.__typename === 'AuthorCard')) {
					const authorSection = childPage.sections.find(section => section.__typename === 'AuthorCard') as IAuthorCard;
					if (authorSection.author?.emailAddress) {
						authorSection.author.image = {
							url: getGravatarUrl(authorSection.author.emailAddress, 40),
							width: 40,
							height: 40,
						};
					}
				}
			});
		});
	}
	return page as T;
};
