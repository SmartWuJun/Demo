/*
 * @Date: 2021-03-22 07:05:44
 * @LastEditors: wj
 * @Description:
 */

let obj = {
    'b': {
        name: 'zhangsna',
        age: 28,
        c: {
            'zhifubao': 10,
            'weixin': 23,
            d: {
                'aa': 11
            }
        }
    }
}

function reactive (target) {
    return new Proxy(target, {
        get: function (target, key) {
            console.log('%c 🍞 key: ', 'font-size:20px;background-color: #B03734;color:#fff;', key);
            let res = Reflect.get(target, key);
            return typeof target === 'object' ? reactive(res) : res
        },
        set: function (target, key, value) {
            console.log('%c 🥦 value: ', 'font-size:20px;background-color: #4b4b4b;color:#fff;', value);
            target[key] = value
        }
    })
}

let a = reactive(obj)


console.log(a.b.c.d)