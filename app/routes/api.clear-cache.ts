import type { ActionFunctionArgs } from 'react-router';

import { NotRedis, createCacheKey } from '~/services/notredis.ts';
import { tc } from '~/services/terminal-colours.ts';

export async function action({
	request,
}: ActionFunctionArgs): Promise<Response> {
	console.log(tc.box(tc.bold('Cache Invalidation Endpoint Called via POST')));
	const cache = NotRedis.getInstance();
	const formData = await request.json();

	// We always want to clear the pages cache, I think, as any change to a page could affect
	// the homepage and other pages that reference it, so we'll clear that on every request

	const pagesCacheKey = createCacheKey('id', 'pages', {});
	const pagesCachedResult = cache.get(pagesCacheKey);
	if (pagesCachedResult) {
		cache.delete(pagesCacheKey);
		console.log(`Pages cache deleted: ${pagesCacheKey}`);
	}

	if (formData.data.pageName === 'Homepage') {
		const homepageCacheKey = createCacheKey('id', 'homepage', {});
		const cachedResult = cache.get(homepageCacheKey);
		if (cachedResult) {
			cache.delete(homepageCacheKey);
			cache.printStats();
			return new Response(`Cache cleared for homepage: ${homepageCacheKey}`, { status: 200 });
		}
		return new Response('No cache found for homepage', { status: 200 });
	}
	if (formData.data.__typename === 'Page') {
		const pageCacheKey = createCacheKey('id', formData.data.id, {});
		const pagedCachedResult = cache.get(pageCacheKey);
		if (pagedCachedResult) {
			cache.delete(pageCacheKey);
			cache.printStats();
			return new Response(`Cache cleared for page: ${pageCacheKey}`, { status: 200 });
		}
		// Update the pages cache to include the new page
		if (formData.operation === 'create') {
			const pagesCacheKey = createCacheKey('id', 'pages', {});
			const pagesCachedResult = cache.get(pagesCacheKey);
			if (pagesCachedResult) {
				cache.delete(pagesCacheKey);
			}
			cache.printStats();
			return new Response(`Pages cache deleted: ${pagesCacheKey}`, { status: 200 });
		}
		cache.printStats();
		return new Response(`No cache found for page: ${pageCacheKey}`, { status: 200 });
	}
	if (formData.data.__typename === 'Header') {
		const headerCacheKey = createCacheKey('id', 'globalData', {});
		const headerCachedResult = cache.get(headerCacheKey);
		if (headerCachedResult) {
			cache.delete(headerCacheKey);
			cache.printStats();
			return new Response(`Cache cleared for header: ${headerCacheKey}`, { status: 200 });
		}
		cache.printStats();
		return new Response(`No cache found for header: ${headerCacheKey}`, { status: 200 });
	}

	console.log('No matching typename for cache invalidation. Invalidating entire cache as fallback.');
	cache.clear();
	return new Response('Entire cache cleared', { status: 200 });
}

export async function loader(): Promise<Response> {
	console.log(tc.box(tc.bold('Cache Invalidation Endpoint Called via GET')));
	/* const payload = {
		"operation": "publish",
		"data": {
			"__typename": "Homepage",
			"childPages": [
				{
					"__typename": "Page",
					"id": "cmkgq350ou1pe07mhiyc45yi1"
				},
				{
					"__typename": "Page",
					"id": "cmkgpcv4dt3ou07mh7xi5wgnb"
				}
			],
			"createdAt": "2026-01-15T10:57:50.689386+00:00",
			"createdBy": {
				"__typename": "User",
				"id": "cmkc9a69l1zob07mjekvb0zed"
			},
			"id": "cmkfc5p4s2vct07mjsqt0hg96",
			"pageName": "Homepage",
			"publishedAt": "2026-01-21T07:58:52.362108+00:00",
			"publishedBy": {
				"__typename": "User",
				"id": "cmkc9a69l1zob07mjekvb0zed"
			},
			"scheduledIn": [],
			"sections": [
				{
					"__typename": "Hero",
					"content": {
						"__typename": "RichText",
						"raw": {
							"children": [
								{
									"children": [
										{
											"text": "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat."
										}
									],
									"type": "paragraph"
								}
							]
						}
					},
					"id": "cmkfch41y3etn07mhq4q9a7kq",
					"keyline": {
						"__typename": "RichText",
						"raw": {
							"children": [
								{
									"children": [
										{
											"text": "Announcing our next round of funding a lot. "
										},
										{
											"children": [
												{
													"text": "Read more"
												}
											],
											"href": "https://google.com/",
											"openInNewTab": false,
											"title": "",
											"type": "link"
										},
										{
											"text": ""
										}
									],
									"type": "paragraph"
								}
							]
						}
					},
					"links": [
						{
							"__typename": "ButtonLink",
							"id": "cmkfch42b3eto07mhbugkkc7g",
							"linkText": "Get started",
							"linkUrl": "/get-started",
							"page": null,
							"stage": "PUBLISHED",
							"updatedAt": "2026-01-15T11:06:43.245319+00:00",
							"variation": "primary"
						},
						{
							"__typename": "ButtonLink",
							"id": "cmkfch42b3etp07mhhps33l8c",
							"linkText": "Learn more",
							"linkUrl": "/about",
							"page": null,
							"stage": "PUBLISHED",
							"updatedAt": "2026-01-15T11:06:43.245319+00:00",
							"variation": "tertiary"
						}
					],
					"stage": "PUBLISHED",
					"title": "Data to enrich your online business",
					"updatedAt": "2026-01-21T07:58:35.479318+00:00"
				},
				{
					"__typename": "FeatureBlock",
					"content": {
						"__typename": "RichText",
						"raw": {
							"children": [
								{
									"children": [
										{
											"text": "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione."
										}
									],
									"type": "paragraph"
								},
								{
									"children": [
										{
											"text": ""
										}
									],
									"type": "paragraph"
								}
							]
						}
					},
					"features": [
						{
							"__typename": "Feature",
							"description": "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.",
							"headline": "Push to deploy",
							"icon": "cloudArrowUpIcon",
							"id": "cmkgnywcurfo207mmiem3tmgm",
							"stage": "PUBLISHED",
							"title": "Push to deploy",
							"updatedAt": "2026-01-16T09:16:15.021633+00:00"
						},
						{
							"__typename": "Feature",
							"description": "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
							"headline": "SSL certificates",
							"icon": "lockClosedIcon",
							"id": "cmkgnywcurfo107mm16ov0inq",
							"stage": "PUBLISHED",
							"title": "SSL certificates",
							"updatedAt": "2026-01-16T09:30:14.177405+00:00"
						},
						{
							"__typename": "Feature",
							"description": "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.",
							"headline": "Database backups.",
							"icon": "serverIcon",
							"id": "cmkgnywcurfo007mm5rwofc5x",
							"stage": "PUBLISHED",
							"title": "Database backups.",
							"updatedAt": "2026-01-16T09:30:14.177405+00:00"
						}
					],
					"id": "cmkfch41m3etl07mhi103q41i",
					"image": {
						"__typename": "Asset",
						"id": "cmkfcgvgm3ehq07mh8tj6h93u"
					},
					"pretitle": "Deploy faster",
					"stage": "PUBLISHED",
					"title": "A better workflow",
					"updatedAt": "2026-01-16T09:30:14.177405+00:00"
				}
			],
			"siteName": "frontEnd",
			"stage": "PUBLISHED",
			"updatedAt": "2026-01-21T07:58:35.479318+00:00",
			"updatedBy": {
				"__typename": "User",
				"id": "cmkc9a69l1zob07mjekvb0zed"
			}
		}
	}; */
	const payload = {
		"operation": "publish",
		"data": {
			"__typename": "Page",
			"childPages": [
				{
					"__typename": "Page",
					"id": "cmkh130rpb26708lacstvinfx"
				}
			],
			"createdAt": "2026-01-16T10:15:32.114645+00:00",
			"createdBy": {
				"__typename": "User",
				"id": "cmkc9a69l1zob07mjekvb0zed"
			},
			"id": "cmkgq350ou1pe07mhiyc45yi1",
			"pageName": "About",
			"parentPage": {
				"__typename": "Homepage",
				"id": "cmkfc5p4s2vct07mjsqt0hg96"
			},
			"publishedAt": "2026-01-21T08:12:11.331812+00:00",
			"publishedBy": {
				"__typename": "User",
				"id": "cmkc9a69l1zob07mjekvb0zed"
			},
			"scheduledIn": [],
			"sections": [
				{
					"__typename": "Hero",
					"content": {
						"__typename": "RichText",
						"raw": {
							"children": [
								{
									"children": [
										{
											"text": "When creating or updating entries, ensure your mutation payload matches the schema type shown in the API Playground. For localized models or fields, you must include a locale property. Incorrectly structured payloads are a common cause of Invalid payload / could not transform RichText errors."
										}
									],
									"type": "paragraph"
								}
							]
						}
					},
					"id": "cmkgq350ou1pf07mh7ahugxf2",
					"keyline": {
						"__typename": "RichText",
						"raw": {
							"children": [
								{
									"children": [
										{
											"text": "More about us"
										}
									],
									"type": "paragraph"
								}
							]
						}
					},
					"links": [],
					"stage": "PUBLISHED",
					"title": "About us",
					"updatedAt": "2026-01-21T08:12:02.063112+00:00"
				},
				{
					"__typename": "Banner",
					"content": {
						"__typename": "RichText",
						"raw": {
							"children": [
								{
									"children": [
										{
											"text": "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat."
										}
									],
									"type": "paragraph"
								}
							]
						}
					},
					"id": "cmkh3uofaeb9907mpp0gepibb",
					"links": [
						{
							"__typename": "ButtonLink",
							"id": "cmkh3uofaeb9a07mp7s6o34do",
							"linkText": "Open roles",
							"linkUrl": "/roles",
							"page": null,
							"stage": "PUBLISHED",
							"updatedAt": "2026-01-16T16:40:51.976882+00:00",
							"variation": "tertiary"
						},
						{
							"__typename": "ButtonLink",
							"id": "cmkh3uofaeb9b07mp104tx4z8",
							"linkText": "Internships",
							"linkUrl": "/internships",
							"page": null,
							"stage": "PUBLISHED",
							"updatedAt": "2026-01-16T16:40:51.976882+00:00",
							"variation": "tertiary"
						}
					],
					"stage": "PUBLISHED",
					"statistics": {
						"__typename": "Statistics",
						"id": "cmkh3uofaeb9c07mprxy8y911",
						"stage": "PUBLISHED",
						"statContent": "Test content for this component",
						"statTitle": "Test Title",
						"statistics": [
							{
								"__typename": "Statistic",
								"description": "Offices worldwide",
								"id": "cmkh3uofaeb9d07mp5krwo1sy",
								"stage": "PUBLISHED",
								"title": "12",
								"updatedAt": "2026-01-16T16:40:51.976882+00:00"
							},
							{
								"__typename": "Statistic",
								"description": "Full-time colleagues",
								"id": "cmkh3uofaeb9e07mpdxun2f3i",
								"stage": "PUBLISHED",
								"title": "300+",
								"updatedAt": "2026-01-16T16:40:51.976882+00:00"
							},
							{
								"__typename": "Statistic",
								"description": "Hours per week",
								"id": "cmkh3uofaeb9f07mp2e6om326",
								"stage": "PUBLISHED",
								"title": "40",
								"updatedAt": "2026-01-16T16:40:51.976882+00:00"
							},
							{
								"__typename": "Statistic",
								"description": "Paid time off",
								"id": "cmkh3uofaeb9g07mp2wp7sq8g",
								"stage": "PUBLISHED",
								"title": "Unlimited",
								"updatedAt": "2026-01-16T16:40:51.976882+00:00"
							}
						],
						"updatedAt": "2026-01-19T15:42:20.693705+00:00"
					},
					"title": "Work with us",
					"updatedAt": "2026-01-19T15:42:20.693705+00:00"
				},
				{
					"__typename": "Content",
					"content": [
						{
							"__typename": "Article",
							"content": {
								"__typename": "RichText",
								"raw": {
									"children": [
										{
											"children": [
												{
													"text": "Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper sed amet vitae sed turpis id. Id dolor praesent donec est. Odio penatibus risus viverra tellus varius sit neque erat velit. Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper sed amet vitae sed turpis id."
												}
											],
											"type": "paragraph"
										}
									]
								}
							},
							"id": "cmkmua9x1w8fq07l1qs3vkuhh",
							"stage": "PUBLISHED",
							"updatedAt": "2026-01-20T16:59:40.55324+00:00"
						},
						{
							"__typename": "FeatureBlock",
							"content": null,
							"features": [
								{
									"__typename": "Feature",
									"description": "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.",
									"headline": "Push to deploy.",
									"icon": "cloudArrowUpIcon",
									"id": "cmkmua9xbw8fs07l1ye6go7yl",
									"stage": "PUBLISHED",
									"title": "Push to deploy.",
									"updatedAt": "2026-01-20T16:59:40.55324+00:00"
								},
								{
									"__typename": "Feature",
									"description": "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
									"headline": "SSL certificates.",
									"icon": "lockClosedIcon",
									"id": "cmkmua9xbw8ft07l1qvp96env",
									"stage": "PUBLISHED",
									"title": "SSL certificates.",
									"updatedAt": "2026-01-20T16:59:40.55324+00:00"
								},
								{
									"__typename": "Feature",
									"description": "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.",
									"headline": "Database backups.",
									"icon": "serverIcon",
									"id": "cmkmua9xbw8fu07l19w4srz2i",
									"stage": "PUBLISHED",
									"title": "Database backups.",
									"updatedAt": "2026-01-20T16:59:40.55324+00:00"
								}
							],
							"id": "cmkmua9xbw8fr07l1258nkui2",
							"image": {
								"__typename": "Asset",
								"id": "cmkfcgvgm3ehq07mh8tj6h93u"
							},
							"pretitle": null,
							"stage": "PUBLISHED",
							"title": "Content features",
							"updatedAt": "2026-01-20T16:59:40.55324+00:00"
						},
						{
							"__typename": "Article",
							"content": {
								"__typename": "RichText",
								"raw": {
									"children": [
										{
											"children": [
												{
													"text": "Et vitae blandit facilisi magna lacus commodo. Vitae sapien duis odio id et. Id blandit molestie auctor fermentum dignissim. Lacus diam tincidunt ac cursus in vel. Mauris varius vulputate et ultrices hac adipiscing egestas. Iaculis convallis ac tempor et ut. Ac lorem vel integer orci."
												}
											],
											"type": "paragraph"
										},
										{
											"children": [
												{
													"text": "No server? No problem."
												}
											],
											"type": "heading-two"
										},
										{
											"children": [
												{
													"text": "Id orci tellus laoreet id ac. Dolor, aenean leo, ac etiam consequat in. Convallis arcu ipsum urna nibh. Pharetra, euismod vitae interdum mauris enim, consequat vulputate nibh. Maecenas pellentesque id sed tellus mauris, ultrices mauris. Tincidunt enim cursus ridiculus mi. Pellentesque nam sed nullam sed diam turpis ipsum eu a sed convallis diam."
												}
											],
											"type": "paragraph"
										}
									]
								}
							},
							"id": "cmkmua9xbw8fv07l1gpe4cbl0",
							"stage": "PUBLISHED",
							"updatedAt": "2026-01-20T16:59:40.55324+00:00"
						}
					],
					"id": "cmkmua9x1w8fp07l17qr521ay",
					"image": {
						"__typename": "Asset",
						"id": "cmkfcgvgm3ehq07mh8tj6h93u"
					},
					"introduction": "Aliquet nec orci mattis amet quisque ullamcorper neque, nibh sem. At arcu, sit dui mi, nibh dui, diam eget aliquam. Quisque id at vitae feugiat egestas.",
					"pretitle": "Deploy faster",
					"stage": "PUBLISHED",
					"title": "A better workflow",
					"updatedAt": "2026-01-20T16:59:40.55324+00:00"
				}
			],
			"siteName": "frontEnd",
			"slug": "about",
			"stage": "PUBLISHED",
			"updatedAt": "2026-01-21T08:12:02.063112+00:00",
			"updatedBy": {
				"__typename": "User",
				"id": "cmkc9a69l1zob07mjekvb0zed"
			}
		}
	};
	const cache = NotRedis.getInstance();

	if (payload.data.pageName === 'Homepage') {
		const homepageCacheKey = createCacheKey('id', 'homepage', {});
		const cachedResult = cache.get(homepageCacheKey);
		if (cachedResult) {
			cache.delete(homepageCacheKey);
			return new Response(`Cache cleared for homepage: ${homepageCacheKey}`, { status: 200 });
		}
		return new Response('No cache found for homepage', { status: 200 });
	}
	if (payload.data.__typename === 'Page') {
		const pageCacheKey = createCacheKey('id', payload.data.id, {});
		const pagedCachedResult = cache.get(pageCacheKey);
		if (pagedCachedResult) {
			cache.delete(pageCacheKey);
			return new Response(`Cache cleared for page: ${pageCacheKey}`, { status: 200 });
		}
		return new Response(`No cache found for page: ${pageCacheKey}`, { status: 200 });
	}
	console.log('No matching typename for cache invalidation. Invalidating entire cache as fallback.');
	cache.clear();
	return new Response('Cache cleared', { status: 200 });
}
