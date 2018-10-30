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
            const permlinks = {
                group_permlink: this.$route.params.research_group_permlink,
                research_permlink: this.$route.params.research_permlink,
                content_permlink: this.$route.params.content_permlink,
                ref: this.$route.query.ref
            }
            this.$store.dispatch('rcd/loadResearchContentDetails', permlinks);
        }
    };
</script>

<style lang="less" scoped>
</style>