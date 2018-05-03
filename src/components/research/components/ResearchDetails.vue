<template>
    <v-container fluid fill-height class="pa-0 two-column-page">

        <div class="content-column">
            <div class="filling">
                <research-details-body :contentList="contentList" 
                                       :research="research" 
                                       :membersList="membersList">
                </research-details-body>
            </div>
        </div>

        <v-card height="100%" class="sidebar">
            <research-details-sidebar></research-details-sidebar>
        </v-card>
    </v-container>   
</template>

<script>
    export default {
        name: "ResearchDetails",
        data() { 
            return {
                research: {},
                contentList: [],
                membersList: []
            } 
        },
        methods: {

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
        }
        
    };
</script>

<style lang="less" scoped>
</style>
