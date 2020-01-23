<template>
    <div class="py-5">
        <!-- ### START Research Group Details Section ### -->
        <div class="px-5 research-group-details-container">
            <div>
                <div class="display-1 half-bold c-mt-10">{{ group ? group.name : '' }}</div>
                <div class="c-pt-8">{{ group ? group.description : '' }}</div>
            </div>
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
                <div class="c-pt-6">
                    <v-card>
                        <div class="info-card-list">
                            <div class="list-line align-center">
                                <div class="list-header-cell legacy-col-4">Researcher</div>
                                <div class="list-header-cell legacy-col-3">Expertise</div>
                                <div class="list-header-cell legacy-col-1 text-align-center">Group weight</div>
                                <div class="list-header-cell legacy-col-2 text-align-center">Member since</div>
                                <div class="list-header-cell legacy-col-2 text-align-center">Location</div>
                            </div>

                            <v-divider></v-divider>

                            <template v-for="(member, i) in members">
                                <div class="list-line" :key="'member-' + i">
                                    <div class="legacy-row-nowrap legacy-col-4 list-body-cell">
                                        <v-avatar size="40px" class="c-pt-3">
                                            <img v-if="member.profile" v-bind:src="member.profile.avatar | avatarSrc(80, 80, false)" />
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

                                    <div class="legacy-col-3 list-body-cell">
                                        <div v-for="(item, i) in member.expertise" :key="i">
                                            <span class="uppercase bold">{{ item.discipline_name }}:</span> {{ item.amount }}
                                        </div>
                                    </div>

                                    <div class="legacy-col-1 text-align-center list-body-cell">
                                        {{ convertToPercent(member.rgt.amount) }}%
                                    </div>

                                    <div class="legacy-col-2 text-align-center list-body-cell">
                                        {{ member.created | dateFormat("D MMM YYYY") }}
                                    </div>

                                    <div class="legacy-col-2 text-align-center list-body-cell">{{member | userLocation}}</div>
                                </div>

                                <v-divider :key="'member-divider-' + i"></v-divider>
                            </template>
                        </div>

                        <div v-if="isResearchGroupMember && !group.is_personal" class="c-pv-4 c-ph-6">
                            <v-btn outline icon color="primary" class="ma-0" @click="$store.dispatch('researchGroup/changeOptions', { key: 'isAddMemberDialogOpen', value: true })">
                                <v-icon small>add</v-icon>
                            </v-btn>
                    
                            <span class="c-pl-2">Invite researchers</span>
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

                                            <div class="legacy-row c-pv-4 c-ph-6 legacy-align-items-center" :key="'invite-' + i">
                                                <div class="legacy-row-nowrap legacy-col-4">
                                                    <v-avatar size="40px" class="c-pt-3">
                                                        <img v-if="invite.user.profile" v-bind:src="invite.user.profile.avatar | avatarSrc(80, 80, false)" />
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

                                                <div class="legacy-col-2 text-align-center">
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

        <div class="px-5 py-4" v-if="isResearchGroupMember">
            <div class="title half-bold pb-4">Update group logo:</div>
            <v-layout>
                <v-flex xs3>
                    <img width="150px" height="150px" :src="$options.filters.researchGroupLogoSrc(group.id, 300, 300, true)">
                </v-flex>
                <v-flex xs9>
                    <div v-if="logoDropzoneOptions">
                        <vue-dropzone ref="researchGroupLogo" id="research-group-logo" 
                            :options="logoDropzoneOptions"
                            @vdropzone-success="logoUploadSuccess"
                            @vdropzone-error="logoUploadError">
                        </vue-dropzone>
                        <div class="text-xs-right py-3">
                            <v-btn :disabled="isUploadingLogo" :loading="isUploadingLogo" class="ma-0" @click="updateLogoImage()" color="primary">Update logo</v-btn>
                        </div>
                    </div>
                </v-flex>
            </v-layout>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import deipRpc from '@deip/deip-oa-rpc-client';
    import { getEnrichedProfiles } from './../../../utils/user';
    import { getAccessToken } from './../../../utils/auth';
    import vueDropzone from 'vue2-dropzone';

    export default {
        name: "ResearchGroupDetailsBody",
        components: {
            vueDropzone
        },
        props: {
        },
        data() { 
            return {
                highlightProposalsSection: undefined,
                proposalsSectionTransitionTrigger: false,
                usersToInvite: [],
                isUploadingLogo: false
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
            logoDropzoneOptions() {
                return this.group != null ? {
                    url: `${window.env.DEIP_SERVER_URL}/api/groups/logo`,
                    paramName: "research-background",
                    headers: {
                        "Research-Group-Id": this.group.id.toString(),
                        "Authorization": 'Bearer ' + getAccessToken()
                    },
                    timeout: 0,
                    uploadMultiple: false,
                    createImageThumbnails: true,
                    autoProcessQueue: false,
                    dictDefaultMessage: "Research group logo (.png)",
                    addRemoveLinks: true,
                    acceptedFiles: ['image/png'].join(',')
                } : null;
            },
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
        }, 

        methods: {
            updateLogoImage() {
                if (this.$refs.researchGroupLogo.getQueuedFiles().length) {
                    this.isUploadingLogo = true;
                    this.$refs.researchGroupLogo.processQueue();
                }
            },

            logoUploadSuccess(file, response) {
                this.$refs.researchGroupLogo.removeAllFiles();
                this.isUploadingLogo = false;
                this.$store.dispatch('layout/setSuccess', { message: "Logo has been updated successfully ! Refresh the page please" });
            },

            logoUploadError(file, message, xhr) {
                console.log(message);
                this.$refs.researchGroupLogo.removeAllFiles();
                this.isUploadingLogo = false;
                this.$store.dispatch('layout/setError', { message: "Sorry, an error occurred while uploading logo image, please try again later" });
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
