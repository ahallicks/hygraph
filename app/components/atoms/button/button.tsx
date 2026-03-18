import { clsx } from 'clsx';
import { Link } from 'react-router';

export type TPage = {
	slug: string;
	pageName: string;
	parentPage: TPage | null;
};

export type TButtonLink = {
	id?: string;
	linkText: string;
	linkUrl: string;
	variation?: 'primary' | 'secondary' | 'tertiary';
	className?: string;
	page?: TPage | null;
	onClick?: () => void;
};

export type TButtonLinkWithChildren = TButtonLink & React.PropsWithChildren;

const classes = {
	primary:
		'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600',
	secondary:
		'bg-gray-900 dark:bg-white/10 text-white hover:bg-gray-700 focus-visible:outline-gray-900',
	tertiary:
		'text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-900 dark:ring-gray-400 hover:bg-gray-50 dark:hover:text-gray-900 focus-visible:outline-indigo-600',
};

export const ButtonLink: React.FC<TButtonLinkWithChildren> = ({
	linkText,
	linkUrl,
	variation = 'primary',
	className = '',
	children,
	onClick,
	...rest
}) => {
	return (
		<Link
			key={linkUrl}
			to={linkUrl}
			onClick={onClick}
			className={clsx(
				classes[variation],
				className,
				'px-3.5 py-2.5 text-sm rounded-md hover:transition-colors shadow-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2',
			)}
			{...rest}
		>
			{linkText}
			{children ? children : null}
		</Link>
	);
};
