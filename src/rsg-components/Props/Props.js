import React, { Component, PropTypes } from 'react';
import trim from 'lodash/trim';
import Markdown from 'rsg-components/Markdown';

import s from './Props.css';

/* eslint-disable react/prop-types */

export let Code = ({ className = '', children }) => {
	return <code>{children}</code>;
};

export function unquote(string) {
	return trim(string, '"\'');
}

export default class Props extends Component {
	static propTypes = {
		props: PropTypes.object.isRequired,
	};

	renderRows(props) {
		let rows = [];
		for (let name in props) {
			let prop = props[name];
			rows.push(
				<div class="code-item {name}" style="display: block; padding: 10px 15px; border-bottom: 1px solid #ccc; margin: 5px 10px;">

					<div class="code-item-heading code-item-name" style="padding: 5px 0px;">
                        <div class="code-item-label" style="font-size: 9px; color: #ddd; line-height: 1.2;">Name</div>
                        <div class="code-item-value">{name}</div>
                    </div>

                    <div class="code-item-heading code-item-type">
                        <div class="code-item-label" style="font-size: 9px; color: #ddd; line-height: 1.2;">Type</div>
                        <div class="code-item-value">{this.renderType(getType(prop))}</div>
                    </div>

                    <div class="code-item-heading code-item-default">
                        <div class="code-item-label" style="font-size: 9px; color: #ddd; line-height: 1.2;">Default</div>
                        <div class="code-item-value">{this.renderDefault(prop)}</div>
                    </div>


                    <div class="code-item-heading code-item-description">
                        <div class="code-item-value">{this.renderDescription(prop)}}</div>
                    </div>
				</div>
			);
	    }

		return rows;
	}

	renderType(type) {
		if (!type) {
			return 'unknown';
		}

		let { name } = type;

		switch (name) {
			case 'arrayOf':
				return `${type.value.name}[]`;
			case 'instanceOf':
				return type.value;
			default:
				return name;
		}
	}

	renderDefault(prop) {
		if (prop.required) {
			return (
				<span>Required</span>
			);
		}
		else if (prop.defaultValue) {
			return (
				<Code>{unquote(prop.defaultValue.value)}</Code>
			);
		}
		return '';
	}

	renderDescription(prop) {
		let { description } = prop;
		let extra = this.renderExtra(prop);
		return (
			<div>
				{description && <Markdown text={description} inline />}
				{description && extra && ' '}
				{extra}
			</div>
		);
	}

	renderExtra(prop) {
		const type = getType(prop);

		if (!type) {
			return null;
		}

		switch (type.name) {
			case 'enum':
				return this.renderEnum(prop);
			case 'union':
				return this.renderUnion(prop);
			case 'shape':
				return this.renderShape(prop.type.value);
			case 'arrayOf':
				if (type.value.name === 'shape') {
					return this.renderShape(prop.type.value.value);
				}
				return null;
			default:
				return null;
		}
	}

	renderEnum(prop) {
		if (!Array.isArray(getType(prop).value)) {
			return <span>{getType(prop).value}</span>;
		}
		let values = getType(prop).value.map(({ value }) => (
			<li key={value}>
				<Code>{unquote(value)}</Code>
			</li>
		));
		return (
			<span>One of: <ul>{values}</ul></span>
		);
	}

	renderUnion(prop) {
		if (!Array.isArray(getType(prop).value)) {
			return <span>{getType(prop).value}</span>;
		}
		let values = getType(prop).value.map((value, index) => (
			<li key={value.name + index}>
				<Code>{this.renderType(value)}</Code>
			</li>
		));

		return (
			<span>One of type: <ul>{values}</ul></span>
		);
	}

	renderShape(props) {
		let rows = [];
		for (let name in props) {
			let prop = props[name];
			let defaultValue = this.renderDefault(prop);
			let description = prop.description;
			rows.push(
				<div key={name}>
					<Code>{name}</Code>{': '}
					<Code>{this.renderType(prop)}</Code>
					{defaultValue && ' — '}{defaultValue}
					{description && ' — '}
					{description && <Markdown text={description} inline />}
				</div>
			);
		}
		return rows;
	}

	renderTable(props) {
		return (
			<div class="code-docs-stuff"
					{this.renderRows(props)}
			</div>
		);
	}

	render() {
		return (
			<div className="rsg-props">
				<h3>Props</h3>
				{this.renderTable(this.props.props.props)}
			</div>
		);
	}
}

function getType(prop) {
	return prop.flowType || prop.type;
}
