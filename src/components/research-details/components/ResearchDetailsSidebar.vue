<template>
    <div class="research-details-sidebar-container">
      <sidebar-loader v-if="isLoadingResearchPage"></sidebar-loader>
      <div v-if="isLoadingResearchPage === false">

        <router-link :to="`/${encodeURIComponent(groupLink)}/group-details`" style="text-decoration: none; color: black">
            <div class="sm-title bold">Research group <span class="a caption">(view)</span></div>
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
            <div v-if="isActiveJoinRequest" class="text-align-center italic pt-2">You have sent a join request on {{new Date(currentJoinRequest.created).toDateString()}}, please wait for approval</div>
            <div v-if="isActiveInvite" class="text-align-center italic pt-2">
                Please accept invite on
                <router-link :to="`/user-details/${user.username}`" style="text-decoration: none">your profile page</router-link>
                to join the research group
            </div>
            <v-dialog v-if="research" v-model="isJoinGroupDialogOpen" persistent transition="scale-transition" max-width="800px">
                <v-card class="">
                    <v-toolbar dark color="primary">
                        <v-btn icon dark @click="isJoinGroupDialogOpen = false">
                            <v-icon>close</v-icon>
                        </v-btn>
                        <v-toolbar-title>Please provide a cover letter to your join request</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
            
                    <page-container>
                        <contentbar>
                            <div>
                                <v-text-field v-model="coverLetter" :rows="8" name="Cover letter" label="Cover letter" multi-line></v-text-field>
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
                        </contentbar>
                    </page-container>
                </v-card>
            </v-dialog>
        </div>
        <!-- ### END Research Members Section ### -->
        
    <!--    <sidebar-splitted-btn>
            <div slot="left" class="default-half-splitted">
                <span class="c-m-auto clickable-label">23<br>Followers</span>
            </div>

            <div slot="right" class="default-half-splitted">
                <span class="c-m-auto clickable-label">Follow</span>
            </div>
        </sidebar-splitted-btn> -->

        <!-- ### START Research Content ECI Section ### -->
        <div class="c-mb-6 c-mt-4">
            <div class="sidebar-fullwidth"><v-divider></v-divider></div>
            <div class="subheading bold c-mt-4">Expertise Contribution Index</div>

            <div class="c-mt-4">
                <div v-for="(eci, index) in eciList" :key="index"
                    class="row align-center justify-between eci-item c-ph-2"
                    :class="index === 0 ? '' : 'c-mt-1'"
                >
                    <div class="grey--text">ECI</div>
                    <div class="c-pv-2 eci-label">{{ eci.disciplineName }}: {{ eci.value }}</div>
                </div>
            </div>
        </div>
        <!-- ### END Research Content ECI Section ### -->

    <!-- <div class="sm-title bold c-pt-6">Citations: 10</div>
        <div class="sm-title bold c-pb-6 c-mt-2">References: 2</div> -->
 
        <!-- ### START Research Info Section ### -->
        <div class="c-mb-6 c-mt-4">
            <div class="sidebar-fullwidth"><v-divider></v-divider></div>
            <div class="subheading bold c-mt-4">
                Reviews: <span style="color: green">{{positiveReviewsCount}}</span> / <span style="color: red">{{negativeReviewsCount}}</span> 
            </div>
            <div class="c-pt-3">
                <div class="caption"><v-icon small class="c-pr-2">rate_review</v-icon>Reward for review: <span class="bold">{{convertToPercent(research.review_share_in_percent)}}%</span></div>
                    <div class="caption" v-if="isResearchRewardDistributionActive">
                        <div><v-icon small class="c-mr-2">av_timer</v-icon>Reward period active till</div>
                        <div class="bold"><v-icon small class="c-mr-2">today</v-icon>{{researchRewardDistributionState.end.toDateString()}}</div> 
                    </div>
                </div> 
            </div>
        </div>
        <!-- ### END Research Info Section ### -->
       
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
        <div class="c-mb-6 c-mt-4">
            <div class="sidebar-fullwidth"><v-divider></v-divider></div>
            <div>
                <div class="subheading bold c-mt-4">Research Token holders</div>
                <div class="c-pt-4 c-pb-6">
                    <span class="half-bold">Research group</span>
                    <span class="right">
                        {{convertToPercent(DEIP_100_PERCENT - tokenHoldersList.reduce((share, holder) => {
                        return share + holder.amount;}, 0))}}%
                    </span>
                    <div v-for="holder in tokenHoldersList">
                        <router-link class="a half-bold" :to="'/user-details/' + holder.user.account.name">
                            {{holder.user | fullname}}
                        </router-link>
                        <span class="right">{{convertToPercent(holder.amount)}}%</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- ### END Research Token Holders Section ### -->
        
        <!-- ### START Research Token Sale Section ### -->
        <div class="c-mb-6 c-mt-4" v-if="isTokenSaleSectionAvailable">
            <div class="sidebar-fullwidth"><v-divider></v-divider></div>
            <div>
                <div>
                    <div class="subheading bold c-mt-4">Research Token sale</div>
                    <div v-if="(isMissingTokenSale && isResearchGroupMember)" class="c-pt-4 c-pb-6">
                        <router-link v-if="research" :to="`/${research.group_permlink}/create-token-sale/${research.permlink}`" style="text-decoration: none">
                            <v-btn dark round outline color="primary" class="full-width c-mt-3 c-mb-3">
                                <div class="col-grow add-review-label">{{!isPersonalGroup ? 'Propose Token sale' : 'Create Token sale'}}</div>
                            </v-btn>
                        </router-link>
                    </div>

                    <div v-if="isActiveTokenSale" class="c-pt-4 c-pb-6">
                        <div>
                            <span class="half-bold">On Sale</span>
                            <span class="right">{{ convertToPercent(tokenSale.balance_tokens) }}%</span>
                        </div>
                        <div>
                            <span class="half-bold">Deadline</span>
                            <span class="right">{{ tokenSale.end_time | dateFormat('HH:mm D MMM YYYY', true) }}</span>
                        </div>
                        <div>
                            <span class="half-bold">Soft Cap</span>
                            <span class="right">{{ fromAssetsToFloat(tokenSale.soft_cap) }}</span>
                        </div>
                        <div>
                            <span class="half-bold">Hard Cap</span>
                            <span class="right">{{ fromAssetsToFloat(tokenSale.hard_cap) }}</span>
                        </div>

                        <div class="c-mt-8">
                            <div class="row">
                                <div>
                                    <span class="left grey--text c-mr-2 cap-value">0</span>
                                </div>

                                <div class="col-grow pos-relative row-nowrap align-center">
                                    <div class="chapter-line black" :style="{ width: currentCapPercent + '%' }"></div>
                                    <div class="chapter-line grey lighten-1 col-grow"></div>

                                    <div class="pos-absolute" :style="{ left: currentCapPercent + '%' }">
                                        <v-tooltip bottom color="white">
                                            <div class="chapter-point deip-blue-bg" slot="activator"></div>
                                            <div>
                                                <div class="grey--text cap-value text-align-center">{{ currentCap }}</div>
                                            </div>
                                        </v-tooltip>
                                    </div>

                                    <div><span class="right grey--text c-ml-2 cap-value">{{ fromAssetsToFloat(tokenSale.hard_cap) }}</span></div>
                                </div>
                            </div>

                            <div v-if="!isResearchGroupMember" class="c-mt-5 text-align-center">
                                <v-text-field
                                    ref="amountToContribute"
                                    v-model="amountToContribute"
                                    placeholder="Amount" suffix="DEIP"
                                    :rules="[deipTokenValidator]"
                                ></v-text-field>

                                <v-btn :disabled="!$refs.amountToContribute.valid || isTokensBuying || !this.amountToContribute"
                                    v-if="$refs.amountToContribute"
                                    :loading="isTokensBuying"
                                    color="primary"
                                    @click="contributeToTokenSale()"
                                >BUY RESEARCH TOKENS</v-btn>
                            </div>
                        </div>
                    </div>

                    <div v-if="isInActiveTokenSale" class="c-mt-4 c-mb-6">
                        <div>
                            <div class="body-1"> <v-icon small class="c-pr-1">av_timer</v-icon>Research Token sale will start at: 
                                <div class="body-2 c-pl-6">
                                    {{ tokenSale.start_time | dateFormat('HH:mm D MMM YYYY', true) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- ### END Research Token Sale Section ### -->
      </div>
    </div>
</template>

<script>
    import deipRpc from '@deip/deip-rpc-client';
    import { mapGetters } from 'vuex'
    import joinRequestsService from './../../../services/http/joinRequests'
    import { extractName } from './../../../utils/user'
    import moment from 'moment';
    import { contentTypesList } from './../../../services/ResearchService';

    export default {
        name: "ResearchDetailsSidebar",

        data(){
           return {
                amountToContribute: '',
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
                group: 'rd/group',
                contentList: 'rd/contentList',
                membersList: 'rd/membersList',
                reviewsList: 'rd/reviewsList',
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
                isLoadingResearchDetails: 'rd/isLoadingResearchDetails',
                userPersonalGroup: 'auth/userPersonalGroup'
            }),
            isPersonalGroup() {
                return this.research 
                    ? this.research.research_group_id == this.userPersonalGroup.id 
                    : false;
            },
            isResearchGroupMember() {
                return this.research != null 
                    ? this.$store.getters['auth/userIsResearchGroupMember'](this.research.research_group_id) 
                    : false
            },

            positiveReviewsCount() {
                return this.reviewsList.filter(r => r.is_positive).length;
            },
            negativeReviewsCount() {
                return this.reviewsList.filter(r => !r.is_positive).length;
            },
            isResearchRewardDistributionActive() {
                return this.contentList.some(c => c.content_type == 'final_result');
            },
            researchRewardDistributionState() {
                const finalResult = this.contentList.find(c => c.content_type == 'final_result');
                return finalResult ? {
                    state: finalResult.activity_state,
                    start: new Date(`${finalResult.activity_window_start}Z`),
                    end: new Date(`${finalResult.activity_window_end}Z`)
                } : null;
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
                return this.contributionsList
                    .map(c => this.fromAssetsToFloat(c.amount))
                    .reduce((acc, val) => acc + val, 0);
            },
            currentCapPercent() {
                return this.tokenSale
                    ? this.currentCap * 100 / this.fromAssetsToFloat(this.tokenSale.hard_cap)
                    : 0;
            },
            canJoinResearchGroup() {
                if (this.research) {
                    if (this.membersList.some(m => m.account.name == this.user.username))
                        return false;
                    if (this.userJoinRequests.some(r => r.groupId == this.research.research_group_id))
                        return false;

                    return !this.isActiveInvite;
                }
                return false;
            },
            currentJoinRequest() {
                return this.research ? this.userJoinRequests.find(r => r.groupId == this.research.research_group_id) : undefined;
            },
            isActiveJoinRequest() {
                return this.currentJoinRequest && this.currentJoinRequest.status == 'pending';
            },
            isActiveInvite() {
                return this.groupInvitesList.some(invite => invite.account_name == this.user.username)
            },
            isProfileAvailable() {
                return this.user.profile != null;
            },
            userHasExpertise() {
                return this.userExperise != null && this.research != null
                    ?  this.userExperise.some(exp => this.research.disciplines.some(d => d.id == exp.discipline_id))
                    : false
            },
            isTokenSaleSectionAvailable() {
                return (this.isMissingTokenSale && this.isResearchGroupMember && !this.isFinishedResearch) || this.isActiveTokenSale || this.isInActiveTokenSale;
            },
            isJoinRequestSectionAvailable() {
                return this.isProfileAvailable && (this.canJoinResearchGroup || this.isActiveJoinRequest || this.isActiveInvite) && !this.group.is_personal;
            },
            eciList() {
                return this.research.disciplines.map(discipline => {
                    const eciObj = this.research.eci_per_discipline.find(item => item[0] === discipline.id);

                    return {
                        disciplineName: discipline.name,
                        value: eciObj ? eciObj[1] : 0
                    }
                });
            }
        },

        methods: {
            contributeToTokenSale() {
                this.isTokensBuying = true;

                deipRpc.broadcast.contributeToTokenSaleAsync(
				    this.user.privKey,
                    this.tokenSale.id,
                    this.user.username,
                    this.toAssetUnits(this.amountToContribute)
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
            }
        }
    };
</script>

<style lang="less" scoped>
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

    .eci-item {
        border: 1px solid #e4e4e4;
        border-radius: 3px;
    }
    .eci-label {
       color: #818181;
    }

</style>
