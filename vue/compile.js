/*
 * @Date: 2020-07-12 23:26:23
 * @LastEditors: wj
 * @Description:
 */
class Compile {
    constructor(el, vm) {
        this.$el = document.querySelector(el);
        this.$vm = vm;
        if (this.$el) {
            this.$fragment = this.node2fragment(this.$el);
            this.compileElement(this.$fragment);
            this.$el.appendChild(this.$fragment)
        }
    }
    node2fragment (node) {
        console.log('%c 🥔 node: ', 'font-size:20px;background-color: #E41A6A;color:#fff;', node);
        let fragment = document.createDocumentFragment();
        let child = null;
        while (child = node.firstChild) {
            fragment.appendChild(child);
        }

        return fragment;

    }

    compileElement (fragment) {
        let childNodes = fragment.childNodes;
        console.log('%c 🍵 childNodes: ', 'font-size:20px;background-color: #ED9EC7;color:#fff;', childNodes);
        Array.from(childNodes).forEach(node => {
            let textReg = /\{\{(.*)\}\}/
            if (this.isElementNode(node)) {
                console.log('%c 🌶 Elenode: ', 'font-size:20px;background-color: #F5CE50;color:#fff;', node.attributes);
                this.compile(node)
            } else if (this.isTextNode(node) && textReg.test(node.textContent)) {
                console.log('%c 🍐 Textnode: ', 'font-size:20px;background-color: #93C0A4;color:#fff;', node);
                this.compileText(node, RegExp.$1);
            }
            if (node.childNodes && node.childNodes.length) {
                this.compileElement(node)
            }
        })

    }
    isElementNode (node) {
        return node.nodeType === 1;
    }
    isTextNode (node) {
        return node.nodeType === 3;
    }
    isDirective (name) {
        return name.indexOf('m-') === 0;
    }
    isEvent (name) {
        return name.indexOf('@') === 0;
    }
    compile (node) {
        let attrs = node.attributes;
        Array.from(attrs).forEach(attr => {
            console.log('%c 🍑 attr: ', 'font-size:20px;background-color: #FCA650;color:#fff;', attr.name, attr.value);
            let attrName = attr.name;
            let key = attr.value;
            if (this.isDirective(attrName)) {
                console.log('%c 🥜 attrName: ', 'font-size:20px;background-color: #3F7CFF;color:#fff;', attrName);
                let dir = attrName.substr(2);
                console.log('%c 🍓 dir: ', 'font-size:20px;background-color: #ED9EC7;color:#fff;', dir);
                this[dir] && this[dir](node, this.$vm, key);
            }
            if (this.isEvent(attrName)) {
                let dir = attrName.substr(1);
                // this[dir] && this[dir](key);
                this.eventHandler(node, this.$vm, key, dir)
            }

        })
    }
    compileText (node, key) {
        this.text(node, this.$vm, key)
    }
    eventHandler (node, vm, funName, dir) {
        let fn = vm.$options.methods && vm.$options.methods[funName]
        node.addEventListener(dir, fn.bind(vm), false)
    }
    text (node, vm, key) {
        this.update(node, vm, key, 'text')
    }
    html (node, vm, key) {
        this.update(node, vm, key, 'html')

    }
    model (node, vm, key) {
        this.update(node, vm, key, 'model')
        node.addEventListener('input', function (e) {
            let newValue = e.target.value
            vm[key] = newValue;
        })
    }
    update (node, vm, key, type) {
        let fun = this[`${type}Uploader`];
        fun && fun(node, vm[key])

        new Watcher(vm, key, function () {
            fun && fun(node, vm[key])
        })
    }

    textUploader (node, val) {
        console.log('%c 🌶 val: ', 'font-size:20px;background-color: #7F2B82;color:#fff;', val);
        node.textContent = val
    }
    htmlUploader (node, val) {
        node.innerHTML = val;
    }
    modelUpdater (node, value) {
        node.value = value
    }
}