class Compile {
    constructor(el, vm) {
        this.$vm = vm
        this.$el = document.querySelector(el)
        if (this.$el) {
            this.$fragment = this.node2Fragment(this.$el)
            this.compileElement(this.$fragment)
            this.$el.appendChild(this.$fragment)
        }
    }
    node2Fragment (el) {
        // 新建文档碎片 dom接口
        let fragment = document.createDocumentFragment()
        let child
        // 将原生节点拷贝到fragment
        while (child = el.firstChild) {
            fragment.appendChild(child)
        }
        return fragment
    }
    compileElement (el) {
        let childNodes = el.childNodes
        // console.log('%c 🥃 childNodes: ', 'font-size:20px;background-color: #2EAFB0;color:#fff;', childNodes, Array.from(childNodes));

        Array.from(childNodes).forEach((node) => {
            let text = node.textContent
            console.log('%c 🍔 text: ', 'font-size:20px;background-color: #465975;color:#fff;', node, text);
            // 表达式文本
            // 就是识别{{}}中的数据
            let reg = /\{\{(.*)\}\}/
            // 按元素节点方式编译
            if (this.isElementNode(node)) {
                this.compile(node)
            } else if (this.isTextNode(node) && reg.test(text)) {
                // 文本 并且有{{}}
                this.compileText(node, RegExp.$1)

            }
            // 遍历编译子节点
            if (node.childNodes && node.childNodes.length) {
                this.compileElement(node)
            }
        })
    }

    compile (node) {
        let nodeAttrs = node.attributes
        Array.from(nodeAttrs).forEach((attr) => {
            // 规定：指令以 v-xxx 命名
            // 如 <span v-text="content"></span> 中指令为 v-text
            let attrName = attr.name	// v-text
            let exp = attr.value // content
            if (this.isDirective(attrName)) {
                let dir = attrName.substring(2)	// text
                // 普通指令
                this[dir] && this[dir](node, this.$vm, exp)
            }
            if (this.isEventDirective(attrName)) {
                let dir = attrName.substring(1)	// text
                this.eventHandler(node, this.$vm, exp, dir)

            }
        })
    }
    compileText (node, exp) {
        this.text(node, this.$vm, exp)
    }

    isDirective (attr) {
        return attr.indexOf('m-') == 0
    }

    isEventDirective (dir) {
        return dir.indexOf('@') === 0
    }

    isElementNode (node) {
        return node.nodeType == 1
    }

    isTextNode (node) {
        return node.nodeType == 3
    }
    text (node, vm, exp) {
        this.update(node, vm, exp, 'text')
    }

    html (node, vm, exp) {
        this.update(node, vm, exp, 'html')
    }

    model (node, vm, exp) {
        this.update(node, vm, exp, 'model')
        let val = vm.exp
        node.addEventListener('input', (e) => {
            let newValue = e.target.value
            vm[exp] = newValue
            val = newValue
        })
    }

    update (node, vm, exp, dir) {
        let updaterFn = this[dir + 'Updater']
        updaterFn && updaterFn(node, vm[exp])
        new Watcher(vm, exp, function (value) {
            updaterFn && updaterFn(node, value)
        })
    }

    // 事件处理
    eventHandler (node, vm, exp, dir) {
        let fn = vm.$options.methods && vm.$options.methods[exp]
        if (dir && fn) {
            node.addEventListener(dir, fn.bind(vm), false)
        }
    }
    textUpdater (node, value) {
        node.textContent = value
    }

    htmlUpdater (node, value) {
        node.innerHTML = value
    }

    modelUpdater (node, value) {
        node.value = value
    }
}


