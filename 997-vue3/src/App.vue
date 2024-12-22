<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <div id="app">
        <RouterView />
    </div>
</template>

<style lang="scss"scoped>
#app {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
