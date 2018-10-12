<template>
    <div class="page-container">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'PageContainer'
    }
</script>

<style lang="less" scoped>
    .page-container {
        display: flex;
        flex: 1 1 100%;
        height: 100%;
        width: 100%;
        max-width: 100%;
    }
</style>
