<template>
    <page-container>
        <contentbar>
            <research-details-body></research-details-body>
        </contentbar>

        <sidebar>
            <research-details-sidebar>
            </research-details-sidebar>
        </sidebar>
    </page-container>
</template>

<script>

    import deipRpc from '@deip/deip-rpc-client';
    import { mapGetters } from 'vuex'

    export default {
        name: "ResearchDetails",
        data() { 
            return {
            }
        },
        computed: {
            ...mapGetters({
                research: 'rd/research',
                contentList: 'rd/contentList',
                reviewsList: 'rd/reviewsList',
                disciplinesList: 'rd/disciplinesList',
                totalVotesList: 'rd/totalVotesList'
            })
        },
        created() {
            const permlinks = {
                group_permlink: this.$route.params.research_group_permlink,
                research_permlink: this.$route.params.research_permlink
            }
            this.$store.dispatch('rd/loadResearchDetails', permlinks);
        }
    };
</script>

<style lang="less" scoped>
</style>
