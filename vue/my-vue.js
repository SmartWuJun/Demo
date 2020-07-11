/*
 * @Date: 2020-07-11 20:46:52
 * @LastEditors: wj
 * @Description: 
 */
class Dep {
    constructor() {
        this.deps = []
    }
    addDep (dep) {
        if (this.deps.indexOf(dep) === -1) {
            this.deps.push(dep);
        }
    }
    depend () {
        Dep.target.addDep(this)
    }
    notify () {
        this.deps.forEach(v => {
            v.update();
        })
    }

}
Dep.target = null;

class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm;
        this.cb = cb;
        this.key = key;
        this.value = this.get();
    }
    get () {
        Dep.target = this;
        let value = this.vm[this.key];
        return value;
    }
    update () {
        this.value = this.get();
        this.cb.call(this.vm, this.value)
    }
}



class MVue {
    constructor(options) {
        this.$data = options.data;
        this.$options = options;
        this.observer(this.$data);
        if (options.created) {
            options.created.call(this)
        }

        this.$compile = new Compile(options.el, this)

    }

    observer (data) {
        if (!data || typeof data != 'object') {
            return;
        }


        Object.keys(data).forEach(key => {
            this.proxyData(key);
            this.defineReactive(data, key, data[key]);
        })



    }
    proxyData (key) {
        Object.defineProperty(this, key, {
            configurable: false,
            enumerable: true,
            get () {
                return this.$data[key];
            },
            set (value) {
                this.$data[key] = value;
            }
        })
    }
    defineReactive (obj, key, val) {
        const dep = new Dep()
        Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,
            get () {
                Dep.target && dep.addDep(Dep.target);
                return val;
            },
            set (newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                dep.notify();

            }
        })
    }


}