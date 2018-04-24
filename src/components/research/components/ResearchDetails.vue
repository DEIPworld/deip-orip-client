<template>
    <v-container fluid fill-height class="pa-0 two-column-page">

        <div class="content-column">
            <div class="filling">
                <research-details-body :contentList="contentList" :research="research"></research-details-body>
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
                contentList: []
            } 
        },
        methods: {
            getResearchContent (){
                deipRpc.api.getAllResearchContentAsync(this.$route.params.research_id)
                    .then((data) => {
                        for (var i = 0; i < data.length; i++) {
                            var contnet = data[i];
                            this.contentList.push(contnet);
                        }
                })
            },
            getResearch (){
                deipRpc.api.getResearchByIdAsync(this.$route.params.research_id)
                    .then((data) => {
                        this.research = data;
                })
            }
        },
        created() {
            this.getResearch();
            this.getResearchContent();
        }
        
    };
</script>

<style lang="less" scoped>
</style>
