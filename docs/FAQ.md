# FAQ

## How to use `ref`s in examples?

Use `ref` prop as a function and assign a reference to a local variable:

```javascript
initialState = { value: '' };
let textarea;
<div>
  <Button onClick={() => textarea.insertAtCursor('Pizza')}>Insert</Button>
  <Textarea value={state.value} onChange={e => setState({ value: e.target.value })} ref={ref => textarea = ref} />
</div>
```

## How to exclude some components from style guide?

Filter them out in the `components` option:

```javascript
components: function() {
  return glob.sync(path.resolve(__dirname, 'lib/components/**/*.js')).filter(function(module) {
    return !/\/(foo|bar).js$/.test(module);  // Ignore foo.js and bar.js
  });
},
```

## How to hide some components in style guide but make them available in examples?

Enable [skipComponentsWithoutExample](Configuration.md) option and do not add example file (`Readme.md` by default) to components you want to ignore.

Require these components in your examples:

```javascript
const Button = require('../common/Button');
<Button>Push Me Tender</Button>
```

## How to add babel-polyfill?

Add a new Webpack entry point. In your style guide config:

```javascript
var path = require('path');
module.exports = {
  updateWebpackConfig: function(webpackConfig, env) {
    // Babel loader, etc.
    webpackConfig.entry.unshift('babel-polyfill');
    return webpackConfig;
  },
};
```

## How to add custom JS and CSS?

Add a new Webpack entry point. In your style guide config:

```javascript
var path = require('path');
module.exports = {
  // ...
  updateWebpackConfig: function(webpackConfig, env) {
    webpackConfig.entry.push(path.join(__dirname, 'path/to/script.js'));
    webpackConfig.entry.push(path.join(__dirname, 'path/to/styles.css'));
    return webpackConfig;
  },
};
```

You may need an appropriate Webpack loader to handle these files.

## How to change styles of a style guide?

Add a new Webpack entry point in your style guide config:

```javascript
var path = require('path');
module.exports = {
  // ...
  updateWebpackConfig: function(webpackConfig, env) {
    webpackConfig.entry.push(path.join(__dirname, 'lib/styleguide/styles.css'));
    return webpackConfig;
  },
};
```

Now you can change almost any piece of a style guide. For example you can change a font and a background color:

```css
.ReactStyleguidist-common__font {
  font-family: "Comic Sans MS", "Comic Sans", cursive;
}
.ReactStyleguidist-colors__base-bg {
  background: hotpink;
}
```

Use your browser’s developer tools to find CSS class names of the elements you want to change.

## How to change the behaviour of a style guide?

You can replace any Styleguidist React component. In your style guide config:

```javascript
var path = require('path');
module.exports = {
  // ...
  updateWebpackConfig: function(webpackConfig, env) {
    webpackConfig.resolve.alias['rsg-components/StyleGuide'] = path.join(__dirname, 'lib/styleguide/StyleGuide');
    return webpackConfig;
  },
};
```

There are two special wrapper components. They do nothing by themselves and were made specifically to be replaced with a custom logic:

* `StyleGuide` — the root component of a style guide React app.
* `Wrapper` — wraps every example component.

For example you can replace the `Wrapper` component to wrap any example in the [React Intl’s](http://formatjs.io/react/) provider component. You can’t wrap the whole style guide because every example is compiled separately in a browser.

```javascript
// styleguide.config.js
var path = require('path');
module.exports = {
  // ...
  updateWebpackConfig: function(webpackConfig, env) {
    webpackConfig.resolve.alias['rsg-components/Wrapper'] = path.join(__dirname, 'lib/styleguide/Wrapper');
    return webpackConfig;
  },
};

// lib/styleguide/Wrapper.js
import React, { Component } from 'react';
import { IntlProvider } from 'react-intl';
export default class Wrapper extends Component {
  render() {
    return (
      <IntlProvider locale="en">
        {this.props.children}
      </IntlProvider>
    );
  }
}
```

You can replace the `StyleGuide` component like this:

```javascript
import React, { Component } from 'react';
import Layout from 'react-styleguidist/src/rsg-components/Layout';
import Renderer from 'react-styleguidist/src/rsg-components/Layout/Renderer';

export default class StyleGuide extends Component {
  componentDidMount() {
    /*_*/
  }

  render() {
    const LayoutRenderer = Layout(Renderer);
    return (
      <LayoutRenderer {...this.props} />
    );
  }
}
```

## How to debug my components and examples?

1. Open your browser’s developer tools
2. Write `debugger;` statement wherever you want: in a component source, a Markdown example or even in an editor in a browser.

![](http://wow.sapegin.me/image/002N2q01470J/debugging.png)

## How to debug the exceptions thrown from my components?

1. Put `debugger;` statement at the beginning of your code.
2. Press the ![Debugger](http://wow.sapegin.me/image/2n2z0b0l320m/debugger.png) button in your browser’s developer tools.
3. Press the ![Continue](http://wow.sapegin.me/image/2d2z1Y2o1z1m/continue.png) button and the debugger will stop execution at the next exception.

## How to change style guide dev server logs output?
You can modify webpack dev server logs format passing `webpack.stats` options inside `updateWebpackConfig`.
```javascript
module.exports = {
  // ...
  updateWebpackConfig: function(webpackConfig, env) {
    if (env === 'development') {
      webpackConfig.stats.chunks = false;
      webpackConfig.stats.chunkModules = false;
      webpackConfig.stats.chunkOrigins = false;
    }
    return webpackConfig;
  }
};
```

## Why does the style guide list one of my prop types as `unknown`?

This occurs when you are assigning props via `getDefaultProps` that are not listed within the components `propTypes`.

For example, the color prop here is assigned via `getDefaultProps` but missing from the `propTypes`, therefore the style guide is unable to display the correct prop type.

```javascript
Button.propTypes = {
  children: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'normal', 'large']),
};

Button.defaultProps = {
  color: '#333',
  size: 'normal',
};
```

## Are there any other projects like this?

* [React Styleguide Generator](https://github.com/pocotan001/react-styleguide-generator), a React style guide generator.
* [heatpack](https://github.com/insin/react-heatpack), a quick to setup hot-reloaded development server for React components.
* [Demobox](https://github.com/jaredly/demobox), a component for making component showcases for landing pages.
* [React-demo](https://github.com/rpominov/react-demo), a component for creating demos of other components with props editor.
* [Atellier](https://github.com/scup/atellier), a React components emulator.
* [Cosmos](https://github.com/skidding/cosmos), a tool for designing truly encapsulated React components.
* [React Storybook](https://github.com/kadirahq/react-storybook), isolate your React UI Component development from the main app.
* [React Cards](https://github.com/steos/reactcards), devcards for React.
* [SourceJS](https://github.com/sourcejs/Source), a platform to unify all your frontend documentation. It has a [Styleguidist plugin](https://github.com/sourcejs/sourcejs-react-styleguidist).
