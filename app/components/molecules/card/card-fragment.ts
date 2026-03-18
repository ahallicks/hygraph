import { ButtonLinkFragment } from '~/components/atoms/button/button-fragment.ts';

export const CardFragment = `
... on Card {
	__typename
	id
	cardTitle
	cardContent {
		raw
	}
	cardImage {
		url
		width
		height
	}
	cardLinks {
		${ButtonLinkFragment}
	}
}`;
