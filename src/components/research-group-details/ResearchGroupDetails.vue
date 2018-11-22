<template>
    <page-container>

        <contentbar>
            <research-group-details-body></research-group-details-body>
        </contentbar>

        <sidebar>
            <research-group-details-sidebar></research-group-details-sidebar>
        </sidebar>

    </page-container>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "ResearchGroupDetails",

        computed: {
        },

        data() { 
            return {} 
        },

        created() {
        }
    };
</script>

<style lang="less" scoped>
</style>
