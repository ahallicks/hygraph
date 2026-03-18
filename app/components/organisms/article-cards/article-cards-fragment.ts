export const ArticleCardsFragment = `
... on ArticleCards {
	id
	cardsTitle: title
	subtitle
	pageReference {
		...on Page {
			id
			slug
			pageName
			childPages {
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
					parentPage {
						... on Page {
							id
							slug
						}
					}
					sections {
						__typename
						... on AuthorCard {
							id
							author {
								id
								name
								biography {
									raw
								}
								emailAddress
								image {
									url
									width
									height
								}
							}
						}
					}
				}
			}
		}
	}
}
`;
