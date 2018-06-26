<template>
    <div>
        <!-- ### START Research Group Details Section ### -->
        <div class="research-group-details-container spinner-container">
            <v-progress-circular v-if="isLoadingResearchGroupDetails" indeterminate color="primary"></v-progress-circular>
            <div v-if="isLoadingResearchGroupDetails === false">
                <div>
                    <v-icon small>date_range</v-icon>
                    <span>Created 20 Jan 2018</span>
                </div>
                <div class="display-1 half-bold c-mt-10">{{ group ? group.name : '' }}</div>
                <div class="c-pt-8">{{ group ? group.description : '' }}</div>
            </div>
        </div>
        <!-- ### END Research Group Details Section ### -->


        <!-- ### START Research Group Members Section ### -->
        <div class="research-group-members-container spinner-container">
            <v-progress-circular v-if="isLoadingResearchGroupDetails" indeterminate color="primary"></v-progress-circular>
            <div v-if="isLoadingResearchGroupMembers === false">
                <div class="c-pt-8 title">Group Members: {{ members.length }}</div>
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
                                    <div class="row-nowrap col-4 list-body-cell">
                                        <v-avatar size="40px" class="c-pt-3">
                                            <img v-if="member.profile" v-bind:src="member.profile.avatar | avatarSrc(40, 40, false)" />
                                            <v-gravatar v-else :email="member.account.name + '@deip.world'" />
                                        </v-avatar>

                                        <div class="col-grow c-pl-4">
                                            <router-link :to="'/user-details/' + member.account.name" class="a subheading">{{ member | fullname }}</router-link>
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

                                    <div class="col-2 text-align-center list-body-cell">Belarus</div>
                                </div>

                                <v-divider></v-divider>
                            </template>
                        </div>

                        <div v-if="isResearchGroupMember" class="c-pv-4 c-ph-6">
                            <v-btn outline icon color="primary" class="ma-0" @click="$store.dispatch('researchGroup/changeOptions', { key: 'isAddMemberDialogOpen', value: true })">
                                <v-icon small>add</v-icon>
                            </v-btn>
                    
                            <span class="c-pl-2 deip-blue-color">Invite researchers</span>
                        </div>
                    </v-card>

                    <add-member-to-group-dialog v-if="group"
                        :is-open="options.isAddMemberDialogOpen"
                        :group-id="group.id"
                        :group-members="members"
                        @onClose="$store.dispatch('researchGroup/changeOptions', { key: 'isAddMemberDialogOpen', value: false })"
                        @onSuccess="$store.dispatch('researchGroup/loadResearchGroupProposals', group.id)">
                    </add-member-to-group-dialog>
                </div>
            </div>
        </div>
        <!-- ### END Research Group Members Section ### -->

        <!-- ### START Research Group Research List Section ### -->
        <div class="research-list-container spinner-container c-pt-7">
            <v-progress-circular v-if="isLoadingResearchGroupResearchList" indeterminate color="primary"></v-progress-circular>
            <div v-if="isLoadingResearchGroupResearchList === false">
                <state-research-list :research-list="researchList"></state-research-list>
            </div>
        </div>
        <!-- ### END Research Group Research List Section ### -->

        <!-- ### START Research Group Proposals Section ### -->
        <div v-if="isResearchGroupMember" class="research-group-proposals-container spinner-container c-pt-8">
            <v-progress-circular v-if="isLoadingResearchGroupProposals" indeterminate color="primary"></v-progress-circular>
            <div v-if="isLoadingResearchGroupProposals === false">
                <research-group-details-proposals></research-group-details-proposals>
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
                isLoadingResearchGroupDetails: 'researchGroup/isLoadingResearchGroupDetails',
                isLoadingResearchGroupMembers: 'researchGroup/isLoadingResearchGroupMembers',
                isLoadingResearchGroupResearchList: 'researchGroup/isLoadingResearchGroupResearchList',
                isLoadingResearchGroupProposals: 'researchGroup/isLoadingResearchGroupProposals',
            }),
            isResearchGroupMember() {
                return this.group != null 
                    ? this.$store.getters['auth/userIsResearchGroupMember'](this.group.id) 
                    : false
            }
        }
    };
</script>

<style lang="less" scoped>

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
