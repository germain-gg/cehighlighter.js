/**
 *
 * ContentEditableHighlighter v0.0.1
 * Syntax highlighting for content editable, by Germain Souquet.
 * http://github.com/gsouquet
 *
 * Free to use under the MIT License.
 *
 */

(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define(factory);
    } else if ( typeof exports === 'object' ) {
        module.exports = factory;
    } else {
        root.CEHighlighter = factory(root);
    }
})(this, function (root) {

    'use strict';

    var supports = !!document.querySelector && !!root.addEventListener;

    var utils = {};

    /**
     * Merge defaults with user options
     * @private
     * @param {Object} defaults Default settings
     * @param {Object} options User options
     * @returns {Object} Merged values of defaults and options
     */
    utils.extend = function ( defaults, options ) {
        for ( var key in options ) {
            if (Object.prototype.hasOwnProperty.call(options, key)) {
                defaults[key] = options[key];
            }
        }
        return defaults;
    };

    /**
     * Gives the caret offset within the page
     * @private
     * @param {Object} node
     * @returns {Object} pos
     */
    utils.getCaretOffsetWithin = function(node) {

        var treeWalker = utils.createTreeWalker(node);
        var sel = window.getSelection();

        var pos = { start: 0, end: 0 };

        var isBeyondStart = false;

        while(treeWalker.nextNode()) {

            // anchorNode is where the selection starts
            if (!isBeyondStart && treeWalker.currentNode === sel.anchorNode ) {

                isBeyondStart = true;

                // sel object gives pos within the current html element only
                // the tree walker reached that node
                // and the `Selection` obj contains the caret offset in that el
                pos.start += sel.anchorOffset;

                if (sel.isCollapsed) {
                    pos.end = pos.start;
                    break;
                }
            } else if (!isBeyondStart) {

                // The node we are looking for is after
                // therefore let's sum the full length of that el
                pos.start += treeWalker.currentNode.length;
            }

            // FocusNode is where the selection stops
            if (!sel.isCollapsed && treeWalker.currentNode === sel.focusNode) {

                // sel object gives pos within the current html element only
                // the tree walker reached that node
                // and the `Selection` obj contains the caret offset in that el
                pos.end += sel.focusOffset;
                break;
            } else if (!sel.isCollapsed) {

                // The node we are looking for is after
                // therefore let's sum the full length of that el
                pos.end += treeWalker.currentNode.length;
            }
        }

        return pos;
    };

    /**
     * Set the caret position within the given node at the specific index
     * @private
     * @param {Object} node
     * @param {number} index
     * @returns {undefined}
     */
    utils.setCaretPositionWithin = function(node, index) {

        var treeWalker = utils.createTreeWalker(node);
        var currentPos = 0;

        while(treeWalker.nextNode()) {

            // while we don't reach the node that contains
            // our index we increment `currentPos`
            currentPos += treeWalker.currentNode.length;

            if (currentPos >= index) {

                // offset is relative to the current html element
                // We get the value before reaching the node that goes
                // over the thresold and then calculate the offset
                // within the current node.
                var prevValue = currentPos - treeWalker.currentNode.length;
                var offset = index - prevValue;

                // create a new range that will set the caret
                // at the good position
                var range = document.createRange();
                range.setStart(treeWalker.currentNode, offset);
                range.collapse(true);

                // Update the selection to reflect the range
                // change on the UI
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);

                break;
            }
        }
    };

    /**
     * Creates a treewalker for all the text node within the given node
     * @private
     * @param {Object} node
     * @returns {object} treeWalker
     */
    utils.createTreeWalker = function(node) {
        return document.createTreeWalker(
            node, // Root of the tree walker
            NodeFilter.SHOW_TEXT, // Filter TextNode only
            { acceptNode: function(node) { return NodeFilter.FILTER_ACCEPT; } },
            false
        );
    };

    /**
     * Escapes html special chars
     * @private
     * @param {string} unsafeText
     * @returns {string} safeText
     */
    utils.escapeHTML = function(unsafeText) {
        return unsafeText
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    /**
     * Will go through all the
     * @private
     * @param {Object} node
     * @returns {object} treeWalker
     */
    utils.highlight = function(node) {
        var text = utils.escapeHTML(node.innerText);
        settings.regexs.forEach(function(reg) {
            text = text.replace(reg.pattern, reg.template);
        });
        node.innerHTML = text;
    };

    /**************************
     * Plugin private methods *
     **************************/

    var settings = {
        className: 'cehighlighter',
        regexs: [
            { pattern: /(^|\s)(#[a-z\d-]+)/gi, template: '$1<span class="hashtag">$2</span>' },
            { pattern: /((https?):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?)/gi, template: '<span class="url">$1</span>' },
            { pattern: /(@([a-z\d_]+))/gi, template: '<span class="mention">$1</span>' }
        ]
    };

    /**
     * Remove syntax from highlighted pasted content
     * @private
     * @param {String} event
     * @returns {undefined}
     */
    var onPaste = function(e) {

    	// Reliable method to get the clipboard data cross browsers
    	if (e.clipboardData && e.clipboardData.getData) {
    		var paste = e.clipboardData.getData('text/plain');
    	} else if (window.clipboardData && window.clipboardData.getData) {
    		var paste = window.clipboardData.getData('Text');
    	} else {
	    	var paste = false;
    	}

        if (paste) {
        	// We insert the pasted text in a fake input
        	// This removes all the syntax highlighting
        	var input = document.createElement('input');
        	input.value = paste;

        	var pos = utils.getCaretOffsetWithin(this.el);
        	var html = this.el.innerText;

        	// Let's insert the text in the DOM
        	this.el.innerHTML = html.substring(0, pos.start) + input.value + html.substr(pos.end);

        	var newCaretPosition = pos.start + input.value.length;
            utils.highlight(this.el);
            utils.setCaretPositionWithin(this.el, newCaretPosition);
        }

        e.preventDefault();
    };

    var onInput = function (e) {
    	// Defer till the event is processed
    	var _this = this;
    	setTimeout(function() {
            var charPos = utils.getCaretOffsetWithin(_this.el);
            // Perform all the syntax highlighting
            utils.highlight(_this.el);
    		// Set the caret back at its original position
    		utils.setCaretPositionWithin(_this.el, charPos.start);
    	}, 0);
    };

    /**
     * Plugin
     */

    var CEHighlighter = function(el, options) {

        if (!supports) {
            throw new Error('CEHighlighter does not support that browser');
        }

        utils.extend(settings, options);

    	this.el = el;
        this.el.setAttribute('contenteditable', 'true');
        this.el.classList.add(settings.className);

        this.el.addEventListener('paste', onPaste.bind(this));
		this.el.addEventListener('input', onInput.bind(this));
    	return this;
    };

    CEHighlighter.prototype.getCaretPosition = function() {
    	return utils.getCaretOffsetWithin(this.el);
    };

    CEHighlighter.prototype.setCaretPosition = function (index) {
        utils.setCaretPositionWithin(this.el, index);
    };

    CEHighlighter.prototype.getLength = function () {
        return this.el.innerText.length;
    };

    CEHighlighter.prototype.destroy = function() {
        this.el.removeAttribute('contenteditable');
        this.e.className.remove(settings.className);
    	this.el.removeEventListener('paste', onPaste.bind(this));
		this.el.removeEventListener('input', onInput.bind(this));
    };

    return CEHighlighter;

});
