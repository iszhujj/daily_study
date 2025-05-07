<template>
    <div>
        <h1>自定义指令</h1>
        <p v-mark v-for="e of 5" :key="e">自定义指令使用</p>
    </div>
</template>

<script setup>
/**
 * 一个自定义指令由一个包含类似组件生命周期钩子的对象来定义。钩子函数会接收到指令所绑定元素作为其参数。
 * https://cn.vuejs.org/guide/reusability/custom-directives.html#custom-directives
 */

const vMark = {
    mounted(el, binding) {
        el.innerHTML = `<mark>${el.innerHTML}</mark>`
    }
}
</script>

<style>

</style>