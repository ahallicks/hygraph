import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import { server } from '../mocks/server.ts';

vi.spyOn(console, 'error').mockImplementation(() => null);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
