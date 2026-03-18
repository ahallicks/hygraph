import type { toHaveNoViolations } from './../node_modules/@types/jest-axe/index.d.ts';

import { expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
expect.extend(matchers);

export const checkA11y = async (
	component: string | Element,
	axeOptions = {},
): Promise<void> => {
	const results = await axe(component, axeOptions);

	expect(results).toHaveNoViolations();
};
