<template>
    <v-card height="100%" class="sidebar">
        <slot></slot>
    </v-card>
</template>

<script>
    export default {
        name: 'Sidebar'
    }
</script>

<style lang="less">
    .sidebar {
        width: 300px;
        padding: 40px 24px;
    }
    
    .sidebar-fullwidth {
        margin: 0 -24px;
    }
</style>
