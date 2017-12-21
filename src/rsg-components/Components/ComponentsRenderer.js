import React, { PropTypes } from 'react';
import classNames from 'classnames';

import Icon from 'rsg-components/Icon';

const renderSearchHeader = (searchTerm, onInputMount, onSearchTermChange, onSearchBlur) => {
	return (
		<div className="rsg-components__search-header">
			<div className="u-padding-top u-padding-bottom">
				<input
					ref={onInputMount}
					placeholder="What Are You Looking For?"
					onChange={onSearchTermChange}
					value={searchTerm}
					type="search"
					onBlur={onSearchBlur}
				/>
			</div>
		</div>
	);
};

const renderPlainHeader = () => {
	return (
		<div className="rsg-components__plain-header">
			<header className="c-contain">
				<a href="#" style={{ height: '44px', width: '44px' }}>
					<Icon glyph="close" />
				</a>
			</header>
		</div>
	);
};

const ComponentsRenderer = ({ isListPage, searchTerm, components, sections, onInputMount, onSearchTermChange, onSearchBlur }) => {
	const componentSectionClasses = classNames('rsg-components__component-section c-contain u-margin-top-xl');
	const classes = classNames('rsg-components', {
		'full-screen': !isListPage,
	});

	return (
		<div className={classes}>
			{isListPage ? renderSearchHeader(searchTerm, onInputMount, onSearchTermChange, onSearchBlur) : renderPlainHeader()}
			<div className={componentSectionClasses}>
				{components}
			</div>
			{sections}
		</div>
	);
};

ComponentsRenderer.propTypes = {
	components: PropTypes.array.isRequired,
	sections: PropTypes.node.isRequired,
	isListPage: PropTypes.bool.isRequired,
	onInputMount: PropTypes.func.isRequired,
	onSearchTermChange: PropTypes.func.isRequired,
	onSearchBlur: PropTypes.func.isRequired,
	searchTerm: PropTypes.string.isRequired,
};

export default ComponentsRenderer;
