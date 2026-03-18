import type { TButtonLink } from '~/components/atoms/button/button.tsx';

// Using the page data to build the correct URL path
export const buildPageUrl = (link: TButtonLink): string => {
	let url = '/';
	if (link.page) {
		url += link.page.slug;
		let parent = link.page.parentPage;
		while (parent) {
			if (!parent.slug) break;
			url = `/${parent.slug}${url}`;
			parent = parent.parentPage;
		}
		return url;
	}
	return link.linkUrl;
}
