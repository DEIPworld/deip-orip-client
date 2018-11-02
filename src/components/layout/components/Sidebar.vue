<template>
    <v-card height="100%" class="sidebar" :class="[{'small': isSmall}]">
        <slot></slot>
    </v-card>
</template>
<script>
    export default {
        name: 'Sidebar',
        props: {
            small: { required: false, default: false },
        },
        computed: {
            isSmall() {
                return this.small !== false;
            }
        }
    }
</script>

<style lang="less">
    .sidebar {
        width: 300px;
        padding: 40px 24px;
    }

    .sidebar.small {
        width: 50px;
        padding: 0px;
    }

    .sidebar-fullwidth {
        margin: 0 -24px;
    }
</style>
