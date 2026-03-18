import { BannerFragment } from '../banner/banner-fragment.tsx';

export const ContentFragment = `
... on Content {
	id
	title
	pretitle
	introduction
	contentImage: image {
		url
		width
		height
	}
	article: content {
		__typename
		... on Article {
			id
			content {
				json
				references {
					__typename
					... on Codepen {
						id
						codepenId
						codepenUrl
						codepenTitle
						author
					}
					... on YouTube {
						id
						youTubeTitle
						youTubeVideoId
						youTubeVideoUrl
					}
					... on CodeBlock {
						id
						codeBlock
						language
					}
					... on Asset {
						id
						url
						width
						height
						mimeType
					}
				}
			}
		}
		... on FeatureBlock {
			id
			features {
				... on Feature {
					title
					headline
					description
					icon
				}
			}
		}
		${BannerFragment}
	}
}`;
