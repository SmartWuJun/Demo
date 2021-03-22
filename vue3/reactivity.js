/*
 * @Date: 2021-03-23 06:22:52
 * @LastEditors: wj
 * @Description:
 */

const { reactive, effect, ref } = require('@vue/reactivity')

const obj = {
    count: 1
}
const count = ref(1);

const obj1 = reactive(obj);

effect(() => {
    console.log('%c 🍝 obj1.count: ', 'font-size:20px;background-color: #42b983;color:#fff;', count.value);
})

setInterval(() => {
    count.value++
}, 1000);