import type { IDivider } from './divider-types.ts';

type TDivider = {
	noSpacing?: boolean;
};

export const Divider: React.FC<TDivider> = ({ noSpacing }) => (
	<section
		className={`segment mx-auto max-w-7xl px-6 lg:px-8 ${noSpacing ? 'py-0' : 'my-12'}`}
	>
		<hr className="h-px border-t-0 bg-transparent bg-linear-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
	</section>
);

export const DividerWithText: React.FC<IDivider> = ({ text }) => (
	<section className="segment mx-auto max-w-7xl px-6 lg:px-8">
		<div className="py-3 flex items-center gap-8 text-sm text-gray-700 before:flex-1 before:h-0.5 after:h-0.5 after:w-full before:opacity-25 after:opacity-25 before:bg-linear-to-r before:from-transparent before:to-neutral-500 before:w-full after:flex-1 after:bg-linear-to-r  after:from-neutral-500 after:to-transparent dark:text-white dark:before:bg-linear-to-r dark:before:from-transparent dark:before:to-neutral-700 dark:after:bg-linear-to-r dark:after:from-neutral-700 dark:after:to-transparent">
			{text}
		</div>
	</section>
);
