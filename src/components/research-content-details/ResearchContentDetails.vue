<template>
    <v-container fluid fill-height class="pa-0" style="text-align: center;">
    
        <iframe v-if="content && content.research_id !== undefined && content.content !== undefined" id="iframe" name="iframe1" 
            frameborder="0" 
            height="100%" 
            width="100%" 
            :src="`${fileStorageBaseUrl}/public/files/research/${content.research_id}/${content.content}`">
        </iframe>

        <div id="bars">
            <div id="sidebar">
                <div class="c-pb-6 c-pt-4">
                    <div v-for="(discipline, index) in disciplinesList" class="row align-center justify-between vote-btn-area" :class="index == 0 ? '':'c-mt-1'">
                        <div class="deip-blue-color c-p-2">
                            {{discipline.name}}:  
                
                            {{contentWeightByDiscipline[content.id] !== undefined && 
                            contentWeightByDiscipline[content.id][discipline.id] !== undefined ?
                            contentWeightByDiscipline[content.id][discipline.id] : 0}}
                        </div>
                        <v-btn v-if="!isResearchGroupMember && userHasExpertise(discipline)" @click="openVote(discipline)" small color="primary" dark class="ma-0" >Vote</v-btn>
                    </div>
                </div>
            </div>
        </div>

    <v-dialog v-if="content" v-model="vote.isOpen" persistent transition="scale-transition" max-width="500px">
        <v-card class="">
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="cancelVote()">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>{{vote.weight}}% weight of "{{vote.discipline.name}}" expertise</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            
            <div class="column-page">
                <div class="content-column">
                    <div class="filling">
                        <div>
                            <v-slider v-model="vote.weight" :disabled="vote.isLoading" thumb-label step="5" ticks></v-slider>

                            <div class="display-flex c-pt-8">
                                <v-btn color="primary" 
                                    class="c-m-auto"
                                    :disabled="vote.weight == 0"
                                    :loading="vote.isLoading"
                                    @click="voteContent()"
                                >Vote</v-btn>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </v-card>
    </v-dialog>
    </v-container>
</template>

<script>
    import { mapGetters } from 'vuex'
    import deipRpc from '@deip/deip-rpc'
    import config from './../../config'

    export default {
        name: "ResearchContentDetails",
        data() { 
            return {
                fileStorageBaseUrl: config['deip-server-url'],
                vote: {
                    discipline: {},
                    weight: 50,
                    isLoading: false,
                    isOpen: false
                }
            } 
        },

        computed:{
            ...mapGetters({
                user: 'auth/user',
                userExperise: 'auth/userExperise',
                content: 'rcd/content',
                research: 'rcd/research',
                disciplinesList: 'rcd/disciplinesList',
                totalVotesList: 'rcd/totalVotesList',
                contentWeightByDiscipline: 'rcd/contentWeightByDiscipline'
            }),
            isResearchGroupMember(){
                return this.research != null 
                    ? this.$store.getters['auth/userIsResearchGroupMember'](this.research.research_group_id) 
                    : false
            }
        },
        
        methods: {
            userHasExpertise(discipline) {
                return this.userExperise != null && this.research != null
                    ? this.userExperise.some(exp => exp.discipline_id == discipline.id)
                    : false
            },
            openVote: function(discipline){
                this.vote.discipline = discipline;
                this.vote.isOpen = true;
            },
            cancelVote: function(){
                this.vote.isOpen = false;
            },
            voteContent: function() {
                this.vote.isLoading = true;
                deipRpc.broadcast.voteAsync(
                    this.user.privKey,
                    this.user.username,
                    this.vote.discipline.id,
                    this.vote.weight * this.DEIP_1_PERCENT,
                    this.content.research_id,
                    this.content.id
                ).then(() => {
                    this.vote.isLoading = false;
                    this.vote.isOpen = false;
                    this.$store.dispatch('rcd/loadResearchContentVotes', this.content.research_id);
                    this.$store.dispatch('layout/setSuccess', {
                        message: `You've voted for "${this.content.title}" successfully !`
                    });
                }, (err) => {
                    this.vote.isLoading = false;
                    this.vote.isOpen = false;
                    this.$store.dispatch('layout/setError', {
                        message: `An error occurred while voting for research content, please try again later`
                    });
                    console.log(err)
                });
            }
        },
        created() {
            const permlinks = {
                group_permlink: this.$route.params.research_group_permlink,
                research_permlink: this.$route.params.research_permlink,
                content_permlink: this.$route.params.content_permlink
            }

            this.$store.dispatch('rcd/loadResearchContentDetails', permlinks);
            this.$store.dispatch('rcd/loadResearchDetails', permlinks);
        }
    };
</script>

<style lang="less">

  /*  .sc-app {
        height: 100%;
    } */
   
iframe#iframe {
    width: 78%;
    height: 100%;
    overflow: hidden;
}

div#sidebar {
    top: 0;
    right: 0;
    margin-top: 5%;
    padding-left: 10px;
    padding-right: 10px;
    position: fixed !important;
    width: 22%;
    height: 100%;
}

.vote-btn-area {
    border: 1px solid #2F80ED;
    border-radius: 3px;
    padding-left: 3px;
    font-size: 13px;
}

.vote-dialog-body{
    min-height: 100px !important;
}

.loader {
    position: absolute;
    right: 45%;
    top: 45%;
}

</style>
