import { ButtonLinkFragment } from '~/components/atoms/button/button-fragment.ts';

export const BannerFragment = `
... on Banner {
	id
	title
	content {
		raw
	}
	bannerImage: image {
		url
		width
		height
	}
	flipped
	links {
		${ButtonLinkFragment}
	}
	bannerStats: statistics {
		... on Statistics {
			statTitle
			statContent
			statistics {
				... on Statistic {
					title
					description
				}
			}
		}
	}
}`;
