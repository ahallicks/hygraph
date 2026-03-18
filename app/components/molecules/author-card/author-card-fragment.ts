import { ButtonLinkFragment } from '../../atoms/button/button-fragment.ts';

export const AuthorCardFragment = `
... on AuthorCard {
	__typename
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
		socialLinks {
			${ButtonLinkFragment}
		}
	}
}
`;
