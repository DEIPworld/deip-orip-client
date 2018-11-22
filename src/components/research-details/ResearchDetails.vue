<template>
    <page-container>
        <contentbar>
            <research-details-body></research-details-body>
        </contentbar>

        <sidebar>
            <research-details-sidebar></research-details-sidebar>
        </sidebar>
    </page-container>
</template>

<script>

    import deipRpc from '@deip/deip-rpc-client';
    import { mapGetters } from 'vuex'

    export default {
        name: "ResearchDetails",

        data() { 
            return {}
        },

        computed: {
        },

        created() {
        }
    };
</script>

<style lang="less" scoped>
</style>
