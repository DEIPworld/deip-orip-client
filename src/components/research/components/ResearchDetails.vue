<template>
    <v-container fluid fill-height class="pa-0 two-column-page">

        <div class="content-column">
            <div class="filling">
                <research-details-body 
                    :content-list="contentList" 
                    :research="research" 
                    :members-list="membersList"
                    :disciplines-list="disciplinesList"
                    :total-votes-list="totalVotesList"
                ></research-details-body>
            </div>
        </div>

        <v-card height="100%" class="sidebar">
            <research-details-sidebar 
                :research="research" 
                :members-list="membersList"
                :disciplines-list="disciplinesList"
                :total-votes-list="totalVotesList"
                @showReviewDialog="showReviewDialog"
            ></research-details-sidebar>
        </v-card>

        <adding-research-review-dialog 
            :is-shown="isReviewDialogShown"
            :research="research"
        ></adding-research-review-dialog>
    </v-container>   
</template>

<script>
    export default {
        name: "ResearchDetails",
        data() { 
            return {
                research: {},
                contentList: [],
                membersList: [],
                disciplinesList: [],
                totalVotesList: [],

                isReviewDialogShown: { value: false }
            }
        },
        methods: {
            showReviewDialog() {
                this.isReviewDialogShown.value = true;
            }
        },
        created() {

            const researchId = this.$route.params.research_id;

            deipRpc.api.getAllResearchContentAsync(researchId)
                .then((data) => {
                    for (var i = 0; i < data.length; i++) {
                        var contnet = data[i];
                        this.contentList.push(contnet);
                    }
                });

            deipRpc.api.getResearchByIdAsync(researchId)
                .then((data) => {
                    this.research = data;
                    return deipRpc.api.getResearchGroupTokensByResearchGroupAsync(this.research.research_group_id)
                })
                .then((data) => {
                    for (var i = 0; i < data.length; i++) {
                        var rgt = data[i];
                        this.membersList.push(rgt);
                    }
                });

            deipRpc.api.getDisciplinesByResearchAsync(researchId)
                .then((data) => {
                    var promises = [];
                    for (var i = 0; i < data.length; i++) {
                        var discipline = data[i];
                        this.disciplinesList.push(discipline);
                        promises.push(deipRpc.api.getTotalVotesByResearchAndDisciplineAsync(researchId, discipline.id))
                    }
                    return Promise.all(promises);
                })
                .then((data) => {
                    this.totalVotesList = data;
                    console.log(data);
                });
        }
        
    };
</script>

<style lang="less" scoped>
</style>
