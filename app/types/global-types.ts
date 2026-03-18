export type TImage = {
	url: string;
	width: number;
	height: number;
};

export type TNavLink = {
	linkText: string;
	linkUrl: string;
	variation?: 'primary' | 'secondary' | 'tertiary';
};

export type TAuthor = {
	id: string;
	name: string;
	picture: string;
};
