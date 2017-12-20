import React, { PropTypes } from 'react';
import classNames from 'classnames';

const ReactComponentRenderer = ({ imagePath, hasSlice, nameFallback, designMarkdown, name, pathLine, description, props, examples, sidebar }) => {
	const isSingleColumn = !designMarkdown || !props;

	const rendererClass = 'rsg-react-component__renderer';
	const containerClass = 'rsg-react-component__renderer-container';

	const designClasses = classNames(containerClass);

	const codeClasses = classNames(containerClass);

	return sidebar ?
		<a href={`#!/${name}`} className={`${rendererClass} c-card c--link u-text-no-decoration u-padding-xl u-block u-neutral-70`}>
			<h3>
				{name}
			</h3>
		</a>
	:
		<div className={rendererClass}>
			<h1 id={name}>
				{name}
			</h1>
			<article className="u-margin-top-xl c-grid c--2up">
				{designMarkdown &&
					<div className={designClasses}>
						<h2 class="u-margin-top u-margin-bottom">Design</h2>
						{hasSlice &&
							<div>
								<h4 className="ReactStyleguidist-Markdown__h4 ReactStyleguidist-common__font">
									Exported Slice
								</h4>
								<img className="mb2" src={`${imagePath}${nameFallback}/assets/slice.png`} />
							</div>
						}
						{designMarkdown}
					</div>
				}
				{props &&
					<div className={codeClasses}>
						<h2 class="u-margin-top u-margin-bottom">Code</h2>
						{description}
						{props}
						{examples}
					</div>
				}
			</article>
		</div>;
};

ReactComponentRenderer.propTypes = {
	imagePath: PropTypes.string.isRequired,
	hasSlice: PropTypes.bool.isRequired,
	nameFallback: PropTypes.string.isRequired,
	designMarkdown: PropTypes.node,
	name: PropTypes.string.isRequired,
	pathLine: PropTypes.string.isRequired,
	description: PropTypes.node,
	props: PropTypes.node,
	examples: PropTypes.node,
	sidebar: PropTypes.bool,
};

export default ReactComponentRenderer;
