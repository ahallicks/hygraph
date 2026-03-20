import type { TCategory } from '~/types/global-types.ts';

import { ButtonLink } from '../button/button.tsx';

export const Categories: React.FC<{ categories: TCategory[] }> = ({
	categories,
}) => {
	if (!categories || categories.length === 0) {
		return null;
	}
	return (
		<ul className="not-prose mt-6 flex flex-wrap gap-4">
			{categories.map((category) => (
				<li key={category.id}>
					<ButtonLink
						linkText={category.categoryName}
						linkUrl={`/category/${category.slug}`}
						className="inline-flex text-xs"
						variation="tertiary"
					/>
				</li>
			))}
		</ul>
	);
};
