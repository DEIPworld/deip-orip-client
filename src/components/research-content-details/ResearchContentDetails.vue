<template>
    <v-container fluid fill-height class="pa-0" style="text-align: center;">
    
        <iframe v-if="content && content.research_id !== undefined && content.content !== undefined" id="iframe" name="iframe1" 
            frameborder="0" 
            height="100%" 
            width="100%" 
            :src="`${fileStorageBaseUrl}/public/files/${content.research_id}/${content.content}`">
        </iframe>

        <div id="bars">
            <div id="sidebar">
                <div class="c-pb-6 c-pt-4">
                    <div v-for="(discipline, index) in disciplinesList" class="row align-center justify-between vote-btn-area" :class="index == 0 ? '':'c-mt-1'">
                        <v-btn small color="primary" dark class="ma-0" @click="openVote(discipline)">Vote</v-btn>
                        <div class="deip-blue-color c-p-2">
                            {{discipline.name}}:  
                
                            {{contentWeightByDiscipline[content.id] !== undefined && 
                            contentWeightByDiscipline[content.id][discipline.id] !== undefined ?
                            contentWeightByDiscipline[content.id][discipline.id] : 0}}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <v-dialog v-if="content" v-model="vote.isOpen" persistent max-width="500px" class="text-align-center">
                <v-card>
                    <v-card-title>
                        <span class="text-align-center">Vote for&nbsp;
                        <span class="bold">"{{content.title}}"</span>&nbsp;using&nbsp;
                        <span class="bold">{{vote.weight}}% weight of&nbsp;"{{vote.discipline.name}}"</span>&nbsp;tokens</span>
                    </v-card-title>
          
                    <v-card-text class="vote-dialog-body">
                            <v-slider v-model="vote.weight" thumb-label step="5" ticks v-if="!vote.isInProgress" ></v-slider>
                            <div class="loader" v-if="vote.isInProgress">
                                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                            </div>
                    </v-card-text>

                    <v-card-actions class="text-xs-center">
                        <v-btn color="primary" flat @click.stop="cancelVote()">Cancel</v-btn>
                        <v-btn color="primary" flat :disabled="vote.weight == 0" @click.stop="voteContent()">Vote</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
    </v-container>
</template>

<script>
    import { mapGetters } from 'vuex'
    import deipRpc from '@deip/deip-rpc';
    import config from './../../config'

    export default {
        name: "ResearchContentDetails",
        data() { 
            return {
                fileStorageBaseUrl: config['deip-server-url'],
                vote: {
                    discipline: {},
                    weight: 50,
                    isInProgress: false,
                    isOpen: false
                }
            } 
        },

        computed:{
            ...mapGetters({
                user: 'user',
                content: 'rcd/content',
                disciplinesList: 'rcd/disciplinesList',
                totalVotesList: 'rcd/totalVotesList',
                contentWeightByDiscipline: 'rcd/contentWeightByDiscipline'
            })
        },
        
        methods: {
            openVote: function(discipline){
                this.vote.discipline = discipline;
                this.vote.isOpen = true;
            },
            cancelVote: function(){
                this.vote.isOpen = false;
            },
            voteContent: function() {
                this.vote.isInProgress = true;
                deipRpc.broadcast.voteAsync(
                    this.user.privKey,
                    this.user.username,
                    this.vote.discipline.id,
                    this.vote.weight * this.DEIP_1_PERCENT,
                    this.content.research_id,
                    this.content.id
                ).then(() => {
                    this.vote.isInProgress = false;
                    this.vote.isOpen = false;
                }, (err) => {
                    this.vote.isInProgress = false;
                    this.vote.isOpen = false;
                    alert(err.message);
                });
            }
        },
        created() {
            const researchId = this.$route.params.research_id;
            const contentId = this.$route.params.content_id;

            this.$store.dispatch('rcd/loadResearchContentDetails', contentId);
            this.$store.dispatch('rcd/loadResearchContentVotes', researchId);
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
