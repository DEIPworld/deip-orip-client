<template>
    <div class="research-details-sidebar-container">
      <sidebar-loader v-if="isLoadingResearchPage"></sidebar-loader>
      <div v-if="isLoadingResearchPage === false">

        <router-link :to="`/${groupLink}/group-details`" style="text-decoration: none; color: black">
            <div class="sm-title bold">Research Group <span class="caption grey--text">(view)</span></div>
        </router-link>
        
        <!-- ### START Research Members Section ### -->
        <div class="research-members-container spinner-container">
            <v-progress-circular class="section-spinner"
                v-if="isLoadingResearchMembers"
                indeterminate color="primary"
            ></v-progress-circular>

            <div v-if="isLoadingResearchMembers === false" class="row-nowrap justify-between align-center c-pt-4 c-pb-2" v-for="(member, index) in membersList" :key="index">
                <div>
                    <v-avatar size="40px">
                        <img v-if="member.profile" v-bind:src="member.profile.avatar | avatarSrc(40, 40, false)" />
                        <v-gravatar v-else :title="member.account.name" :email="member.account.name + '@deip.world'" />
                    </v-avatar>
                    <router-link :to="'/user-details/' + member.account.name" class="a c-pl-3">
                        {{member | fullname}}
                    </router-link>
                </div>
                <div class="grey--text"> {{convertToPercent(member.rgt.amount)}}%</div>
            </div>
        </div>
        
        <div v-if="isLoadingResearchMembers === false && isJoinRequestSectionAvailable" class="c-pt-4 c-pb-6">
            <div v-if="canJoinResearchGroup">
                <v-btn @click="openJoinGroupDialog()" outline icon color="primary" class="ma-0">
                    <v-icon small>add</v-icon>
                </v-btn>
                <span class="deip-blue-color c-pl-3">Join research group</span>
            </div>
            <div v-if="isActiveJoinRequest" class="text-align-center italic pt-2">You have sent join request on {{new Date(currentJoinRequest.created).toDateString()}}, please wait for approval</div>
            <div v-if="isActiveInvite" class="text-align-center italic pt-2">
                Your join request has been approved ! Please, accept invite on
                <router-link :to="`/user-details/${user.username}`" style="text-decoration: none">your profile page</router-link>
            </div>
            <v-dialog v-if="research" v-model="isJoinGroupDialogOpen" persistent transition="scale-transition" max-width="800px">
                <v-card class="">
                    <v-toolbar dark color="primary">
                        <v-btn icon dark @click="isJoinGroupDialogOpen = false">
                            <v-icon>close</v-icon>
                        </v-btn>
                        <v-toolbar-title>Please, provide a Cover Letter to your join request</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
            
                    <div class="column-page">
                        <div class="content-column">
                            <div class="filling">
                                <div>
                                    <v-text-field v-model="coverLetter" name="Cover letter" label="Cover Letter" multi-line></v-text-field>
                                    <div class="display-flex c-pt-8">
                                        <v-btn color="primary" 
                                            class="c-m-auto"
                                            :disabled="!coverLetter || isSendingJoinGroupRequest"
                                            :loading="isSendingJoinGroupRequest"
                                            @click="sendJoinGroupRequest()">
                                            Send
                                        </v-btn>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-card>
            </v-dialog>
        </div>
        <!-- ### END Research Members Section ### -->

        <div class="section-divider">
            <v-divider></v-divider>
        </div>

        <!-- ### START Folowers Section ### -->
        <div style="margin: 5px">
            <div class="row-nowrap">
                <div class="col-6 c-pv-6 display-flex" v-ripple>
                    <div class="clickable-label text-align-center c-m-auto">123<br>Folowers</div>
                </div>
                <div class="vertical-devider"></div>
                <div class="col-6 c-pv-6 display-flex" v-ripple>
                    <div class="clickable-label text-align-center c-m-auto">Follow</div>
                </div>
            </div>
        </div>
        <!-- ### END Folowers Section ### -->

        <div class="section-divider">
            <v-divider></v-divider>
        </div>

        <!-- ### START Research Disciplines Section ### -->
        <div class="research-dicsciplines-container spinner-container">
            <v-progress-circular class="section-spinner"
                v-if="isLoadingResearchDisciplines"
                indeterminate color="primary"
            ></v-progress-circular>

            <div v-if="isLoadingResearchDisciplines === false">
                <div class="c-pb-6">
                    <div class="sm-title bold c-pb-4 c-pt-4">Votes:</div>
                    <div v-for="(discipline, index) in disciplinesList" :key="index"
                        class="row align-center justify-between vote-btn-area" :class="index == 0 ? '':'c-mt-1'">
                        <!--     <v-btn small color="primary" dark class="ma-0">Vote</v-btn> -->
                        <div class="deip-blue-color c-p-2">
                            {{discipline.name}}:  
                            {{researchWeightByDiscipline[discipline.id] != null ? researchWeightByDiscipline[discipline.id] : 0}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- ### END Research Disciplines Section ### -->

        <div class="section-divider">
            <v-divider></v-divider>
        </div>

        <!-- ### START Research Review Section ### -->
        <div v-if="isReviewSectionAvailable">
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
        <!-- ### END Research Review Section ### -->

    <!-- <div class="sm-title bold c-pt-6">Citations: 10</div>
        <div class="sm-title bold c-pb-6 c-mt-2">References: 2</div> -->
 
        <div v-if="isReviewSectionAvailable" class="section-divider">
            <v-divider></v-divider>
        </div>

        <!-- ### START Research Info Section ### -->
        <div class="research-info-container spinner-container">
            <v-progress-circular class="section-spinner"
                v-if="isLoadingResearchDetails"
                indeterminate color="primary"
            ></v-progress-circular>

            <div v-if="isLoadingResearchDetails === false">
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
            </div>
        </div>
        <!-- ### END Research Info Section ### -->

        <div class="section-divider">
            <v-divider></v-divider>
        </div>

       
        <!--  <div class="sm-title bold c-pt-6">Total Earned</div>
        
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


        <!-- ### START Research Token Holders Section ### -->
        <div class="research-token-holders-container spinner-container">
            <v-progress-circular class="section-spinner"
                v-if="isLoadingResearchTokenHolders"
                indeterminate color="primary"
            ></v-progress-circular>

            <div v-if="isLoadingResearchTokenHolders === false">
                <div class="sm-title bold c-pt-6">Research Token Holders</div>
                <div class="c-pt-4 c-pb-6">
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
            </div>
        </div>
        <!-- ### END Research Token Holders Section ### -->

        <div class="section-divider">
            <v-divider></v-divider>
        </div>

        <!-- ### START Research Token Sale Section ### -->
        <div v-if="isTokenSaleSectionAvailable">
            <div class="research-token-sale-container spinner-container">
                <v-progress-circular class="section-spinner"
                    v-if="isLoadingResearchTokenSale"
                    indeterminate color="primary"
                ></v-progress-circular>
                
                <div v-if="isLoadingResearchTokenSale === false">
                    <div class="sm-title bold c-pt-6">Research Token Sale</div>
                    <div v-if="(isMissingTokenSale && isResearchGroupMember)" class="c-pt-4 c-pb-6">
                        <router-link v-if="research" :to="`/${research.group_permlink}/create-token-sale/${research.permlink}`"  style="text-decoration: none">
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
                                <v-text-field v-model="amountToContribute" placeholder="amount" suffix="DEIP" mask="########################"></v-text-field>
                                <v-btn :disabled="!amountToContribute" :loading="isTokensBuying" color="primary" @click="contributeToTokenSale()">BUY RESEARCH TOKENS</v-btn>
                            </div>
                        </div>
                    </div>
                    <div v-if="isInActiveTokenSale" class="c-pt-4 c-pb-6">
                        <div class="text-align-center">Token Sale will start on {{toLocalDate(tokenSale.start_time)}}</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- ### END Research Token Sale Section ### -->

        <div v-if="isTokenSaleSectionAvailable" class="section-divider">
            <v-divider></v-divider>
        </div>
      </div>
    </div>
</template>

<script>
    import deipRpc from '@deip/deip-rpc-client';
    import { mapGetters } from 'vuex'
    import joinRequestsService from './../../../services/joinRequests'
    import { extractName } from './../../../utils/user'
    import moment from 'moment';

    export default {
        name: "ResearchDetailsSidebar",
        data(){
           return {
                amountToContribute: undefined,
                groupLink: this.$route.params.research_group_permlink,
                isTokensBuying: false,

                isJoinGroupDialogOpen: false,
                coverLetter: "",
                isSendingJoinGroupRequest: false
           }
        },
        computed: {
            ...mapGetters({
                user: 'auth/user',
                userGroups: 'auth/userGroups',
                userExperise: 'auth/userExperise',
                userJoinRequests: 'auth/userJoinRequests',
                research: 'rd/research',
                contentList: 'rd/contentList',
                membersList: 'rd/membersList',
                disciplinesList: 'rd/disciplinesList',
                totalVotesList: 'rd/totalVotesList',
                researchWeightByDiscipline: 'rd/researchWeightByDiscipline',
                tokenSale: 'rd/tokenSale',
                tokenHoldersList: 'rd/tokenHoldersList',
                contributionsList: 'rd/contributionsList',
                groupInvitesList: 'rd/groupInvitesList',
                isLoadingResearchPage: 'rd/isLoadingResearchPage',
                isLoadingResearchMembers: 'rd/isLoadingResearchMembers',
                isLoadingResearchDisciplines: 'rd/isLoadingResearchDisciplines',
                isLoadingResearchTokenHolders: 'rd/isLoadingResearchTokenHolders',
                isLoadingResearchTokenSale: 'rd/isLoadingResearchTokenSale',
                isLoadingResearchDetails: 'rd/isLoadingResearchDetails'
            }),
            isResearchGroupMember(){
                return this.research != null 
                    ? this.$store.getters['auth/userIsResearchGroupMember'](this.research.research_group_id) 
                    : false
            },
            userHasExpertise() {
                return this.userExperise != null && this.research != null
                    ?  this.userExperise.some(exp => 
                            this.research.disciplines.some(d => d.id == exp.discipline_id))
                    : false
            },
            isMissingTokenSale(){
                return this.tokenSale === null;
            },
            isActiveTokenSale() {
                return this.tokenSale && this.tokenSale.status == 1;
            },
            isFinishedTokenSale() {
                return this.tokenSale && this.tokenSale.status == 2;
            },
            isInActiveTokenSale() {
                return this.tokenSale && this.tokenSale.status == 4;
            },
            isFinishedResearch() {
                return this.research && this.research.is_finished;
            },
            currentCap() {
                return this.contributionsList.map(c => c.amount).reduce((acc, val) => {return acc + val}, 0);
            },
            currentCapPercent() {
                return this.tokenSale ? this.currentCap * 100 / this.tokenSale.hard_cap : 0;
            },
            canJoinResearchGroup() {
                if (this.research) {
                    if (this.membersList.some(m => m.account.name == this.user.username))
                        return false;
                    if (this.userJoinRequests.some(r => r.groupId == this.research.research_group_id))
                        return false;

                    return true;
                }
                return false;
            },
            currentJoinRequest() {
                return this.research ? this.userJoinRequests.find(r => r.groupId == this.research.research_group_id) : undefined;
            },
            isActiveJoinRequest() {
                return this.currentJoinRequest && this.currentJoinRequest.status == 'Pending';
            },
            isActiveInvite() {
                return this.groupInvitesList.some(invite => invite.account_name == this.user.username)
            },
            isProfileAvailable() {
                return this.user.profile != null;
            },
            isReviewSectionAvailable() {
                return !this.isResearchGroupMember && this.userHasExpertise && this.contentList.length;
            },
            isTokenSaleSectionAvailable() {
                return (this.isMissingTokenSale && this.isResearchGroupMember && !this.isFinishedResearch) || this.isActiveTokenSale || this.isInActiveTokenSale;
            },
            isJoinRequestSectionAvailable() {
                return this.isProfileAvailable && (this.canJoinResearchGroup || this.isActiveJoinRequest || this.isActiveInvite)
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
                    this.$store.dispatch('rd/loadResearchTokenSale', {researchId: this.research.id})
                    this.$store.dispatch('rd/loadResearchTokenHolders', {researchId: this.research.id})
                    this.isTokensBuying = false;
                    this.amountToContribute = undefined;
                    this.$store.dispatch('layout/setSuccess', {
                        message: `You've contributed to "${this.research.title}" token sale successfully !`
                    });
                }, (err) => {
                    this.isTokensBuying = false;
                    this.$store.dispatch('layout/setError', {
                        message: "An error occurred while contributing to Token Sale, please try again later"
                    });
                    console.log(err)
                })
            },

            openJoinGroupDialog() {
                this.isJoinGroupDialogOpen = true;
                this.coverLetter = "";
            },
            sendJoinGroupRequest() {
                this.isSendingJoinGroupRequest = true;
                joinRequestsService.createJoinRequest({
                    username: this.user.username,
                    groupId: this.research.research_group_id,
                    coverLetter: this.coverLetter
                }).then(() => {
                    this.$store.dispatch('auth/loadJoinRequests');
                    this.$store.dispatch('layout/setSuccess', { message: "Join request has been sent successfully !"});
                }, (err) => {
                    this.$store.dispatch('layout/setError', { message: "An error occurred while sending join request, please try again later!"});
                    console.log(err)
                }).finally(() => {
                    this.isSendingJoinGroupRequest = false;
                    this.isJoinGroupDialogOpen = false;
                })
            },
            toLocalDate(utc) {
                const localTime = moment.utc(utc).local().format();
                return localTime;
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
        width: 14px;
        height: 14px;
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

    .section-divider {
        margin: 0 -24px;
    }

    .research-details-sidebar-container {
        
    }
    
    .research-members-container {
        // min-height: 150px
    }

    .research-dicsciplines-container {
        min-height: 150px
    }

    .research-info-container {
        min-height: 150px
    }

    .research-token-holders-container {
        min-height: 150px
    }

    .research-token-sale-container {
        // min-height: 150px
    }

</style>
