interface Title {
	title: string;
	content: string;
	contentId: string;
}

export const Title: React.FC<Title> = ({ title, content, contentId }) => {
	return (
		<div className="mx-auto max-w-4xl text-center">
			<h2
				className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl"
				data-hygraph-entry-id={contentId}
				data-hygraph-field-api-id="title"
			>
				{title}
			</h2>
			<p
				className="mt-4 text-lg leading-6 text-gray-600"
				data-hygraph-entry-id={contentId}
				data-hygraph-field-api-id="content"
			>
				{content}
			</p>
		</div>
	);
};
