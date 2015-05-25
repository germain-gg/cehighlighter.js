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

	var el, ce, params;
	beforeEach(function() {

		el = document.createElement('div');
		document.body.appendChild(el);
		ce = new CEHighlighter(el);

		var evt = document.createEvent('Event');
		evt.initEvent("input", true, true);

		params = {
			e: evt,
			callback: function() {
				console.log('called');
			}
		}
		spyOn(params, 'callback');
		jasmine.clock().install();
	});

	afterEach(function() {
		ce.destroy();
		document.body.removeChild(el);
		el = null;
		ce = null;
		params = null;
		jasmine.clock().uninstall();
	});

	it('test binding `change` event', function() {
		ce.on('change', params.callback);
        el.dispatchEvent(params.e);
        jasmine.clock().tick(0);
	    expect(params.callback).toHaveBeenCalled();
	});

	it('test unbinding `change` event', function() {
		ce.on('change', params.callback);
		ce.unbind('change');
        el.dispatchEvent(params.e);
        jasmine.clock().tick(0);
	    expect(params.callback).not.toHaveBeenCalled();
	});
});


describe('getCaretPosition() suite', function() {

	var el, ce;
	beforeEach(function() {
		el = document.createElement('div');
		el.innerHTML = "Hello <span>World</span>! How <span>are</span> you today?";
		document.body.appendChild(el);
		ce = new CEHighlighter(el);
	});

	afterEach(function() {
		ce.destroy();
		document.body.removeChild(el);
		el = null;
		ce = null;
	});

	it('collapsed selection', function() {

        var range = document.createRange();
        range.setStart(el.childNodes[1].firstChild, 1);
        range.collapse(true);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

		var position = ce.getCaretPosition();

		expect(position.start).toEqual(7);
		expect(position.end).toEqual(7);
	});

	it('selection across multiple node', function() {

        var range = document.createRange();
        range.collapse(false);
        range.setStart(el.childNodes[1].firstChild, 1);
        range.setEnd(el.childNodes[3].firstChild, 2);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

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
	});

	afterEach(function() {
		ce.destroy();
		document.body.removeChild(el);
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

	it('set index to be 7', function() {

		ce.setCaretPosition(7);

		var sel = window.getSelection();

		expect(sel.isCollapsed).toEqual(true);
		expect(sel.anchorNode).toEqual(el.childNodes[1].firstChild);
		expect(sel.anchorOffset).toEqual(1);
	});

});
