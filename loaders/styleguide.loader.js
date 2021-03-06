'use strict';

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const prettyjson = require('prettyjson');
const pick = require('lodash/pick');
const utils = require('./utils/js');
const requireIt = utils.requireIt;
const toCode = utils.toCode;

const DESIGN_CONTENT_NAME = 'DESIGN_README'
const SLICE_NAME = 'slice'

/* eslint-disable no-console */

function hasSlice(filepath, config) {
	const sliceFileName = config.getExampleFilename(filepath, `assets/${SLICE_NAME}.png`)
	const filename = path.parse(filepath).name;

	if (filename === 'index' || filename === DESIGN_CONTENT_NAME) {
		return fs.existsSync(sliceFileName);
	} else {
		return path.basename(path.dirname(filepath)) === filename && fs.existsSync(sliceFileName)
	}
}

/**
 * Return JS code as a string for a component with all required for style guide information.
 *
 * @param {string} filepath
 * @param {object} config
 * @returns {string}
 */
function processComponent(filepath, config) {
	const nameFallback = getNameFallback(filepath);
	const componentPath = path.relative(config.configDir, filepath);
	const designMarkdownFileName = config.getExampleFilename(filepath, `${DESIGN_CONTENT_NAME}.md`)
	const sliceFileName = config.getExampleFilename(filepath, 'slice.png')

	// You need to stringify these - otherwise you'll get a compilation error!
	const code = {
		imagePath: JSON.stringify(config.imagePath),
		hasSlice: hasSlice(filepath, config),
		filepath: JSON.stringify(filepath),
		nameFallback: JSON.stringify(nameFallback),
		pathLine: JSON.stringify(config.getComponentPathLine(componentPath)),
		designMarkdown: getExamples(designMarkdownFileName, nameFallback, config.defaultExample, config.imagePath)
	};

	if (path.basename(filepath) !== `${DESIGN_CONTENT_NAME}.md`) {
		const examplesFileName = config.getExampleFilename(filepath);

		code.examples = getExamples(examplesFileName, nameFallback, config.defaultExample, config.imagePath);
		code.module = requireIt(filepath);
		code.props = requireIt('!!props!' + filepath);
	} else {
		// Later on in the application, we'll deconstruct this property and accessing
		// an undefined property will explode - so let's give it an empty object
		code.props = JSON.stringify({})
	}

	return toCode(code);
}

/**
 * If component name can’t be detected at runtime, use filename (or folder name if file name is 'index')
 *
 * @param {string} filepath
 * @returns {string}
 */
function getNameFallback(filepath) {
	const filename = path.parse(filepath).name;
	return (filename === 'index' || filename === DESIGN_CONTENT_NAME) ? path.basename(path.dirname(filepath)) : filename;
}

/**
 * Get require statement for examples file if it exists, or for default examples if it was defined.
 *
 * @param {string} examplesFile
 * @param {string} nameFallback
 * @param {string} defaultExample
 * @returns {string}
 */
function getExamples(examplesFile, nameFallback, defaultExample, imagePath) {
	if (fs.existsSync(examplesFile)) {
		return requireIt('examples?imagePath=' + imagePath + '!' + examplesFile);
	}

	if (defaultExample) {
		return requireIt('examples?imagePath=' + imagePath + '&componentName=' + nameFallback + '!' + defaultExample);
	}

	return null;
}

/**
 * Return JS code as a string for given components.
 *
 * @param {string|Function} components Function or glob pattern.
 * @param {object} config
 * @returns {string}
 */
function processComponentsSource(components, config) {
	if (!components) {
		return null;
	}

	let componentFiles;
	if (typeof components === 'function') {
		componentFiles = components();
	}
	else {
		componentFiles = glob.sync(path.resolve(config.configDir, components));
	}
	componentFiles = componentFiles.map(file => path.resolve(config.configDir, file));

	if (config.verbose) {
		console.log();
		console.log('Loading components:');
		console.log(prettyjson.render(componentFiles));
		console.log();
	}

	if (config.skipComponentsWithoutExample) {
		componentFiles = componentFiles.filter(filepath => fs.existsSync(config.getExampleFilename(filepath)));
	}

	return toCode(componentFiles.map(filepath => processComponent(filepath, config)));
}

/**
 * Return JS code as a string for a given section with all components and subsections.
 * @param {object} section
 * @param {string} config
 * @returns {string}
 */
function processSection(section, config) {
	return toCode({
		name: JSON.stringify(section.name),
		content: (section.content ? requireIt('examples!' + path.resolve(config.configDir, section.content)) : null),
		components: processComponentsSource(section.components, config),
		sections: processSectionsList(section.sections, config),
	});
}

/**
 * Return JS code as a string for one level of sections.
 *
 * @param {Array} sections
 * @param {object} config
 * @returns {string}
 */
function processSectionsList(sections, config) {
	if (!sections) {
		return null;
	}

	return toCode(sections.map(section => processSection(section, config)));
}

module.exports = function() {};
module.exports.pitch = function() {
	if (this.cacheable) {
		this.cacheable();
	}

	const config = this.options.styleguidist;

	const simplifiedConfig = pick(config, [
		'title',
		'highlightTheme',
		'showCode',
	]);

	const code = toCode({
		config: JSON.stringify(simplifiedConfig),
		components: processComponentsSource(config.components, config),
		sections: processSectionsList(config.sections, config),
	});
	return `module.exports = ${code};`;
};
