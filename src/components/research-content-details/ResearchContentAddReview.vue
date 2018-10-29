<template>
    <page-container>
        <contentbar>
            <research-content-add-review-body></research-content-add-review-body>
        </contentbar>
        <sidebar>
            <research-content-add-review-sidebar></research-content-add-review-sidebar>
        </sidebar>
    </page-container>  
</template>

<script>
    import { mapGetters } from 'vuex'
    import deipRpc from '@deip/deip-rpc-client'

    export default {
        name: "ResearchContentAddReview",
        data() { 
            return {} 
        },

        computed:{
            ...mapGetters({
                user: 'auth/user',
                userExperise: 'auth/userExperise',
                content: 'rcd/content',
                research: 'rcd/research',
                disciplinesList: 'rcd/disciplinesList',
                totalVotesList: 'rcd/totalVotesList',
                contentWeightByDiscipline: 'rcd/contentWeightByDiscipline',
                isLoadingResearchContentPage: 'rcd/isLoadingResearchContentPage',
                contentRef: 'rcd/contentRef'
            }),
            isResearchGroupMember() {
                return this.research != null 
                    ? this.$store.getters['auth/userIsResearchGroupMember'](this.research.research_group_id) 
                    : false
            }
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