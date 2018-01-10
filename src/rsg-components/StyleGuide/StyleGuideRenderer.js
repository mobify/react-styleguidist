import React, { PropTypes } from 'react';

const StyleGuideRenderer = ({ components }) => (
	<div className="rsg-style-guide">
		{components}
	</div>
);

StyleGuideRenderer.propTypes = {
	components: PropTypes.object.isRequired,
};

export default StyleGuideRenderer;
