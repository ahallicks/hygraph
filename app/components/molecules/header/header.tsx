'use client';

import type { IGlobalData, INavLink } from '~/services/get-global-data.ts';

import { useEffect, useState } from 'react';
import { Link, useNavigation } from 'react-router';
import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
	Popover,
	PopoverButton,
	PopoverGroup,
	PopoverPanel,
	TransitionChild,
} from '@headlessui/react';

import { buildPageUrl } from '~/utils/build-url.ts';

import { Icon } from '~/components/atoms/icon/icon.tsx';

export const HeaderComponent: React.FC<IGlobalData> = ({
	title,
	logo,
	logoAltText,
	navigationLinks,
}) => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const navigation = useNavigation();

	useEffect(() => {
		if (navigation.state === 'loading' && !isLoading) {
			setIsLoading(true);
		}
		if (navigation.state === 'idle' && isLoading) {
			setIsLoading(false);
			setMobileMenuOpen(false);
		}
	}, [navigation.state, isLoading]);

	return (
		<header className="sticky inset-x-0 top-0 z-40 backdrop-blur-md">
			<nav
				aria-label="Global"
				className="flex items-center justify-between px-6 py-4 lg:px-8 lg:py-6"
			>
				<div className="flex lg:flex-1">
					<Link to="/" rel="home" className="-m-1.5 p-1.5">
						<span className="sr-only">{title}</span>
						<img
							alt={logoAltText}
							src={logo.url}
							className="h-8 w-auto"
						/>
					</Link>
				</div>
				<div className="flex lg:hidden">
					<button
						type="button"
						onClick={() => setMobileMenuOpen(true)}
						className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300"
					>
						<span className="sr-only">Open main menu</span>
						<Icon
							icon="bars3Icon"
							aria-hidden="true"
							className="size-6"
						/>
					</button>
				</div>
				<PopoverGroup className="hidden lg:block">
					<ul className="lg:flex lg:gap-x-12">
						{navigationLinks.map((item) => (
							<li key={item.linkText}>
								<Popover className="relative">
									<PopoverButton className="inline-flex items-center gap-x-1 text-sm/6 font-semibold text-gray-700 dark:text-gray-300">
										<span>{item.linkText}</span>
										<Icon
											icon="chevronDownIcon"
											aria-hidden="true"
											className="size-5"
										/>
									</PopoverButton>
									<PopoverPanel
										transition
										className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 bg-transparent px-4 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
									>
										{({ close }) => (
											<div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm/6 shadow-lg outline-1 outline-gray-900/5 dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
												{item.page.childPages
													?.length ? (
													<ul className="p-4">
														{item.page.childPages.map(
															(childPage) => (
																<SubNavItem
																	item={item}
																	childPage={
																		childPage
																	}
																	key={
																		childPage.id
																	}
																	close={
																		close
																	}
																/>
															),
														)}
													</ul>
												) : null}
												<div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50 dark:divide-white/10 dark:bg-gray-700/50">
													<Link
														to={buildPageUrl(item)}
														className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700/50"
														onClick={() => close()}
													>
														<Icon
															icon={
																item.page
																	.pageIcon
															}
															aria-hidden="true"
															className="size-5 flex-none text-gray-500"
														/>
														View all {item.linkText}
													</Link>
												</div>
											</div>
										)}
									</PopoverPanel>
								</Popover>
							</li>
						))}
					</ul>
				</PopoverGroup>
				<div className="hidden lg:flex lg:flex-1 lg:justify-end">
					Front End UK
				</div>
			</nav>
			<MobileNav
				title={title}
				logo={logo}
				logoAltText={logoAltText}
				navigationLinks={navigationLinks}
				open={mobileMenuOpen}
				setOpen={setMobileMenuOpen}
			/>
		</header>
	);
};

export const MobileNav: React.FC<
	Pick<
		IGlobalData & {
			open: boolean;
			setOpen: React.Dispatch<React.SetStateAction<boolean>>;
		},
		| 'title'
		| 'logo'
		| 'logoAltText'
		| 'navigationLinks'
		| 'open'
		| 'setOpen'
	>
> = ({ title, logo, logoAltText, navigationLinks, open, setOpen }) => (
	<Dialog open={open} onClose={setOpen} className="relative z-50">
		<DialogBackdrop
			transition
			className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
		/>

		<div className="fixed inset-0 overflow-hidden">
			<div className="absolute inset-0 overflow-hidden">
				<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
					<DialogPanel
						transition
						className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
					>
						<TransitionChild>
							<div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 duration-500 ease-in-out data-closed:opacity-0 sm:-ml-10 sm:pr-4">
								<button
									type="button"
									onClick={() => setOpen(false)}
									className="relative rounded-md text-gray-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
								>
									<span className="absolute -inset-2.5" />
									<span className="sr-only">Close panel</span>
									<Icon
										icon="xMarkIcon"
										aria-hidden="true"
										className="size-6"
									/>
								</button>
							</div>
						</TransitionChild>
						<div className="relative flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl dark:bg-gray-900">
							<div className="px-4 sm:px-6">
								<DialogTitle className="flex items-center gap-4 text-base font-semibold text-gray-900 dark:text-gray-300">
									<img
										alt={logoAltText}
										src={logo.url}
										className="h-8 w-auto"
									/>
									{title}
								</DialogTitle>
							</div>
							<div className="relative mt-6 flex-1 px-4 sm:px-6">
								<ul className="space-y-2 py-6">
									{navigationLinks.map((item) => (
										<li key={item.linkText}>
											<Link
												to={buildPageUrl(item)}
												className="flex items-center justify-between rounded-lg bg-gray-100 px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
											>
												{item.linkText}{' '}
												<Icon
													icon="arrowRightCircleIcon"
													aria-hidden="true"
													className="inline size-5"
												/>
											</Link>
											{item.page.childPages?.length ? (
												<ul className="mt-2 space-y-1">
													{item.page.childPages.map(
														(childPage) => (
															<SubNavItem
																item={item}
																childPage={
																	childPage
																}
																key={
																	childPage.id
																}
															/>
														),
													)}
												</ul>
											) : null}
										</li>
									))}
								</ul>
							</div>
						</div>
					</DialogPanel>
				</div>
			</div>
		</div>
	</Dialog>
);

const SubNavItem: React.FC<{
	item: INavLink;
	childPage: {
		id: string;
		pageName: string;
		slug: string;
		introduction: string;
		pageIcon: string;
	};
	close?: () => void;
}> = ({ item, childPage, close }) => (
	<li className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-white/5">
		<div className="mt-1 flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white dark:bg-gray-700/50 dark:group-hover:bg-gray-700">
			<Icon
				icon={childPage.pageIcon}
				aria-hidden="true"
				className="size-6 text-gray-600 group-hover:text-indigo-600 dark:text-gray-400 dark:group-hover:text-white"
			/>
		</div>
		<div>
			<Link
				to={`/${item.page.slug}/${childPage.slug}`}
				className="text-sm font-semibold md:text-base dark:text-gray-300"
				onClick={() => close && close()}
			>
				{childPage.pageName}
				<span className="absolute inset-0" />
			</Link>
			<p className="mt-1 text-xs text-gray-600 md:text-base dark:text-gray-400">
				{childPage.introduction}
			</p>
		</div>
	</li>
);
