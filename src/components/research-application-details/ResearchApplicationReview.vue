<template>
    <page-container>
        <contentbar>
            <research-application-review-body></research-application-review-body>
        </contentbar>
        <sidebar>
            <research-application-review-sidebar></research-application-review-sidebar>
        </sidebar>
    </page-container>
</template>

<script>
    import { mapGetters } from 'vuex'
    import deipRpc from '@deip/deip-rpc-client'

    export default {
        name: "ResearchApplicationReview",
        data() { 
            return {} 
        },
        computed: {

        },
        methods: {

        },
        created() {
        }
    };
</script>

<style lang="less" scoped>
</style>