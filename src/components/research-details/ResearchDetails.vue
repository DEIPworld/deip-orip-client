<template>
    <v-container fluid fill-height class="pa-0 column-page">

        <div class="content-column">
            <div class="filling">
                <research-details-body></research-details-body>
            </div>
        </div>

        <v-card height="100%" class="sidebar">
            <research-details-sidebar @showReviewDialog="showReviewDialog">
            </research-details-sidebar>
        </v-card>

        <add-research-review-dialog 
            :is-shown="isReviewDialogShown"
            @onReviewAdded="reloadReviews">
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
        methods: {
            showReviewDialog() {
                this.isReviewDialogShown.value = true;
            },
            reloadReviews() {
                const researchId = this.$route.params.research_id;
                this.$store.dispatch('rd/loadResearchReviews', researchId);
            }
        },
        created() {
            const researchId = this.$route.params.research_id;
            this.$store.dispatch('rd/loadResearchDetails', researchId);
            this.$store.dispatch('rd/loadAllResearchContent', researchId);
            this.$store.dispatch('rd/loadResearchReviews', researchId);
            this.$store.dispatch('rd/loadResearchDisciplinesList', researchId);
        }
    };
</script>

<style lang="less" scoped>
</style>
