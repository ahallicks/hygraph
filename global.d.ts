/* eslint no-var: */

type TENV = {
	HYGRAPH_ENDPOINT: string;
	HYGRAPH_STUDIO_URL: string;
};

export declare global {
	var ENV: TENV;
}
