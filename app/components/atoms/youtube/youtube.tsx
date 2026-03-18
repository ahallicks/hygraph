export interface IYouTube {
	id: string;
	youTubeTitle: string;
	youTubeVideoId: string;
	youTubeVideoUrl: string;
	author: string;
}

export const YouTube: React.FC<
	IYouTube & {
		className?: string;
	}
> = ({
	id,
	youTubeTitle,
	youTubeVideoId,
	youTubeVideoUrl,
	author,
	className,
}) => (
	<>
		<style
			dangerouslySetInnerHTML={{
				__html: `.embed-container {position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed {position: absolute; top: 0; left: 0; width: 100%; height: 100%; }`,
			}}
		></style>
		<div id={id} className={`embed-container rounded-lg ${className}`}>
			<iframe
				src={`https://www.youtube.com/embed/${youTubeVideoId}`}
				frameBorder="0"
				allowFullScreen
				title={youTubeTitle}
			>
				<p>
					See the video{' '}
					<a href={`${youTubeVideoUrl}`}>{youTubeTitle}</a> by{' '}
					{author} on <a href="https://www.youtube.com">YouTube</a>.
				</p>
			</iframe>
		</div>
	</>
);
