<template>
    <page-container>
        <contentbar>
            <research-content-review-body></research-content-review-body>
        </contentbar>
        
        <sidebar>
            <research-content-review-sidebar></research-content-review-sidebar>
        </sidebar>
    </page-container>
</template>

<script>
    import { mapGetters } from 'vuex'
    import deipRpc from '@deip/deip-rpc-client'

    export default {
        name: "ResearchContentReview",
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