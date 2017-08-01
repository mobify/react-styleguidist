import React, { PropTypes } from 'react';
import classNames from 'classnames';

const ReactComponentRenderer = ({ imagePath, hasSlice, nameFallback, designMarkdown, name, pathLine, description, props, examples, sidebar }) => {
	const isSingleColumn = !designMarkdown || !props;

	const rendererClass = 'rsg-react-component__renderer';
	const containerClass = 'rsg-react-component__renderer-container';

	const designClasses = classNames(containerClass, 'u-width-1of2', {
		u-margin-center: isSingleColumn,
	});

	const codeClasses = classNames(containerClass, 'u-width-1of2', {
		u-margin-center: isSingleColumn,
	});

	return sidebar ?
		<a href={`#!/${name}`} className={`${rendererClass} c-card c--link c--xlarge-space`}>
			<h3 className="c-card__heading c-heading c--h3">
				{name}
			</h3>
		</a>
	:
		<div className={rendererClass}>
			<h1 id={name}>
				{name}
			</h1>
			<article className="cf u-margin-top-xl u-flexbox u-flexbox-gutters">
				{designMarkdown &&
					<div className={designClasses}>
						<h2 className="u-margin-top u-margin-bottom">Design</h2>
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
						<h2 className="u-margin-top u-margin-bottom">Code</h2>
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
