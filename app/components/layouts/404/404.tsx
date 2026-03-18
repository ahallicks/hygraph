import { ButtonLink } from '~/components/atoms/button/button.tsx';

export const NotFound = ({
	status,
	message,
	details,
	stack,
}: {
	status: string;
	message: string;
	details: string;
	stack?: string;
}): React.ReactNode => (
	<section className="grid min-h-full px-6 bg-white segment dark:bg-gray-900 lg:px-8">
		<div className="text-center">
			<p className="text-base font-semibold text-indigo-600">{status}</p>
			<h1 className="mt-4 text-5xl font-semibold tracking-tight text-gray-900 text-balance sm:text-7xl dark:text-gray-300">
				{message}
			</h1>
			<p className="mt-6 text-lg font-medium text-gray-500 text-pretty sm:text-xl/8 dark:text-gray-400">
				{details}
			</p>
			{stack ? (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			) : null}
			<div className="flex items-center justify-center mt-10 gap-x-6">
				<ButtonLink
					linkUrl="/"
					linkText="Go back home"
					variation="primary"
				/>
				<ButtonLink
					linkUrl="/contact"
					linkText="Contact support"
					variation="tertiary"
				/>
			</div>
		</div>
	</section>
);
