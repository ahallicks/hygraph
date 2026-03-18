/**
 * Hygraph Preview wrapper for Remix
 * Minimal setup for content preview integration
 */

import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

interface PreviewWrapperProps {
	children: React.ReactNode;
}

export const PreviewWrapper = ({
	children,
}: PreviewWrapperProps): React.ReactNode => {
	const navigate = useNavigate();
	const [Preview, setPreview] = useState<React.ComponentType<
		Record<string, unknown>
	> | null>(null);

	useEffect(() => {
		// Only load in development and on client-side
		if (
			typeof window !== 'undefined' &&
			process.env.NODE_ENV === 'development'
		) {
			import('@hygraph/preview-sdk/react')
				// @ts-expect-error This type is wrong!
				.then((module) => setPreview(() => module.HygraphPreview))
				.catch(console.error);
		}
	}, []);

	// Render Preview when loaded
	if (Preview && typeof window !== 'undefined') {
		return (
			<Preview
				endpoint={window.ENV.HYGRAPH_ENDPOINT}
				studioUrl={window.ENV.HYGRAPH_STUDIO_URL}
				// debug={true}
				sync={{ fieldUpdate: true }}
				onSave={() => {
					console.log('Content saved, refreshing...');
					navigate('?reloaded=1', {
						preventScrollReset: true,
						replace: true,
					});
				}}
			>
				{children}
			</Preview>
		);
	}

	return <>{children}</>;
};
