export interface ICodepen {
	id: string;
	codepenId: string;
	codepenUrl: string;
	codepenTitle: string;
	author: string;
}

export const CodePen: React.FC<ICodepen> = ({
	id,
	codepenId,
	codepenTitle,
	codepenUrl,
	author,
}) => {
	const inlineStyles = {
		height: '500px',
		border: '2px solid',
	} as React.CSSProperties;
	return (
		<>
			<div
				className="codepen not-prose my-12 flex items-center justify-center p-6"
				data-height="500"
				data-default-tab="result"
				data-slug-hash={codepenId}
				data-pen-title={codepenTitle}
				data-user={author}
				style={inlineStyles}
				id={id}
			>
				<span>
					See the Pen <a href={`${codepenUrl}`}>{codepenTitle}</a> by{' '}
					{author} (
					<a href={`https://codepen.io/${author}`}>@{author}</a>) on{' '}
					<a href="https://codepen.io">CodePen</a>.
				</span>
			</div>
			<script
				async
				src="https://cpwebassets.codepen.io/assets/embed/ei.js"
			></script>
		</>
	);
};
