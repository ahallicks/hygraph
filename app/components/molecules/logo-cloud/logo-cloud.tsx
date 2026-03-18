import type { ILogoCloud } from './logo-cloud-types.ts';

export const LogoCloud: React.FC<ILogoCloud> = ({
	logoTitle,
	logos,
	contentId,
}) => {
	return (
		<div className="bg-white py-24 sm:py-32">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				{logoTitle ? (
					<h2
						className="text-center text-lg/8 font-semibold text-gray-900"
						data-hygraph-entry-id={contentId}
						data-hygraph-field-api-id="logoTitle"
					>
						{logoTitle}
					</h2>
				) : null}
				<div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
					{logos.map((logo, index) => (
						<img
							key={`logo-cloud-logo-${index}`}
							alt=""
							src={logo.url}
							width={158}
							height={48}
							className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
						/>
					))}
				</div>
			</div>
		</div>
	);
};
