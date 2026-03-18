import { ButtonLinkFragment } from '~/components/atoms/button/button-fragment.ts';

export const HeroFragment = `
... on Hero {
	id
	keyline {
		html
		raw
	}
	title
	content {
		html
		raw
	}
	links {
		${ButtonLinkFragment}
	}
}
`;
