<template>
    <div>
        <!-- ### START Research Group Details Section ### -->
        <div class="research-group-details-container spinner-container">
            <v-progress-circular class="section-spinner"
                v-if="isLoadingResearchGroupDetails"
                indeterminate color="primary"
            ></v-progress-circular>

            <div v-if="isLoadingResearchGroupDetails === false">
            <!--<div>
                    <v-icon small>date_range</v-icon>
                    <span>Created on 22 Aug 2018</span>
                </div> -->
                <div class="display-1 half-bold c-mt-10">{{ group ? group.name : '' }}</div>
                <div class="c-pt-8">{{ group ? group.description : '' }}</div>
            </div>
        </div>
        <!-- ### END Research Group Details Section ### -->


        <!-- ### START Research Group members Section ### -->
        <div class="research-group-members-container spinner-container">
            <v-progress-circular class="section-spinner"
                v-if="isLoadingResearchGroupDetails"
                indeterminate color="primary"
            ></v-progress-circular>

            <div v-if="isLoadingResearchGroupMembers === false">
                <div class="c-pt-8 title">Group members: {{ members.length }}</div>

                <div class="c-pt-6">
                    <v-card>
                        <div class="info-card-list">
                            <div class="list-line align-center">
                                <div class="list-header-cell col-4">Researcher</div>
                                <div class="list-header-cell col-3">Expertise</div>
                                <div class="list-header-cell col-1 text-align-center">Group weight</div>
                                <div class="list-header-cell col-2 text-align-center">Member since</div>
                                <div class="list-header-cell col-2 text-align-center">Location</div>
                            </div>

                            <v-divider></v-divider>

                            <template v-for="(member, i) in members">
                                <div class="list-line">
                                    <div class="legacy-row-nowrap col-4 list-body-cell">
                                        <v-avatar size="40px" class="c-pt-3">
                                            <img v-if="member.profile" v-bind:src="member.profile.avatar | avatarSrc(40, 40, false)" />
                                            <v-gravatar v-else :email="member.account.name + '@deip.world'" />
                                        </v-avatar>

                                        <div class="legacy-col-grow c-pl-4">
                                            <router-link :to="{
                                                    name: 'UserDetails', 
                                                    params: { account_name: member.account.name }
                                                }" 
                                                class="a subheading"
                                            >{{ member | fullname }}</router-link>

                                            <div class="caption c-pt-1">{{member | employmentOrEducation}}</div>
                                        </div>
                                    </div>

                                    <div class="col-3 list-body-cell">
                                        <div v-for="(item, i) in member.expertise" :key="i">
                                            <span class="uppercase bold">{{ item.discipline_name }}:</span> {{ item.amount }}
                                        </div>
                                    </div>

                                    <div class="col-1 text-align-center list-body-cell">
                                        {{ convertToPercent(member.rgt.amount) }}%
                                    </div>

                                    <div class="col-2 text-align-center list-body-cell">
                                        {{ member.created | dateFormat("D MMM YYYY") }}
                                    </div>

                                    <div class="col-2 text-align-center list-body-cell">{{member | userLocation}}</div>
                                </div>

                                <v-divider></v-divider>
                            </template>
                        </div>

                        <div v-if="isResearchGroupMember && !group.is_personal" class="c-pv-4 c-ph-6">
                            <v-btn outline icon color="primary" class="ma-0" @click="$store.dispatch('researchGroup/changeOptions', { key: 'isAddMemberDialogOpen', value: true })">
                                <v-icon small>add</v-icon>
                            </v-btn>
                    
                            <span class="c-pl-2 deip-blue-color">Invite researchers</span>
                        </div>

                        <div v-if="isResearchGroupMember && invites.length">
                            <v-divider></v-divider>

                            <v-expansion-panel class="group-invites">
                                <v-expansion-panel-content>
                                    <div slot="header" class="deip-blue-color">
                                        <!-- <v-icon small color="primary">access_time</v-icon> -->
                                        <span class="">Pending invites ({{invites.length}})</span>
                                    </div>

                                    <div class="">
                                        <template v-for="(invite, i) in invites">
                                            <v-divider></v-divider>

                                            <div class="row c-pv-4 c-ph-6 legacy-align-items-center">
                                                <div class="legacy-row-nowrap col-4">
                                                    <v-avatar size="40px" class="c-pt-3">
                                                        <img v-if="invite.user.profile" v-bind:src="invite.user.profile.avatar | avatarSrc(40, 40, false)" />
                                                        <v-gravatar v-else :email="invite.user.account.name + '@deip.world'" />
                                                    </v-avatar>

                                                    <div class="legacy-col-grow c-pl-4">
                                                        <router-link :to="{
                                                                name: 'UserDetails', 
                                                                params: { account_name: invite.user.account.name }
                                                            }" 
                                                            class="a subheading"
                                                        >{{ invite.user | fullname }}</router-link>

                                                        <div class="caption c-pt-1">{{invite.user | employmentOrEducation}}</div>
                                                    </div>
                                                </div>

                                                <div class="legacy-col-grow text-align-center">{{ invite.user | userLocation }}</div>

                                                <div class="col-2 text-align-center">
                                                    <span class="grey--text">Amount:</span>
                                                    {{ convertToPercent(invite.research_group_token_amount) }}%
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </div>
                    </v-card>

                    <add-member-to-group-dialog v-if="group"
                        :is-open="options.isAddMemberDialogOpen"
                        :group-id="group.id"
                        :group-members="
                            members.map(member => member.account.name)
                                .concat( invites.map(invite => invite.user.account.name) )
                        "
                        @onClose="$store.dispatch('researchGroup/changeOptions', { key: 'isAddMemberDialogOpen', value: false })"
                        @onSuccess="$store.dispatch('researchGroup/loadResearchGroupProposals', { groupId: group.id })">
                    </add-member-to-group-dialog>
                </div>
            </div>
        </div>
        <!-- ### END Research Group members Section ### -->

        <!-- ### START Research Group Research List Section ### -->
        <div class="research-list-container spinner-container c-pt-7">
            <v-progress-circular class="section-spinner"
                v-if="isLoadingResearchGroupResearchList"
                indeterminate color="primary"
            ></v-progress-circular>

            <div v-if="isLoadingResearchGroupResearchList === false">
                <state-research-list :research-list="researchList"></state-research-list>
            </div>
        </div>
        <!-- ### END Research Group Research List Section ### -->

        <!-- ### START Research Group Proposals Section ### -->
        <div id="proposals" v-if="isResearchGroupMember" class="research-group-proposals-container spinner-container c-pt-8">
            <v-progress-circular class="section-spinner"
                v-if="isLoadingResearchGroupProposals"
                indeterminate color="primary"
            ></v-progress-circular>
            
            <div v-if="isLoadingResearchGroupProposals === false">
                <research-group-details-proposals v-if="!isPersonalGroup"></research-group-details-proposals>
            </div>
        </div>
        <!-- ### END Research Group Proposals Section ### -->
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "ResearchGroupDetailsBody",
        props: {
        },
        data() { 
            return {} 
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
            }
        }
    };
</script>

<style lang="less" scoped>
    .group-invites.expansion-panel {
        box-shadow: initial;
    }
    .research-group-details-container {
        min-height: 200px
    }

    .research-group-members-container {
        min-height: 300px
    }

    .research-list-container {
        min-height: 200px
    }

</style>
