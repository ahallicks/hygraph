export const FeatureFragment = `
... on FeatureBlock {
    title
	pretitle
	content {
		html
		raw
	}
	image {
		size
		width
		height
		fileName
		url
	}
	features {
		... on Feature {
			title
			headline
			description
			icon
		}
	}
}`;
