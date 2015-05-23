# CEHighlighter.js

CEHighlighter.js is a lightweight javascript library that enables simple syntax highlighting in HTML elements and turn them into content editable.

By defaults it highlights links, twitter mentions and hashtags. It is possible to extend the syntax highlighting with your own regular expressions and templates.

Note: this library doesn't come with any style out of the box

## Usage

```js
var el = document.querySelector('div');
var highlighter = new CEHighlighter(el);
```

## Configuration

CEHighlighter.js accepts as a second optional argument an `option` object

```js
// defaults
{
	className: 'cehighlighter',
    regexs: [
        { pattern: /(^|\s)(#[a-z\d-]+)/gi, template: '$1<span class="hashtag">$2</span>' },
        { pattern: /((https?):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?)/gi, template: '<span class="url">$1</span>' },
        { pattern: /(@([a-z\d_]+))/gi, template: '<span class="mention">$1</span>' }
    ]
}
```

## API

```js
var el = document.querySelector('div');
var highlighter = new CEHighlighter(el);
/**
 * returns an object
 * {
 *   start: 1,
 *   end: 1
 * }
 */
highlighter.getCaretPosition();
highlighter.setCaretPosition(0);
highlighter.getLength();
highlighter.destroy();
```

## MIT License

See LICENSE file
