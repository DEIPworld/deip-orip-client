<template>
    <div class="content-column">
        <div class="filling">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Contentbar'
    }
</script>

<style lang="less" scoped>
    .content-column {
        height: 100%;
        flex: 1 1 0;
        
        .filling {
            padding: 40px;
            height: 100%;
            max-width: 1180px;
            margin: 0 auto;
        }
    }
</style>
