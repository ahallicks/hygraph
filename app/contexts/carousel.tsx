'use client';

import type { TDirection } from '~/types/global-types.ts';

import { createContext, use, useEffect, useRef, useState } from 'react';

type TListElement = HTMLUListElement | HTMLOListElement;
type TContainerRef = HTMLOListElement & HTMLUListElement;
type TAxis = 'horizontal' | 'vertical';
type TVisibleRange = { start: number; end: number };

export type TCarouselContext = {
	containerRef: React.RefObject<TContainerRef | null>;
	hasScrollbar: boolean;
	isFirstItem: boolean;
	isLastItem: boolean;
	isDragging: boolean;
	totalItems: number;
	visibleRange: TVisibleRange;
	handleButtonClick: (direction: TDirection) => void;
	handleMouseDown: (e: React.MouseEvent<TListElement>) => void;
	handleMouseLeave: () => void;
	handleMouseMove: (e: React.MouseEvent<TListElement>) => void;
	handleMouseUp: () => void;
};

const CarouselContext = createContext<TCarouselContext | null>(null);

export type TCarouselProvider = {
	children: React.ReactNode;
	steps?: number;
	axis?: TAxis;
};

const CarouselProvider: React.FC<TCarouselProvider> = ({
	children,
	steps = 3,
	axis = 'horizontal',
}): React.ReactNode => {
	const containerRef = useRef<TContainerRef | null>(null);
	const [hasScrollbar, setHasScrollbar] = useState(false);
	const [isFirstItem, setIsFirstItem] = useState(true);
	const [isLastItem, setIsLastItem] = useState(false);
	const [startPos, setStartPos] = useState(0);
	const [isMouseDown, setIsMouseDown] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [scrollPos, setScrollPos] = useState(0);
	const [currentSteps, setCurrentSteps] = useState(steps);
	const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });
	const [totalItems, setTotalItems] = useState(0);

	const isHorizontal = axis === 'horizontal';

	const handleButtonClick = (direction: TDirection): void => {
		const container = containerRef.current;

		if (!container) return;

		const firstElementChild = container.firstElementChild;
		const childWidth = firstElementChild?.clientWidth || 0;
		const childHeight = firstElementChild?.clientHeight || 0;

		const {
			scrollWidth,
			scrollHeight,
			clientWidth,
			clientHeight,
			scrollLeft,
			scrollTop,
		} = container;

		const isNext = direction === 'next';
		const itemSize = isHorizontal ? childWidth : childHeight;
		const scrollSize = isHorizontal ? scrollWidth : scrollHeight;
		const clientSize = isHorizontal ? clientWidth : clientHeight;

		const maxScroll = scrollSize - clientSize;
		const offset = (isNext ? 1 : -1) * itemSize * currentSteps;
		const baseScroll = (isHorizontal ? scrollLeft : scrollTop) + offset;

		const scrollPos = isHorizontal ? 'left' : 'top';
		const scrollTo = isNext
			? Math.min(baseScroll, maxScroll)
			: Math.max(baseScroll, 0);

		container.scrollTo({ [scrollPos]: scrollTo, behavior: 'smooth' });
	};

	const handleMouseDown = (e: React.MouseEvent<TListElement>): void => {
		e.stopPropagation();

		const { currentTarget, clientX, pageY } = e;
		const offsetLeft = currentTarget.offsetLeft || 0;
		const offsetTop = currentTarget.offsetTop || 0;
		const { scrollLeft, scrollTop } = currentTarget;
		const pos = isHorizontal ? clientX - offsetLeft : pageY - offsetTop;

		setIsMouseDown(true);
		setStartPos(pos);
		setScrollPos(isHorizontal ? scrollLeft : scrollTop);
	};

	const handleMouseLeave = (): void => {
		setIsMouseDown(false);
		setIsDragging(false);
	};

	const handleMouseUp = (): void => {
		setIsMouseDown(false);
		setIsDragging(false);
	};

	const handleMouseMove = (e: React.MouseEvent<TListElement>): void => {
		if (!isMouseDown || !hasScrollbar) return;
		if (!isDragging) setIsDragging(true);

		e.preventDefault();

		const { currentTarget, clientX, pageY } = e;
		const offsetLeft = currentTarget.offsetLeft || 0;
		const offsetTop = currentTarget.offsetTop || 0;

		const pos = isHorizontal ? clientX - offsetLeft : pageY - offsetTop;
		const walk = pos - startPos;

		if (isHorizontal) {
			e.currentTarget.scrollLeft = scrollPos - walk;
		} else {
			e.currentTarget.scrollTop = scrollPos - walk;
		}
	};

	const getFullyVisibleItems = (item: Element): boolean => {
		const container = containerRef.current as TContainerRef;
		const itemRect = item.getBoundingClientRect();
		const containerRect = container.getBoundingClientRect();

		const isFullyVisibleHorizontally =
			itemRect.left >= containerRect.left &&
			itemRect.right <= containerRect.right;

		const isFullyVisibleVertically =
			itemRect.top >= containerRect.top &&
			itemRect.bottom <= containerRect.bottom;

		return isHorizontal
			? isFullyVisibleHorizontally
			: isFullyVisibleVertically;
	};

	const fullyVisibleItemCount = (): number => {
		const container = containerRef.current;
		if (!container) return 0;

		const items = Array.from(container.children);
		const fullyVisibleItems = items.filter(getFullyVisibleItems);
		return fullyVisibleItems.length;
	};

	const isScrollbarVisible = (el: Element): boolean => {
		let result;
		const totalChildren = Array.from(el.children);
		if (totalChildren.length === fullyVisibleItemCount()) {
			setHasScrollbar(false);
			result = false;
		} else {
			const { scrollWidth, scrollHeight, clientWidth, clientHeight } = el;
			const isVisible = isHorizontal
				? scrollWidth > clientWidth
				: scrollHeight > clientHeight;
			setHasScrollbar(isVisible);
			result = isVisible;
		}
		return result;
	};

	const updateEffectiveSteps = (): void => {
		setCurrentSteps(Math.min(fullyVisibleItemCount(), steps));
	};

	const handleResize = (entries: ResizeObserverEntry[]): void => {
		for (const entry of entries) {
			isScrollbarVisible(entry.target);
			updateEffectiveSteps();
		}
	};

	const handleMutation = (mutations: MutationRecord[]): void => {
		for (const mutation of mutations) {
			if (
				mutation.type === 'childList' &&
				mutation.target instanceof Element
			) {
				isScrollbarVisible(mutation.target);
			}
		}
	};

	const handleIntersection = (entries: IntersectionObserverEntry[]): void => {
		const container = containerRef.current;
		const visibleItems = entries
			.filter((entry) => entry.isIntersecting)
			.map((entry) => entry.target as HTMLElement);

		const firstVisibleItem = visibleItems[0];
		const lastVisibleItem = visibleItems[visibleItems.length - 1];

		if (!container || !firstVisibleItem || !lastVisibleItem) return;

		const items = Array.from(container.children) as HTMLElement[];
		const firstVisibleIndex = items.indexOf(firstVisibleItem);
		const lastVisibleIndex = items.indexOf(lastVisibleItem);
		const noVisibleItems = visibleItems.length === 0;
		const startRange = noVisibleItems ? 0 : firstVisibleIndex + 1;
		const endRange = noVisibleItems ? 0 : lastVisibleIndex + 1;

		setTotalItems(items.length);
		setIsFirstItem(firstVisibleIndex === 0);
		setIsLastItem(lastVisibleIndex === items.length - 1);
		setVisibleRange({ start: startRange, end: endRange });
	};

	useEffect(() => {
		const container = containerRef.current;

		if (!container) return;

		const resizeObserver = new ResizeObserver(handleResize);
		const mutationObserver = new MutationObserver(handleMutation);
		const interSectObserver = new IntersectionObserver(handleIntersection, {
			root: container,
			rootMargin: '1px',
			threshold: 0.999,
		});

		const items = Array.from(container.children);

		resizeObserver.observe(container);
		mutationObserver.observe(container, { childList: true });
		items.forEach((item) => interSectObserver.observe(item));

		return () => {
			resizeObserver.disconnect();
			mutationObserver.disconnect();
			interSectObserver.disconnect();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<CarouselContext.Provider
			value={{
				containerRef,
				hasScrollbar,
				isFirstItem,
				isLastItem,
				isDragging,
				totalItems,
				visibleRange,
				handleButtonClick,
				handleMouseDown,
				handleMouseLeave,
				handleMouseMove,
				handleMouseUp,
			}}
		>
			{children}
		</CarouselContext.Provider>
	);
};

const useCarouselContext = (): TCarouselContext => {
	const context = use(CarouselContext);

	if (!context) {
		throw new Error(
			'useCarouselContext must be used within a CarouselProvider',
		);
	}
	return context;
};

export { CarouselContext, useCarouselContext };
export default CarouselProvider;
