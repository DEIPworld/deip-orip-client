

<template>
    <div style="margin-left: 15%; margin-right: 15%">
        <div style="width: 100%">
            <v-progress-linear :height="5" indeterminate color="primary"></v-progress-linear>
        </div>
        <div style="width: 70%">
            <v-progress-linear :height="5" indeterminate color="primary"></v-progress-linear>
        </div>
        <div style="width: 100%">
            <v-progress-linear :height="5" indeterminate color="primary"></v-progress-linear>
        </div> 
    </div>
</template>

<script>
    export default {
        name: 'SidebarLoader',
        props: {

        },
        data() {
            return {}
        },
        methods: {

        }
    }
</script>

<style lang="less" scoped>
</style>
