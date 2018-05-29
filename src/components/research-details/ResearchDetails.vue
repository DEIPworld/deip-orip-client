<template>
    <v-container fluid fill-height class="pa-0 column-page">

        <div class="content-column">
            <div class="filling">
                <research-details-body></research-details-body>
            </div>
        </div>

        <v-card height="100%" class="sidebar">
            <research-details-sidebar>
            </research-details-sidebar>
        </v-card>

        <add-research-review-dialog>
        </add-research-review-dialog>
    </v-container>   
</template>

<script>

    import deipRpc from '@deip/deip-rpc';
    import { mapGetters } from 'vuex'

    export default {
        name: "ResearchDetails",
        data() { 
            return {
                isReviewDialogShown: { value: false }
            }
        },
        computed: {
            ...mapGetters({
                research: 'rd/research',
                membersList: 'rd/membersList',
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
