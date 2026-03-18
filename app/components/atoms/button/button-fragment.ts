export const ButtonLinkFragment = `
... on ButtonLink {
	id
	linkText
	linkUrl
	variation
	page {
		... on Page {
			pageName
			slug
			parentPage {
				... on Page {
					pageName
					slug
					parentPage {
						... on Page {
							pageName
							slug
						}
					}
				}
			}
		}
	}
}
`;
