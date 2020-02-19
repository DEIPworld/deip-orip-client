<template>
    <div class="py-5">
        <!-- ### START Research Group Details Section ### -->
        <div class="px-5 research-group-details-container">
            <v-layout row class="display-1 font-weight-medium mt-4">
                <div class="pr-4">{{ group ? group.name : '' }}</div>
                <v-btn
                    v-if="isResearchGroupMember && !isPersonalGroup"
                    class="ma-0 align-self-center"
                    small
                    outline
                    color="grey"
                    :to="{ 
                        name: 'ResearchGroupSettings', 
                        params: { 
                            research_group_permlink: encodeURIComponent(group.permlink) 
                        }
                    }"
                >Edit group</v-btn>
            </v-layout>
            <div class="pt-4">{{ group ? group.description : '' }}</div>
        </div>
        <!-- ### END Research Group Details Section ### -->

        <!-- ### START Research Group Proposals Section ### -->
        <div id="proposals" v-if="isResearchGroupMember && !isPersonalGroup">
            <transition v-if="highlightProposalsSection" name="fade">
                <div v-if="proposalsSectionTransitionTrigger" class="pt-2 pb-4">            
                    <research-group-details-proposals :key="'group-proposals'" class="px-5"></research-group-details-proposals>
                </div>
            </transition>
            <div v-else>
                <div class="pt-2 pb-4">            
                    <research-group-details-proposals :key="'group-proposals'" class="px-5"></research-group-details-proposals>
                </div>
            </div>
        </div>
        <!-- ### END Research Group Proposals Section ### -->

        <!-- ### START Research Group members Section ### -->
        <div class="px-5 py-4">
            <div>
                <div class="title">Group members: {{ members.length }}</div>
                <div class="pt-4">
                    <v-card>
                        <div class="info-card-list">
                            <v-layout row class="list-line align-center">
                                <v-flex list-header-cell :class="isShowActionColumn ? 'xs3': 'xs4'">Researcher</v-flex>
                                <v-flex list-header-cell xs3>Expertise</v-flex>
                                <v-flex list-header-cell xs1 text-align-center>Group weight</v-flex>
                                <v-flex list-header-cell xs2 text-align-center>Member since</v-flex>
                                <v-flex list-header-cell xs2 text-align-center>Location</v-flex>
                                <v-flex v-if="isShowActionColumn" list-header-cell xs1 text-align-center>Action</v-flex>
                            </v-layout>

                            <v-divider></v-divider>

                            <template v-for="(member, i) in members">
                                <v-layout class="list-line" :key="'member-' + i">
                                    <v-flex list-body-cell display-flex :class="isShowActionColumn ? 'xs3' : 'xs4'">
                                        <platform-avatar 
                                            :user="member"
                                            :size="40"
                                        ></platform-avatar>
                                        <div class="pl-3">
                                            <router-link :to="{
                                                    name: 'UserDetails', 
                                                    params: { account_name: member.account.name }
                                                }" 
                                                class="a subheading"
                                            >{{ member | fullname }}</router-link>

                                            <div class="caption c-pt-1">{{member | employmentOrEducation}}</div>
                                        </div>
                                    </v-flex>

                                    <v-flex xs3 list-body-cell>
                                        <div v-for="(item, i) in member.expertise" :key="i">
                                            <span class="uppercase bold">{{ item.discipline_name }}:</span> {{ item.amount }}
                                        </div>
                                    </v-flex>

                                    <v-flex xs1 text-align-center list-body-cell>
                                        {{ convertToPercent(member.rgt.amount) }}%
                                    </v-flex>

                                    <v-flex xs2 text-align-center list-body-cell>
                                        {{ member.created | dateFormat("D MMM YYYY") }}
                                    </v-flex>

                                    <v-flex xs2 text-align-center list-body-cell>{{member | userLocation}}</v-flex>

                                    <v-flex v-if="(isResearchGroupMember && !group.is_dao && member.rgt.owner != group.creator) || 
                                    (group.is_dao && member.rgt.owner != group.creator && user.username == group.creator)" xs1 text-align-center list-body-cell>
                                        <v-btn 
                                          flat 
                                          icon 
                                          color="grey" 
                                          class="ma-0" 
                                          @click="showConfirmAction(member, i)">
                                            <v-icon>mdi-close-circle-outline</v-icon>
                                        </v-btn>
                                    </v-flex>
                                </v-layout>

                                <v-divider :key="'member-divider-' + i"></v-divider>
                            </template>
                        </div>

                        <confirm-action-dialog
                          :meta="dropoutMemberMeta"
                          :title="`You’re about to exclude`" 
                          :text="`${dropoutMemberMeta.item ? 
                          `${dropoutMemberMeta.item.firstName} ${dropoutMemberMeta.item.lastName}` : ''} from ${group.name} Research Group`"
                          @confirmed="dropoutMember($event);" 
                          @canceled="dropoutMemberMeta.isShown = false">
                        </confirm-action-dialog>

                        <div v-if="isResearchGroupMember && !group.is_personal" class="px-4 py-3">
                            <v-btn outline icon color="primary" class="ma-0" @click="$store.dispatch('researchGroup/changeOptions', { key: 'isAddMemberDialogOpen', value: true })">
                                <v-icon small>add</v-icon>
                            </v-btn>
                    
                            <span class="pl-2">Invite researchers</span>
                        </div>

                        <div v-if="isResearchGroupMember && invites.length">
                            <v-divider></v-divider>

                            <v-expansion-panel class="group-invites">
                                <v-expansion-panel-content>
                                    <div slot="header">
                                        <!-- <v-icon small color="primary">access_time</v-icon> -->
                                        <span class="">Pending invites ({{invites.length}})</span>
                                    </div>

                                    <div class="">
                                        <template v-for="(invite, i) in invites">
                                            <v-divider :key="'invite-divider-' + i"></v-divider>

                                            <v-layout row py-3 px-4 align-center :key="'invite-' + i">
                                                <v-flex xs4 display-flex>
                                                    <platform-avatar 
                                                        :user="invite.user"
                                                        :size="40"
                                                    ></platform-avatar>

                                                    <div class="grow pl-3">
                                                        <router-link :to="{
                                                                name: 'UserDetails', 
                                                                params: { account_name: invite.user.account.name }
                                                            }" 
                                                            class="a subheading"
                                                        >{{ invite.user | fullname }}</router-link>

                                                        <div class="caption pt-1">{{invite.user | employmentOrEducation}}</div>
                                                    </div>
                                                </v-flex>

                                                <v-flex class="grow text-align-center">{{ invite.user | userLocation }}</v-flex>

                                                <v-flex xs2 text-align-center>
                                                    <span class="grey--text">Amount:</span>
                                                    {{ convertToPercent(invite.research_group_token_amount) }}%
                                                </v-flex>
                                            </v-layout>
                                        </template>
                                    </div>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </div>
                    </v-card>

                    <add-member-to-group-dialog v-if="group"
                        :is-open="options.isAddMemberDialogOpen"
                        :group-id="group.id"
                        :users="usersToInvite"
                        @onClose="$store.dispatch('researchGroup/changeOptions', { key: 'isAddMemberDialogOpen', value: false })"
                        @onSuccess="$store.dispatch('researchGroup/loadResearchGroupProposals', { groupId: group.id })">
                    </add-member-to-group-dialog>
                </div>
            </div>
        </div>
        <!-- ### END Research Group members Section ### -->

        <!-- ### START Research Group Research List Section ### -->
        <div class="px-5 py-4">
            <state-research-list :research-list="researchList"></state-research-list>
        </div>
        <!-- ### END Research Group Research List Section ### -->
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import deipRpc from '@deip/deip-oa-rpc-client';
    import { getEnrichedProfiles } from './../../../utils/user';
    import { createDropoutProposal } from "./../../../services/ProposalService";

    export default {
        name: "ResearchGroupDetailsBody",
        props: {
        },
        data() { 
            return {
                highlightProposalsSection: undefined,
                proposalsSectionTransitionTrigger: false,
                usersToInvite: [],

                dropoutMemberMeta:{ isShown: false, item: null, index: null, isConfirming: false},
                isLoadingDropoutBtn: false,
                isDisabledDropoutBtn: false
            } 
        },
        computed: {
            ...mapGetters({
                user: 'auth/user',
                userGroups: 'auth/userGroups',
                group: 'researchGroup/group',
                researchList: 'researchGroup/researchList',
                options: 'researchGroup/options',
                members: 'researchGroup/members',
                invites: 'researchGroup/invites',
                isLoadingResearchGroupDetails: 'researchGroup/isLoadingResearchGroupDetails',
                isLoadingResearchGroupMembers: 'researchGroup/isLoadingResearchGroupMembers',
                isLoadingResearchGroupResearchList: 'researchGroup/isLoadingResearchGroupResearchList',
                isLoadingResearchGroupProposals: 'researchGroup/isLoadingResearchGroupProposals',
                userPersonalGroup: 'auth/userPersonalGroup'
            }),
            isPersonalGroup() {
                return this.group 
                    ? this.group.id == this.userPersonalGroup.id 
                    : false;
            },
            isResearchGroupMember() {
                return this.group != null 
                    ? this.$store.getters['auth/userIsResearchGroupMember'](this.group.id) 
                    : false
            },
            isShowActionColumn(){
                return (!this.group.is_dao && this.isResearchGroupMember) || (this.group.is_dao && this.user.username == this.group.creator)
            }
        }, 

        methods: {
          dropoutMember(member) {
            this.dropoutMemberMeta.isConfirming = true;

            createDropoutProposal(
                this.group.id,
                member.item.owner,
            ).then(() => {
                this.$store.dispatch('layout/setSuccess', {
                    message: "Dropout Proposal has been created successfully!"
                });
                this.$store.dispatch('researchGroup/loadResearchGroupProposals', { groupId: this.group.id })
            }).catch(err => {
                this.$store.dispatch('layout/setError', {
                    message: "An error occurred while creating proposal, please try again later"
                });
                console.log(err)
            }).finally(() => {
                this.dropoutMemberMeta.isConfirming = false;
                this.dropoutMemberMeta.isShown = false
                this.$vuetify.goTo('#proposals')
            });
          },

          showConfirmAction(member, index){
            const memberData = {
              'firstName':member.profile.firstName,
              'lastName':member.profile.lastName,
              'owner':member.rgt.owner
            }
            this.dropoutMemberMeta.item = memberData
            this.dropoutMemberMeta.index = index
            this.dropoutMemberMeta.isShown = true
          }
        },

        mounted() {
            if (this.highlightProposalsSection) {
                this.proposalsSectionTransitionTrigger = true;
            }
        },

        created() {
            this.highlightProposalsSection = this.$route.hash == "#proposals";
            
            deipRpc.api.getAllAccountsAsync()
                .then(accounts => {
                    let blackList = [
                        "regacc", "hermes", "initdelegate", 
                        ...this.members.map(member => member.account.name), 
                        ...this.invites.map(invite => invite.user.account.name)
                    ];
                    let usersToInvite = accounts.filter(a => !blackList.some(username => username === a.name)).map(a => a.name);
                    return getEnrichedProfiles(usersToInvite);
                })
                .then((users) => {
                    this.usersToInvite = users;
                });
        }
    };
</script>

<style lang="less" scoped>
    @import "./../../../styles/colors.less";

    .group-invites.expansion-panel {
        box-shadow: initial;
    }
    .research-group-details-container {
        min-height: 200px
    }

    .fade-enter-active, .fade-leave-active {
        background-color: none !important;
        transition: all 2.5s !important;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        background-color: @yellow !important;
    }

    .info-card-list {
        .list-line {
            display: flex;
            padding-top: 24px;
            padding-bottom: 24px;
            padding-left: 12px;
            padding-right: 12px;
        }
        .list-header-cell {
            padding-right: 12px;
            padding-left: 12px;
            color: @grey;
        }
        .list-body-cell {
            padding-right: 12px;
            padding-left: 12px;
            align-self: center;
        }
    }
</style>
