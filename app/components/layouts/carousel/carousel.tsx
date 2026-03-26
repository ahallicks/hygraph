import CarouselProvider, { useCarouselContext } from '~/contexts/carousel.tsx';

import { Icon } from '~/components/atoms/icon/icon.tsx';

type TScrollAxis = 'horizontal' | 'vertical';

export type TCarouselSlider = React.PropsWithChildren & {
	tag?: keyof Pick<React.JSX.IntrinsicElements, 'ol' | 'ul' | 'section'>;
	axis?: TScrollAxis;
	steps?: number;
};

export type TCarouselProps = TCarouselSlider &
	React.HtmlHTMLAttributes<HTMLElement>;

export const CarouselContainer: React.FC<{
	children: React.ReactNode;
	steps: number;
}> = ({ steps, children }) => (
	<CarouselProvider steps={steps}>{children}</CarouselProvider>
);

export const Carousel: React.FC<TCarouselProps> = ({
	tag: Tag = 'ul',
	axis = 'horizontal',
	className,
	children,
}) => {
	const {
		containerRef,
		handleMouseDown,
		handleMouseLeave,
		handleMouseMove,
		handleMouseUp,
		hasScrollbar,
		isDragging,
	} = useCarouselContext();

	return (
		<Tag
			ref={containerRef}
			onMouseDown={handleMouseDown}
			onMouseLeave={handleMouseLeave}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			tabIndex={hasScrollbar ? 0 : undefined}
			className={`carousel mx-auto scrollbar-thin grid max-w-2xl grid-flow-col gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pt-4 pb-10 scrollbar-thumb-rounded-full scrollbar-thumb-slate-300 scrollbar-track-rounded-full scrollbar-track-transparent lg:mx-0 lg:max-w-none xl:gap-8 dark:border-gray-700 ${hasScrollbar ? 'cursor-grab' : ''} ${isDragging ? 'isDragging' : ''} ${axis === 'vertical' ? 'vertical' : ''} ${className}`}
		>
			{children}
		</Tag>
	);
};

export const CarouselButtons: React.FC = () => {
	const { isFirstItem, isLastItem, hasScrollbar, handleButtonClick } =
		useCarouselContext();

	if (!hasScrollbar) return null;

	return (
		<div className="flex justify-end gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
			<button
				type="button"
				onClick={() => handleButtonClick('previous')}
				aria-disabled={isFirstItem ? 'true' : undefined}
				disabled={isFirstItem ? true : undefined}
				className="flex h-8 w-8 items-center justify-center rounded-full text-gray-700 disabled:cursor-not-allowed disabled:text-gray-300 dark:text-gray-300 dark:disabled:text-gray-500"
			>
				<Icon icon="arrowRightCircleIcon" className="rotate-180" />
				<span className="sr-only">Previous item</span>
			</button>

			<button
				type="button"
				onClick={() => handleButtonClick('next')}
				aria-disabled={isLastItem ? 'true' : undefined}
				disabled={isLastItem ? true : undefined}
				className="flex h-8 w-8 items-center justify-center rounded-full text-gray-700 disabled:cursor-not-allowed disabled:text-gray-300 dark:text-gray-300 dark:disabled:text-gray-500"
			>
				<Icon icon="arrowRightCircleIcon" />
				<span className="sr-only">Next item</span>
			</button>
		</div>
	);
};
