import { setupServer } from 'msw/node';
import { mswHandlers } from '../mocks/handlers.ts';

export const mswServer = setupServer(...mswHandlers);
