<template>
    <div>

        <router-link :to="`/${groupLink}/group-details`" style="text-decoration: none; color: black">
            <div class="sm-title bold">Research Group <span class="caption grey--text">(view)</span></div>
        </router-link>
        
        <div class="row-nowrap justify-between align-center c-pt-4" 
            v-for="(member, index) in membersList" :key="index">
            <div>
                <v-avatar size="40px">
                    <v-gravatar :title="member.owner" :email="member.owner + '@deip.world'" />
                </v-avatar> 
                <router-link :to="'/user-details/' + member.owner" class="a c-pl-3">{{member.owner}}</router-link>
            </div>
            <div class="grey--text"> {{convertToPercent(member.amount)}}%</div>
        </div>

        <div v-if="canJoinResearchGroup"  class="c-pt-4 c-pb-6">
            <v-btn @click="joinResearchGroup()" outline icon color="primary" class="ma-0">
                <v-icon small>add</v-icon>
            </v-btn>
            <span class="deip-blue-color c-pl-3">Join research group</span>
        </div>

        <div style="margin: 5px -24px">
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
            <div v-for="(discipline, index) in disciplinesList" :key="index"
                class="row align-center justify-between vote-btn-area" 
                :class="index == 0 ? '':'c-mt-1'"
            >
           <!--     <v-btn small color="primary" dark class="ma-0">Vote</v-btn> -->
                <div class="deip-blue-color c-p-2">
                    {{discipline.name}}:  
                    {{researchWeightByDiscipline[discipline.id] != null ? researchWeightByDiscipline[discipline.id] : 0}}
                </div>
            </div>
        </div>

        <div v-if="!isResearchGroupMember && userHasExpertise">
            <div style="margin: 0 -24px">
                <v-divider></v-divider>
            </div>

            <div class="sm-title bold c-pt-6">Reviews</div>

            <div v-if="research" class="c-pt-4 c-pb-6">
                <v-btn @click="openReviewDialog" dark round outline color="primary" class="full-width ma-0">
                    <v-icon small>add</v-icon>
                    <div class="col-grow add-review-label">
                        Add a review
                        <span class="caption grey--text">
                            reward {{convertToPercent(research.review_share_in_percent)}}%
                        </span>
                    </div>
                </v-btn>
            </div>
        </div>

        <div style="margin: 0 -24px">
            <v-divider></v-divider>
        </div>

        <div class="sm-title bold c-pt-6">Citations: 10</div>
        <div class="sm-title bold c-pb-6 c-mt-2">References: 2</div>

        <div style="margin: 0 -24px">
            <v-divider></v-divider>
        </div>

        <div class="sm-title bold c-pt-6">Research Info</div>
        
        <div v-if="research" class="c-pt-4 c-pb-6">
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

        <div class="sm-title bold c-pt-6">Research Token Holders</div>

        <div class="c-pt-4 c-pb-6">
            <div v-if="isFinishedTokenSale">
                <span class="half-bold">Research group</span>
                <span class="deip-blue-color right">
                    {{convertToPercent(DEIP_100_PERCENT - tokenHoldersList.reduce((share, holder) => {
                        return share + holder.amount;}, 0))}}%
                </span>
                <div v-for="holder in tokenHoldersList">
                    <span class="half-bold">{{holder.account_name}}</span>
                    <span class="deip-blue-color right">{{convertToPercent(holder.amount)}}%</span>
                </div>
            </div>
            <div v-if="!isFinishedTokenSale">
                <div>
                    <span class="half-bold">Research group</span>
                    <span class="deip-blue-color right">100%</span>
                </div>
            </div>
        </div>

        <div style="margin: 0 -24px">
            <v-divider></v-divider>
        </div>

        <div v-if="!tokenHoldersList.length">

        <div v-if="(tokenSale === null && isResearchGroupMember) || isActiveTokenSale" class="sm-title bold c-pt-6">Research Token Sale</div>

        <div v-if="tokenSale === null && isResearchGroupMember" class="c-pt-4 c-pb-6">
            <router-link v-if="research && isResearchGroupMember" :to="`/${research.group_permlink}/create-token-sale/${research.permlink}`"  style="text-decoration: none">
                <v-btn dark round outline color="primary" class="full-width c-mt-3 c-mb-3">
                    <div class="col-grow add-review-label">Propose Token Sale</div>
                </v-btn>
            </router-link>
        </div>

        <div v-if="isActiveTokenSale" class="c-pt-4 c-pb-6">
            <div>
                <span class="half-bold">On Sale</span>
                <span class="deip-blue-color right">{{convertToPercent(tokenSale.balance_tokens)}}%</span>
            </div>
            <div>
                <span class="half-bold">Deadline</span>
                <span class="deip-blue-color right">{{new Date(tokenSale.end_time).toDateString()}}</span>
            </div>
            <div>
                <span class="half-bold">Soft Cap</span>
                <span class="deip-blue-color right">{{tokenSale.soft_cap}}</span>
            </div>
            <div>
                <span class="half-bold">Hard Cap</span>
                <span class="deip-blue-color right">{{tokenSale.hard_cap}}</span>
            </div>
            <div class="c-mt-8">
                <div class="row">
                    <div><span class="left grey--text c-mr-2 cap-value">0</span></div>
                    <div class="col-grow pos-relative row-nowrap align-center">
                    <div class="chapter-line black" :style="{ width: currentCapPercent + '%' }"></div>
                    <div class="chapter-line grey lighten-1 col-grow"></div>

                    <div class="pos-absolute" :style="{ left: currentCapPercent + '%' }">
                        <v-tooltip bottom color="white">
                            <div class="chapter-point deip-blue-bg" slot="activator"></div>
                            <div>
                                <div class="grey--text cap-value text-align-center">{{currentCap}}</div>
                            </div>
                        </v-tooltip>
                    </div>

                    <div><span class="right grey--text c-ml-2 cap-value">{{tokenSale.hard_cap}}</span></div>
                </div>
            </div>
            <div v-if="!isResearchGroupMember" class="c-mt-5 text-align-center">
                <v-text-field 
                    suffix="DEIP" 
                    mask="########################" 
                    v-model="amountToContribute">
                </v-text-field>
                <v-btn :disabled="!amountToContribute" :loading="isTokensBuying" color="primary" @click="contributeToTokenSale()">BUY RESEARCH TOKENS</v-btn>
            </div>
        </div>

        </div>
    </div>

    <v-snackbar :timeout="5000" color="error" v-model="isError">
        {{errorMessage}}
        <v-btn dark flat @click.native="isError = false; errorMessage = '';">Close</v-btn>
    </v-snackbar>
    <v-snackbar :timeout="5000" color="success" v-model="isSuccess">
        {{successMessage}}
        <v-btn dark flat @click.native="isSuccess = false;">Close</v-btn>
    </v-snackbar>

    </div>
</template>

<script>
    import deipRpc from '@deip/deip-rpc';
    import { mapGetters } from 'vuex'

    export default {
        name: "ResearchDetailsSidebar",
        data(){
           return {
                amountToContribute: undefined,
                groupLink: this.$route.params.research_group_permlink,
                isError: false,
                isSuccess: false,
                isTokensBuying: false,
                successMessage: "",
                errorMessage: ""
           }
        },
        computed: {
            ...mapGetters({
                user: 'user',
                userGroups: 'userGroups',
                userExperise: 'userExperise',
                research: 'rd/research',
                membersList: 'rd/membersList',
                disciplinesList: 'rd/disciplinesList',
                totalVotesList: 'rd/totalVotesList',
                researchWeightByDiscipline: 'rd/researchWeightByDiscipline',
                tokenSale: 'rd/tokenSale',
                tokenHoldersList: 'rd/tokenHoldersList',
                contributionsList: 'rd/contributionsList'
            }),
            isResearchGroupMember(){
                return this.research != null 
                    ? this.$store.getters.userIsResearchGroupMember(this.research.research_group_id) 
                    : false
            },
            userHasExpertise() {
                return this.userExperise != null && this.research != null
                    ?  this.userExperise.some(exp => 
                            this.research.disciplines.some(d => d.id == exp.discipline_id))
                    : false
            },
            isActiveTokenSale() {
                return this.research && this.tokenSale && this.tokenSale.hard_cap != this.tokenSale.total_amount && this.tokenHoldersList.length == 0;
            },
            isFinishedTokenSale() {
                return this.research && this.tokenSale && this.tokenSale.hard_cap == this.tokenSale.total_amount && this.tokenHoldersList.length != 0;
            },
            currentCap() {
                return this.contributionsList.map(c => c.amount).reduce((acc, val) => {return acc + val}, 0);
            },
            currentCapPercent() {
                return this.tokenSale ? this.currentCap * 100 / this.tokenSale.hard_cap : 0;
            },
            canJoinResearchGroup : function(){
                return this.membersList.find(m => { return m.owner == this.user.username}) === undefined;
            }
        },
        methods: {
            openReviewDialog() {
                this.$store.dispatch('rd/openReviewDialog');
            },
            contributeToTokenSale() {
                this.isTokensBuying = true;
                deipRpc.broadcast.contributeToTokenSaleAsync(
				    this.user.privKey,
                    this.tokenSale.id,
                    this.user.username,
                    parseInt(this.amountToContribute)
                ).then((data) => {
                    this.$store.dispatch('rd/loadTokenSaleContributors');
                    this.$store.dispatch('rd/loadResearchTokenHolders', this.research.id);
                    this.isTokensBuying = false;
                    this.isSuccess = true;
                    this.successMessage = "Contribution made!"
                    this.amountToContribute = undefined;
                }, (err) => {
                    this.isTokensBuying = false;
                    this.isError = true;
                    this.errorMessage = err.message;
                })
            },

            joinResearchGroup : function(){
                deipRpc.broadcast.createResearchGroupJoinRequestAsync(
					this.user.privKey,
					this.user.username,
					this.research.research_group_id, 
					"I wanna trulala",
					new Date( new Date().getTime() + 2 * 24 * 60 * 60 * 1000 )
				).then((data) => {
                    alert(data);
                }, (err) => {
                    alert(err.message);
                });
            }
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
    .start-point {
        text-transform: uppercase;
    }
    .chapter-line {
        height: 2px;
    }
    .chapter-point {
        width: 16px;
        height: 16px;
        border-radius: 50%;

        &:hover {
            box-shadow: 0px 6px 6px -3px rgba(0,0,0,0.2), 
                        0px 10px 14px 1px rgba(0,0,0,0.14), 
                        0px 4px 18px 3px rgba(0,0,0,0.12);
        }
    }

    .cap-value {
        font-size: 16px;
    }
</style>
