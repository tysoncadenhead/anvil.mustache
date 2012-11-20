## Anvil Mustache Plugin

This plugin allows you to build static html files from mustache templates.

Anvil.mustache requires [anvil.js](https://github.com/appendto/anvil.js) version 0.8.* or greater and [Mustache](https://github.com/janl/mustache.js) 0.7.0 or greater.

## Installation

anvil install anvil.mustache

## Usage

If this plugin is installed and enabled, by default all .html, .hb, .handelbars, .mustache and .md files will run mustache to compile from the  data in the build.json file.

### Passing data into the templates

All of the mustache templates will have the data from the anvil build.json file passed into them.  For example:

```{
	"anvil.mustache": {
		"data": {
			"hello": "Hello World!"
		}
	}
}
```

when paired with a template like this:

```<div class="my-div">{{hello}}</div>
```

would render this after an anvil build:

```<div class="my-div">Hello World</div>
```

### Rendering Partials

The magic of this plugin is that it can take external partial templates and render them to muliple templates. This is achieved using the standard mustache partial syntax in tandem with a little bit of configuration in the build.json file.

For example, with a build.json file like this:

```{
	"anvil.mustache": {
		"data": {
			"partials": {
				"header": "partials/header.html"
			},
			"dataForHeader": {
				"name": "My Awesome Header"
			}
		}
	}
}
```

and a partials/header.html file like this:

```<h1>{{name}}</h1>
```

and an index.html file like this:

```{{#dataForHeader}}
	{{> header}}
{{/dataForHeader}}
<h2>This is the index.html page!</h2>
```

The index.html page would be built to look like this:

```<h1>My Awesome Header</h1>
<h2>This is the index.html page!</h2>
```

Again, partials are standard Mustache partials, so everything in the partial is in the context it is introduced to.

### Supporting other filetypes

By default, anvil.mustache works for .html, .hb, .handelbars, .mustache and .md files.  You can also pass in an array of the file types you would like to be mustached in you project like this:

```{
	"anvil.mustache": {
		"formats": ["foo", "bar", "html"]
	}
}
```