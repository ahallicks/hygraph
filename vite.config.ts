/// <reference types="vitest/config" />
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { DevTools } from '@vitejs/devtools';
// import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
	plugins: [/* basicSsl(),  */ DevTools(), tailwindcss(), reactRouter()],
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		environment: 'jsdom',
		setupFiles: ['./tests/test-setup.ts'],
	},
});
