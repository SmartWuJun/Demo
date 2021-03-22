/*
 * @Date: 2021-03-23 06:27:36
 * @LastEditors: wj
 * @Description:
 */
//WeakMap  
//target  map
//        key       Set
//        key       [effect,effect]
//
//
//target
let targetMap = new WeakMap();
const effectStack = [];

function track (target, key) {
    const effect = effectStack[effectStack.length - 1];
    if (!effect) {
        return
    }
    let depMap = targetMap.get(target)
    if (depMap === undefined) {
        depMap = new Map();
        targetMap.set(target, depMap);
    }
    if (!targetMap.has(target)) {
        targetMap.set(target, key)
    }

    let dep = depMap.get(key);
    if (dep === undefined) {
        dep = new Set();
        depMap.set(key, dep);
    }
    //双向缓存
    if (!dep.has(effect)) {
        dep.add(effect);
        effect.deps.push(dep);
    }
}

function trigger (target, key, val) {
    let depMap = targetMap.get(target);
    if (depMap === undefined) {
        depMap = new Map();
        targetMap.set(target, depMap);
    }
    let deps = depMap.get(key);
    if (!deps) {
        deps = new Set();
        depMap.set(key, deps)
    }
    const computedEffects = new Set();
    const effects = new Set();
    deps.forEach(v => {
        if (v.computed) {
            computedEffects.add(v)
        } else {
            effects.add(v)
        }
    })

    computedEffects.forEach(effect => effect())
    effects.forEach(effect => effect())
}
const baseHandler = {
    get: function (target, key) {
        console.log('%c 🍞 key: ', 'font-size:20px;background-color: #B03734;color:#fff;', key);
        track(target, key)
        let res = Reflect.get(target, key);
        return typeof res === 'object' ? reactive(res) : res
    },
    set: function (target, key, value) {
        console.log('%c 🥦 value: ', 'font-size:20px;background-color: #4b4b4b;color:#fff;', value);
        // target[key] = value
        trigger(target, key, value);
        Reflect.set(target, key, value)
    }
}
function reactive (target) {

    return new Proxy(target, baseHandler)
}


function effect (fn, options = {}) {
    let e = createReactiveEffect(fn, options);
    if (!options.lazy) {
        e();
    }
    return e;
}

function createReactiveEffect (fn, options) {
    const effect = function (...args) {
        return run(effect, fn, args)
    }

    effect.deps = [];
    effect.computed = options.computed;
    effect.lazy = options.lazy;
    return effect;

}

function run (effect, fn, args) {
    if (effectStack.indexOf(effect) === -1) {
        try {
            effectStack.push(effect);
            fn(...args);
        } finally {
            effectStack.pop();
        }

    }
}
function computed (fn) {
    const runner = effect(fn, { computed: true, lazy: true });
    return {
        effect: runner,
        get value () {
            return runner()
        }
    }
}