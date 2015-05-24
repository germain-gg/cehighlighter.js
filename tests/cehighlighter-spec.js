describe('plugin instanciation suite', function() {

	var el, ce, _sel;
	beforeEach(function() {
		el = document.createElement('div');
		el.innerHTML = "Hello <span>World</span>! How <span>are</span> you today?";
		document.body.appendChild(el);
	});

	afterEach(function() {
		document.body.removeChild(el);
		el = null;
	});

	it('element param', function() {
		expect(function() {
			new CEHighlighter('1337');
		}).toThrow();
		expect(function() {
			new CEHighlighter(el);
		}).not.toThrow();
	});

	it('options param', function() {
		expect(function() {
			new CEHighlighter(el, null);
		}).toThrow();
		expect(function() {
			new CEHighlighter(el, { test: 'test' });
		}).not.toThrow();
	});

});

describe('getLength() suite', function() {

	var el;
	beforeEach(function() {
		el = document.createElement('div');
		document.body.appendChild(el);
	});
	afterEach(function() {
		document.body.removeChild(el);
		el = null;
	});

	it('no content', function() {
		var ce = new CEHighlighter(el);
		expect(ce.getLength()).toEqual(0);
	});

	it('containing plain text', function() {
		el.innerHTML = 'Hello World!';
		var ce = new CEHighlighter(el);
		expect(ce.getLength()).toEqual(12);
	});

	it('containing plain text html element', function() {
		el.innerHTML = 'Hello <span>World</span>!';
		var ce = new CEHighlighter(el);
		expect(ce.getLength()).toEqual(12);
	});

});

describe('on() / unbind() suite', function() {

	var el = document.createElement('div');
	document.body.appendChild(el);
	var ce = new CEHighlighter(el);
	var params;
	beforeEach(function() {
		params = {
			evt: new Event('input', {
				bubbles: true, cancelBubble: false, cancelable: false,
				eventPhase: 0, defaultPrevented: false,
				currentTarget: null, returnValue: true,
				srcElement: el, target: el,
				timestamp: (new Date()).getTime(), type: 'input',
				path: [el, document.body, document.documentElement, document, window]
			}),
			callback: function() {
				console.log('called');
			}
		}
		spyOn(params, 'callback');
		jasmine.clock().install();
	});

	afterEach(function() {
		jasmine.clock().uninstall();
	});

	it('test binding `change` event', function() {
		ce.on('change', params.callback);
        el.dispatchEvent(params.evt);
        jasmine.clock().tick(0);
	    expect(params.callback).toHaveBeenCalled();
	});

	it('test unbinding `change` event', function() {
		ce.on('change', params.callback);
		ce.unbind('change');
        el.dispatchEvent(params.evt);
        jasmine.clock().tick(0);
	    expect(params.callback).not.toHaveBeenCalled();
	});
});


describe('getCaretPosition() suite', function() {

	var el, ce, _sel;
	beforeEach(function() {
		el = document.createElement('div');
		el.innerHTML = "Hello <span>World</span>! How <span>are</span> you today?";
		document.body.appendChild(el);
		ce = new CEHighlighter(el);

		_sel = window.getSelection;
	});

	afterEach(function() {
		ce.destroy();
		document.body.removeChild(el);
		window.getSelection = _sel;
	});

	it('collapsed selection', function() {

		window.getSelection = function() {
			return {
				anchorNode: el.childNodes[1].firstChild,
				anchorOffset: 1,
				focusNode: el.childNodes[1].firstChild,
				focusOffset: 1,
				isCollapsed: true,
				rangeCount: 1,
				type: 'Caret'
			};
		};

		var position = ce.getCaretPosition();

		expect(position.start).toEqual(7);
		expect(position.end).toEqual(7);
	});

	it('selection across multiple node', function() {

		window.getSelection = function() {
			return {
				anchorNode: el.childNodes[1].firstChild,
				anchorOffset: 1,
				focusNode: el.childNodes[3].firstChild,
				focusOffset: 2,
				isCollapsed: false,
				rangeCount: 1,
				type: 'Caret'
			};
		};

		var position = ce.getCaretPosition();

		expect(position.start).toEqual(7);
		expect(position.end).toEqual(19);
	});

});

describe('setCaretPosition() suite', function() {

	var el, ce, _sel;
	beforeEach(function() {
		el = document.createElement('div');
		el.innerHTML = "Hello <span>World</span>! How <span>are</span> you today?";
		document.body.appendChild(el);
		ce = new CEHighlighter(el);

		_sel = window.getSelection;
	});

	afterEach(function() {
		ce.destroy();
		document.body.removeChild(el);
		window.getSelection = _sel;
	});

	it('invalid arguments', function() {
		expect(function() {
			ce.setCaretPosition(undefined);
		}).toThrow();
		expect(function() {
			ce.setCaretPosition(-1);
		}).toThrow();
		expect(function() {
			ce.setCaretPosition('1');
		}).toThrow();
		expect(function() {
			ce.setCaretPosition(5);
		}).not.toThrow();
	});

	/**
	 * Work in progress here
	 */

});
