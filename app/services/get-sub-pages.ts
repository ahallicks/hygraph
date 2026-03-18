import type { IContent } from '~/components/molecules/content/content-types.ts';

import { GraphQLClient, gql } from 'graphql-request';

export interface ISubPages {
	pages: {
		pageName: string;
		slug: string;
		childPages: ISubPage[];
	}[];
}

export interface ISubPage {
	id: string;
	pageName: string;
	slug: string;
	created: string;
	updated: string;
	published: string;
	createdBy: {
		id: string;
		name: string;
		picture: string;
	};
	introduction: string;
	sections: IContent[]
};

type TPagesParams = {
	slug: string;
};

// TODO - get content references to internal models working (Codepen)
const getSubPagesQuery = ({ slug }: TPagesParams): string => gql`
	{
		pages(where: {slug: "${slug}"}) {
			... on Page {
				pageName
				slug
				childPages {
					... on Page {
						id
						pageName
						slug
						created: createdAt
						updated: updatedAt
						published: publishedAt
						createdBy {
							... on User {
								id
								name
								picture
							}
						}
						introduction
						sections {
							__typename
							... on Content {
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
													author
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
								}
							}
						}
					}
				}
			}
		}
	}
`;

export const getSubPages = async ({ slug }: TPagesParams): Promise<ISubPage[]> => {
	try {
		const hygraph = new GraphQLClient(process.env.HYGRAPH_ENDPOINT as string, {
			headers: {},
		});

		const { pages }: ISubPages = await hygraph.request(getSubPagesQuery({ slug }));
		if (!pages || pages.length === 0) {
			return [];
		}
		if (!pages[0].childPages || pages[0].childPages.length === 0) {
			return [];
		}
		return pages[0].childPages;
	} catch (error) {
		console.error('Error fetching page data:', error);
		throw new Response('Page not found', { status: 404 });
	}
};
