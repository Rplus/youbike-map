
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? undefined : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next, lookup.has(block.key));
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error(`Cannot have duplicate keys in a keyed each`);
            }
            keys.add(key);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.22.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/App.svelte generated by Svelte v3.22.2 */

    const { Object: Object_1, console: console_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    // (116:2) {#each recentPoints as point (point.sno)}
    function create_each_block(key_1, ctx) {
    	let li;
    	let div2;
    	let div0;
    	let t0;
    	let t1_value = /*point*/ ctx[13].sbi + "";
    	let t1;
    	let t2;
    	let br0;
    	let t3;
    	let t4_value = /*point*/ ctx[13].bemp + "";
    	let t4;
    	let t5;
    	let hr;
    	let t6;
    	let small;
    	let t7;
    	let t8_value = /*point*/ ctx[13].tot + "";
    	let t8;
    	let t9;
    	let div1;
    	let t10_value = /*point*/ ctx[13].sna + "";
    	let t10;
    	let t11;
    	let br1;
    	let t12;
    	let t13_value = /*point*/ ctx[13].distance + "";
    	let t13;
    	let t14;
    	let br2;
    	let t15;
    	let br3;
    	let t16;
    	let details;
    	let a0;
    	let t17_value = /*point*/ ctx[13].lat + "";
    	let t17;
    	let t18;
    	let t19_value = /*point*/ ctx[13].lng + "";
    	let t19;
    	let a0_href_value;
    	let t20;
    	let a1;
    	let t21_value = /*point*/ ctx[13].img + "";
    	let t21;
    	let a1_href_value;
    	let t22;
    	let li_value_value;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			li = element("li");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text("車：");
    			t1 = text(t1_value);
    			t2 = space();
    			br0 = element("br");
    			t3 = text("\n          位：");
    			t4 = text(t4_value);
    			t5 = space();
    			hr = element("hr");
    			t6 = space();
    			small = element("small");
    			t7 = text("共：");
    			t8 = text(t8_value);
    			t9 = space();
    			div1 = element("div");
    			t10 = text(t10_value);
    			t11 = space();
    			br1 = element("br");
    			t12 = text("\n              ");
    			t13 = text(t13_value);
    			t14 = text(" m\n          ");
    			br2 = element("br");
    			t15 = space();
    			br3 = element("br");
    			t16 = space();
    			details = element("details");
    			a0 = element("a");
    			t17 = text(t17_value);
    			t18 = text(", ");
    			t19 = text(t19_value);
    			t20 = space();
    			a1 = element("a");
    			t21 = text(t21_value);
    			t22 = space();
    			add_location(br0, file, 120, 10, 3072);
    			add_location(hr, file, 122, 10, 3112);
    			add_location(small, file, 123, 10, 3127);
    			add_location(div0, file, 118, 8, 3032);
    			add_location(br1, file, 128, 10, 3236);
    			add_location(br2, file, 130, 10, 3304);
    			add_location(br3, file, 131, 10, 3319);
    			attr_dev(a0, "href", a0_href_value = "http://maps.google.com?q=" + /*point*/ ctx[13].lat + "," + /*point*/ ctx[13].lng);
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "title", "google map link");
    			add_location(a0, file, 133, 12, 3356);
    			attr_dev(a1, "class", "img svelte-ir73t2");
    			set_style(a1, "--url", "url(" + /*point*/ ctx[13].img + ")");
    			attr_dev(a1, "href", a1_href_value = /*point*/ ctx[13].img);
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file, 135, 12, 3509);
    			add_location(details, file, 132, 10, 3334);
    			attr_dev(div1, "class", "item-info svelte-ir73t2");
    			add_location(div1, file, 126, 8, 3180);
    			attr_dev(div2, "class", "d-f svelte-ir73t2");
    			add_location(div2, file, 117, 6, 3006);
    			attr_dev(li, "class", "item svelte-ir73t2");
    			li.value = li_value_value = /*point*/ ctx[13].sno;
    			add_location(li, file, 116, 4, 2964);
    			this.first = li;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, br0);
    			append_dev(div0, t3);
    			append_dev(div0, t4);
    			append_dev(div0, t5);
    			append_dev(div0, hr);
    			append_dev(div0, t6);
    			append_dev(div0, small);
    			append_dev(small, t7);
    			append_dev(small, t8);
    			append_dev(div2, t9);
    			append_dev(div2, div1);
    			append_dev(div1, t10);
    			append_dev(div1, t11);
    			append_dev(div1, br1);
    			append_dev(div1, t12);
    			append_dev(div1, t13);
    			append_dev(div1, t14);
    			append_dev(div1, br2);
    			append_dev(div1, t15);
    			append_dev(div1, br3);
    			append_dev(div1, t16);
    			append_dev(div1, details);
    			append_dev(details, a0);
    			append_dev(a0, t17);
    			append_dev(a0, t18);
    			append_dev(a0, t19);
    			append_dev(details, t20);
    			append_dev(details, a1);
    			append_dev(a1, t21);
    			append_dev(li, t22);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*recentPoints*/ 2 && t1_value !== (t1_value = /*point*/ ctx[13].sbi + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*recentPoints*/ 2 && t4_value !== (t4_value = /*point*/ ctx[13].bemp + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*recentPoints*/ 2 && t8_value !== (t8_value = /*point*/ ctx[13].tot + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*recentPoints*/ 2 && t10_value !== (t10_value = /*point*/ ctx[13].sna + "")) set_data_dev(t10, t10_value);
    			if (dirty & /*recentPoints*/ 2 && t13_value !== (t13_value = /*point*/ ctx[13].distance + "")) set_data_dev(t13, t13_value);
    			if (dirty & /*recentPoints*/ 2 && t17_value !== (t17_value = /*point*/ ctx[13].lat + "")) set_data_dev(t17, t17_value);
    			if (dirty & /*recentPoints*/ 2 && t19_value !== (t19_value = /*point*/ ctx[13].lng + "")) set_data_dev(t19, t19_value);

    			if (dirty & /*recentPoints*/ 2 && a0_href_value !== (a0_href_value = "http://maps.google.com?q=" + /*point*/ ctx[13].lat + "," + /*point*/ ctx[13].lng)) {
    				attr_dev(a0, "href", a0_href_value);
    			}

    			if (dirty & /*recentPoints*/ 2 && t21_value !== (t21_value = /*point*/ ctx[13].img + "")) set_data_dev(t21, t21_value);

    			if (dirty & /*recentPoints*/ 2) {
    				set_style(a1, "--url", "url(" + /*point*/ ctx[13].img + ")");
    			}

    			if (dirty & /*recentPoints*/ 2 && a1_href_value !== (a1_href_value = /*point*/ ctx[13].img)) {
    				attr_dev(a1, "href", a1_href_value);
    			}

    			if (dirty & /*recentPoints*/ 2 && li_value_value !== (li_value_value = /*point*/ ctx[13].sno)) {
    				prop_dev(li, "value", li_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(116:2) {#each recentPoints as point (point.sno)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let nav;
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let input;
    	let t4;
    	let span;
    	let t5;
    	let t6;
    	let t7;
    	let t8;
    	let ol;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let dispose;
    	let each_value = /*recentPoints*/ ctx[1];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*point*/ ctx[13].sno;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			button0 = element("button");
    			button0.textContent = "Locate";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Refetch";
    			t3 = space();
    			input = element("input");
    			t4 = space();
    			span = element("span");
    			t5 = text("Range: ");
    			t6 = text(/*range*/ ctx[0]);
    			t7 = text("m");
    			t8 = space();
    			ol = element("ol");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(button0, "id", "locate");
    			add_location(button0, file, 108, 2, 2666);
    			attr_dev(button1, "id", "refetch");
    			add_location(button1, file, 109, 2, 2725);
    			attr_dev(input, "type", "range");
    			attr_dev(input, "id", "range");
    			attr_dev(input, "max", "5000");
    			attr_dev(input, "min", "10");
    			add_location(input, file, 110, 2, 2786);
    			add_location(span, file, 111, 2, 2861);
    			attr_dev(nav, "class", "ctrl svelte-ir73t2");
    			add_location(nav, file, 107, 0, 2645);
    			attr_dev(ol, "class", "list svelte-ir73t2");
    			add_location(ol, file, 114, 0, 2898);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, button0);
    			append_dev(nav, t1);
    			append_dev(nav, button1);
    			append_dev(nav, t3);
    			append_dev(nav, input);
    			set_input_value(input, /*range*/ ctx[0]);
    			append_dev(nav, t4);
    			append_dev(nav, span);
    			append_dev(span, t5);
    			append_dev(span, t6);
    			append_dev(span, t7);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, ol, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ol, null);
    			}

    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(button0, "click", /*setLocate*/ ctx[2], false, false, false),
    				listen_dev(button1, "click", /*fetchData*/ ctx[3], false, false, false),
    				listen_dev(input, "change", /*input_change_input_handler*/ ctx[12]),
    				listen_dev(input, "input", /*input_change_input_handler*/ ctx[12])
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*range*/ 1) {
    				set_input_value(input, /*range*/ ctx[0]);
    			}

    			if (dirty & /*range*/ 1) set_data_dev(t6, /*range*/ ctx[0]);

    			if (dirty & /*recentPoints*/ 2) {
    				const each_value = /*recentPoints*/ ctx[1];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ol, destroy_block, create_each_block, null, get_each_context);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(ol);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const KEY = "AIzaSyCjDnDGv67nvhzBsLRYAwTbiF1HrZBQDUM";

    // https://en.wikipedia.org/wiki/Great-circle_distance
    // https://gist.github.com/thesadabc/f84adeea5644149539dae968ccdb3f2c
    function GreatCircleDistance(points) {
    	let [lng1, lat1, lng2, lat2] = points;
    	if (!lng1 || !lat1 || !lng2 || !lat2) return null;
    	[lng1, lat1, lng2, lat2] = points.map(n => n * Math.PI / 180);
    	const R = 6371000; // average earth radius(m)
    	const C = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lng1 - lng2) * Math.cos(lat1) * Math.cos(lat2);
    	return R * Math.acos(C);
    }

    function instance($$self, $$props, $$invalidate) {
    	let name = "world";
    	let range = 500;
    	let location = null;
    	let points = [];

    	const locateOption = {
    		enableHighAccuracy: true,
    		timeout: 5000,
    		maximumAge: 0
    	};

    	function getLocation() {
    		return new Promise((resolve, reject) => {
    				navigator.geolocation.getCurrentPosition(resolve, reject, locateOption);
    			});
    	}

    	

    	async function setLocate() {
    		let position = await getLocation();

    		$$invalidate(4, location = {
    			lat: position.coords.latitude,
    			lng: position.coords.longitude,
    			acc: position.coords.accuracy
    		});

    		console.log("setLocate", location);
    	}

    	async function fetchData() {
    		setLocate();
    		console.log("fetchData");
    		const res = await fetch("https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json").then(d => d.json());
    		console.log("fetchData done", res);
    		$$invalidate(5, points = Object.values(res.retVal));
    	}

    	

    	function getRecentPoints(points, range, location) {
    		console.log("getRecentPoints");

    		points = points.map(p => {
    			p.img = getImgSrc(p);
    			return p;
    		});

    		if (location) {
    			points = points.filter(p => {
    				const distance = GreatCircleDistance([location.lng, location.lat, p.lng, p.lat]);
    				p.distance = distance.toFixed();
    				return distance < range;
    			});
    		}

    		return points.sort((a, b) => a.distance - b.distance);
    	}

    	function getImgSrc(target, size = 300) {
    		let p0 = target;
    		let p1;

    		if (location) {
    			p0 = location;
    			p1 = target;
    		}

    		return "https://maps.googleapis.com/maps/api/staticmap" + `?size=${size}x${size}` + `&center=${p0.lat},${p0.lng}` + `&markers=size:mid|${p0.lat},${p0.lng}` + (p1
    		? `&markers=color:yellow|label:T|${p1.lat},${p1.lng}`
    		: "") + `&key=${KEY}`;
    	}

    	fetchData();
    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	function input_change_input_handler() {
    		range = to_number(this.value);
    		$$invalidate(0, range);
    	}

    	$$self.$capture_state = () => ({
    		name,
    		range,
    		location,
    		points,
    		KEY,
    		locateOption,
    		getLocation,
    		setLocate,
    		fetchData,
    		getRecentPoints,
    		GreatCircleDistance,
    		getImgSrc,
    		recentPoints,
    		currentPosMarker
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) name = $$props.name;
    		if ("range" in $$props) $$invalidate(0, range = $$props.range);
    		if ("location" in $$props) $$invalidate(4, location = $$props.location);
    		if ("points" in $$props) $$invalidate(5, points = $$props.points);
    		if ("recentPoints" in $$props) $$invalidate(1, recentPoints = $$props.recentPoints);
    		if ("currentPosMarker" in $$props) currentPosMarker = $$props.currentPosMarker;
    	};

    	let recentPoints;
    	let currentPosMarker;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*points, range, location*/ 49) {
    			 $$invalidate(1, recentPoints = getRecentPoints(points, range, location));
    		}

    		if ($$self.$$.dirty & /*location*/ 16) {
    			 currentPosMarker = location
    			? `&markers=${location.lat},${location.lng}`
    			: undefined;
    		}
    	};

    	return [
    		range,
    		recentPoints,
    		setLocate,
    		fetchData,
    		location,
    		points,
    		currentPosMarker,
    		name,
    		locateOption,
    		getLocation,
    		getRecentPoints,
    		getImgSrc,
    		input_change_input_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
