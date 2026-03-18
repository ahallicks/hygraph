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
		boxSizing: 'border-box',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		border: '2px solid',
		margin: '1em 0',
		padding: '1em',
	} as React.CSSProperties;
	return (
		<>
			<p
				className="codepen"
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
			</p>
			<script
				async
				src="https://cpwebassets.codepen.io/assets/embed/ei.js"
			></script>
		</>
	);
};
