import type { TButtonLinkWithChildren } from './button.tsx';
import type { UserEvent } from '@testing-library/user-event';

import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { checkA11y } from 'tests/test-utils.ts';

import { ButtonLink } from './button.tsx';
import { ButtonLinkMock } from './button.mock.ts';

describe('~/components/01-atoms/cta', () => {
	afterEach(() => {
		vi.clearAllMocks();
		cleanup();
	});

	test('passes accessibility checks', async () => {
		const { container } = setupTest();
		await checkA11y(container);
	});

	test('should render', async () => {
		const { user, props } = setupTest({ props: { onClick: vi.fn() } });

		const button = screen.getByRole('button');

		expect(button).toBeTruthy();

		await user.click(button);

		expect(props.onClick).toHaveBeenCalledTimes(1);
	});
});

type TestOverrides = {
	props?: Partial<TButtonLinkWithChildren>;
};

type TReturn = {
	props: TButtonLinkWithChildren;
	user: UserEvent;
	container: HTMLElement;
	baseElement: HTMLElement;
};

const getDefaultProps = (
	overrides: Partial<TButtonLinkWithChildren> = {},
): TButtonLinkWithChildren => ({
	...overrides,
	...ButtonLinkMock,
});

const setupTest = (overrides: TestOverrides = {}): TReturn => {
	const props = getDefaultProps(overrides.props);
	const utils = render(<ButtonLink {...props} />);

	return {
		...utils,
		props,
		user: userEvent.setup(),
	};
};
