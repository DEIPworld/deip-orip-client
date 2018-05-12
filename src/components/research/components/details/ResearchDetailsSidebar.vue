<template>
    <div>
        <div class="sm-title bold">Research Group</div>
            <div v-if="" class="row-nowrap justify-between align-center c-pt-4" v-for="(member, index) in membersList">
            <div>
                <v-avatar size="40px">
                    <v-gravatar :email="member.owner + '@deip.world'" />
                </v-avatar> 
                <router-link to="/userDetails" class="a c-pl-3">{{member.owner}}</router-link>
            </div>
            <div class="grey--text"> {{convertToPercent(member.amount)}}%</div>
        </div>

        <div v-if="canJoinResearchGroup"  class="c-pt-4 c-pb-6">
            <v-btn @click="joinResearchGroup()" outline icon color="primary" class="ma-0">
                <v-icon small>add</v-icon>
            </v-btn>
            <span class="deip-blue-color c-pl-3">Join research group</span>
        </div>

        <div style="margin: 0 -24px">
            <v-divider></v-divider>
            <div class="row-nowrap">
                <div class="col-6 c-pv-6 display-flex" v-ripple>
                    <div class="clickable-label text-align-center c-m-auto">123<br>Folowers</div>
                </div>
                <div class="vertical-devider"></div>
                <div class="col-6 c-pv-6 display-flex" v-ripple>
                    <div class="clickable-label text-align-center c-m-auto">Follow</div>
                </div>
            </div>
            <v-divider></v-divider>
        </div>

        <div class="sm-title bold c-pt-6">Votes: 1034</div>

        <div class="c-pb-6 c-pt-4">
            <div v-for="(discipline, index) in disciplinesList" class="row align-center justify-between vote-btn-area" :class="index == 0 ? '':'c-mt-1'">
           <!--     <v-btn small color="primary" dark class="ma-0">Vote</v-btn> -->
                <div class="deip-blue-color c-p-2">
                    {{discipline.name}}:  
                    {{researchWeightByDiscipline[discipline.id] != null ? researchWeightByDiscipline[discipline.id] : 0}}
                </div>
            </div>
        </div>

        <div style="margin: 0 -24px">
            <v-divider></v-divider>
        </div>

        <div class="sm-title bold c-pt-6">Reviews</div>

        <div class="c-pt-4 c-pb-6">
            <v-btn dark round outline color="primary" class="full-width ma-0" @click.native="$emit('showReviewDialog');">
                <v-icon small>add</v-icon>
                <div class="col-grow add-review-label">
                    Add a review
                    <span class="caption grey--text">
                        reward {{convertToPercent(research.review_share_in_percent)}}%
                    </span>
                </div>
            </v-btn>
        </div>

        <div style="margin: 0 -24px">
            <v-divider></v-divider>
        </div>

        <div class="sm-title bold c-pt-6">Citations: 10</div>
        <div class="sm-title bold c-pb-6">References: 2</div>

        <div style="margin: 0 -24px">
            <v-divider></v-divider>
        </div>

        <div class="sm-title bold c-pt-6">Research Info</div>
        
        <div class="c-pt-4 c-pb-6">
            <div>
                <span class="half-bold">Review reward</span>
                <span class="deip-blue-color right">{{convertToPercent(research.review_share_in_percent)}}%</span>
            </div>
            <div>
                <span class="half-bold">Total views</span>
                <span class="deip-blue-color right">222</span>
            </div>
        </div>

        <!-- <div style="margin: 0 -24px">
            <v-divider></v-divider>
        </div>

        <div class="sm-title bold c-pt-6">Total Earned</div>
        
        <div class="c-pt-4 c-pb-6">
            <div>
                <span class="half-bold">DEIP tokens</span>
                <span class="right">12345</span>
            </div>
            <div>
                <span class="half-bold">Physcis</span>
                <span class="right">23432</span>
            </div>
            <div>
                <span class="half-bold">Quantum physics</span>
                <span class="right">333</span>
            </div>
            <div>
                <span class="half-bold">Quantum optics</span>
                <span class="right">5234</span>
            </div>
        </div> -->

        <div style="margin: 0 -24px">
            <v-divider></v-divider>
        </div>

        <div class="sm-title bold c-pt-6">Research token holders</div>
        
        <div class="c-pt-4 c-pb-6">
            <div>
                <span class="half-bold">Research group</span>
                <span class="deip-blue-color right">80%</span>
            </div>
            <div>
                <span class="half-bold">Investor1</span>
                <span class="deip-blue-color right">15%</span>
            </div>
            <div>
                <span class="half-bold">Investor2</span>
                <span class="deip-blue-color right">5%</span>
            </div>
        </div>

        <div style="margin: 0 -24px">
            <v-divider></v-divider>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ResearchDetailsSidebar",
        props: {
            research: { required: true, type: Object, default: null },
            membersList: { required: true, type: Array, default: [] },
            disciplinesList: { required: true, type: Array, default: [] },
            totalVotesList: { required: true, type: Array, default: [] }
        },
        data() {
            return {
                user: { name: 'alice', postingWif: '5JGoCjh27sfuCzp7kQme5yMipaQtgdVLPiZPr9zaCwJVrSrbGYx' },
                canJoinResearchGroup: true
            };
        },
        computed: {
            researchWeightByDiscipline: function() {
                var map = {};
                for (var i = 0; i < this.totalVotesList.length; i++) {
                    const tvoByContent = this.totalVotesList[i];
                    for (var j = 0; j < tvoByContent.length; j++) {
                        const tvo = tvoByContent[j];
                        const discipline_id = tvo.discipline_id.toString();
                        const total_research_reward_weight = tvo.total_research_reward_weight;

                        if(map[discipline_id] === undefined)
                            map[discipline_id] = total_research_reward_weight;
                        else
                            map[discipline_id] += total_research_reward_weight;
                    }
                }
                return map;
            }
        },
        methods: {
            joinResearchGroup : function(){
                // deipRpc.broadcast.createResearchGroupJoinRequestAsync(
				// 	this.user.postingWif,
				// 	this.user.name,
				// 	this.research.research_group_id, 
				// 	"I wanna trulala",
				// 	new Date( new Date().getTime() + 2 * 24 * 60 * 60 * 1000 )
				// ).then((data) => {
                //     debugger;
                //     alert(data);
                // }, (err) => {
                //     alert(err.message);
                // });            
            },
        }
    };
</script>

<style lang="less" scoped>
    .vertical-devider {
        background-color: rgba(0,0,0,0.12);
        width: 1px;
        margin: 12px 0;
    }
    .vote-btn-area {
        border: 1px solid #2F80ED;
        border-radius: 3px;
    }
    .add-review-label {
        text-transform: none;
    }
</style>
