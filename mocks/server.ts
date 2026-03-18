import { setupServer } from 'msw/node';

import { mswHandlers } from './handlers.ts';

export const server = setupServer(...mswHandlers);
