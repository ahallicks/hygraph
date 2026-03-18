import type { TImage } from "~/types/global-types.ts";

export interface ILogoCloud {
	__typename: 'LogoCloud';
	contentId: string;
	logoTitle: string;
	logos: TImage[];
}
