import { AuthorCardFragment } from '~/components/molecules/author-card/author-card-fragment.ts';

export const RelatedArticlesFragment = `
... on RelatedArticles {
	__typename
	id
	relatedTitle: title
	relatedContent: content {
		raw
	}
}
`;

export const ArticleCategoryFragment = (thisPageId: string) => `
... on ArticleCategory {
	id
	categoryName
	slug
	pages (where: { id_not: "${thisPageId}" }, orderBy: updatedAt_DESC) {
		... on Page {
			id
			slug
			pageName
			introduction
			published: publishedAt
			created: createdAt
			updated: updatedAt
			createdBy {
				... on User {
					id
					name
					picture
				}
			}
			categories: articleCategories {
				... on ArticleCategory {
					id
					categoryName
					slug
				}
			}
			sections {
				__typename
				${AuthorCardFragment}
			}
			parentPage {
				... on Page {
					id
					slug
				}
			}
		}
	}
}
`;
