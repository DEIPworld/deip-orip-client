<template>
    <v-container fluid fill-height class="pa-0 column-page">
    
        <div class="content-column">
            <div v-if="isLoadingResearchContentPage === false">
                <research-content-details-file v-if="isFileContent"></research-content-details-file>
                <research-content-details-dar v-if="isDarContent" :contentRef="contentRef"></research-content-details-dar>
            </div>
        </div>

        <v-card height="100%" class="sidebar">
            <research-content-details-sidebar></research-content-details-sidebar>
        </v-card>

    </v-container>   
</template>

<script>
    import { mapGetters } from 'vuex'
    import deipRpc from '@deip/deip-rpc-client'

    export default {
        name: "ResearchContentDetails",
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
            },
            isFileContent() {
                return this.contentRef && this.contentRef.type === 'file';
            },
            isDarContent() {
                return this.contentRef && this.contentRef.type === 'dar';
            }
        },
        
        methods: {
            userHasExpertise(discipline) {
                return this.userExperise != null && this.research != null
                    ? this.userExperise.some(exp => exp.discipline_id == discipline.id)
                    : false
            }
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
