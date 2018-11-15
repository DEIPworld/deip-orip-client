<template>
    <div class="user-profile-sidebar-container">
      <sidebar-loader v-if="isLoadingUserProfilePage"></sidebar-loader>
      <div v-if="isLoadingUserProfilePage === false">

        <!-- ### START User Profile Expertise Section ### -->
        <div>
            <div class="sm-title bold">Expertise Tokens</div>
            <div class="c-pt-4 c-pb-6">
                <div class="row justify-between" v-for="(item, i) in expertise" :key="i">
                    <div class="half-bold">{{ item.discipline_name }}</div>
                    <div>{{ item.amount }}</div>
                </div>
                <div v-if="!expertise.length" class="body-1"> 
                    <div v-if="isOwner">You have no expertise tokens yet. Use <span class="a" @click="openClaimExpertiseDialog()">Claim</span> process to apply for Expertise Tokens</div>
                    <div v-if="!isOwner"><span class="body-2">{{userInfo | fullname}}</span> has no expertise tokens yet</div>
                </div>
            </div>
        </div>
        <!-- ### END User Profile Expertise Section ### -->

    <!--    <sidebar-splitted-btn>
            <div slot="left" class="default-half-splitted">
                <span class="c-m-auto clickable-label">23<br>Followers</span>
            </div>

            <div slot="right" class="default-half-splitted">
                <span class="c-m-auto clickable-label">4<br>Following</span>
            </div>
        </sidebar-splitted-btn> -->


        <!-- ### START User Profile Contacts Section ### -->
        <div class="c-mt-4" v-if="isProfileAvailable && (isContactsInfoSpecified || isOwner)">
            <div class="sidebar-fullwidth"><v-divider></v-divider></div>
            <div class="subheading bold c-mt-4">
                <span class="row">
                    <span class="col-11 mt-1">Contacts info</span>
                    <v-tooltip v-if="isOwner && !isEditingContacts" bottom class="col-1">
                        <v-btn slot="activator" @click="editContacts" flat small icon color="grey" class="mt-0">
                            <v-icon small>mode_edit</v-icon>
                        </v-btn>
                        <span>Edit Contacts</span>
                    </v-tooltip>
                </span>
            </div>
            <div class="c-pt-2 c-pb-6 pos-relative">
                <div v-if="userInfo.profile">
                    <div v-if="!isEditingContacts">
                        <span v-if="isOwner && !userInfo.profile.email" class="owner-hint">
                            <v-icon size="18" class="c-mr-2">mail</v-icon>
                            Add your email here
                        </span>
                        <span v-else>
                            <v-icon v-if="userInfo.profile.email" size="18" class="c-mr-2">mail</v-icon>
                            {{userInfo.profile.email || '-'}}
                        </span>
                <!-- Phone number is very private info, let's do not store it for now -->
                <!--<div class="c-pt-1">
                    <v-icon size="18" class="c-mr-2">phone</v-icon>
                        +375 25 90 05 003
                    </div> -->
                    </div>
                </div>
                <div v-if="isOwner && isEditingContacts">
                    <v-text-field v-model="editedEmail" label="Email" append-icon="email"></v-text-field>
                    <div class="text-align-center">
                        <v-tooltip bottom>
                            <v-btn slot="activator" @click="saveContacts" flat icon color="grey">
                                <v-icon>done</v-icon>
                            </v-btn>
                            <span>Save</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <v-btn slot="activator" @click="isEditingContacts = false" flat icon color="grey">
                                <v-icon>close</v-icon>
                            </v-btn>
                            <span>Cancel</span>
                        </v-tooltip>
                    </div>
                </div>
            </div>
        </div>
        <!-- ### END User Profile Contacts Section ### -->


        <!-- ### START User Profile Info Section ### -->
        <div class="c-mt-4" v-if="isProfileAvailable && (isPersonalInfoSpecified || isOwner)">
            <div class="sidebar-fullwidth"><v-divider></v-divider></div>
            <div class="subheading bold c-mt-4">
                <span class="row">
                    <span class="col-11 mt-1">Personal info</span>
                    <v-tooltip v-if="isOwner && !isEditingPersonalInfo" bottom class="col-1">
                        <v-btn slot="activator" @click="editPersonalInfo" flat small icon color="grey" class="mt-0">
                            <v-icon small>mode_edit</v-icon>
                        </v-btn>
                        <span>Edit personal info</span>
                    </v-tooltip>
                </span>
            </div>

            <div class="c-pt-4 c-pb-6">
                <div v-if="userInfo.profile">
                    <div v-if="!isEditingPersonalInfo">
                        <div v-if="isOwner && !userInfo.profile.firstName" class="row">
                            <span class="col-4 half-bold">First Name</span>
                            <span class="col-8 text-align-right owner-hint">add first name</span>
                        </div>
                        <div v-else class="row">
                            <span class="col-7 half-bold">First Name</span>
                            <span class="col-5 text-align-left">{{userInfo.profile.firstName || '-'}}</span>
                        </div>

                        <div v-if="isOwner && !userInfo.profile.lastName" class="row">
                            <span class="col-4 half-bold">Last Name</span>
                            <span class="col-8 text-align-right owner-hint">add last name</span>
                        </div>
                        <div v-else class="row">
                            <span class="col-7 half-bold">Last Name</span>
                            <span class="col-5 text-align-left">{{userInfo.profile.lastName || '-'}}</span>
                        </div>

                        <div v-if="isOwner && !userInfo.profile.birthday" class="row">
                            <span class="col-4 half-bold">Birthday</span>
                            <span class="col-8 text-align-right owner-hint">add birthday</span>
                        </div>
                        <div v-else class="row">
                            <span class="col-4 half-bold">Birthday</span>
                            <span class="col-8 text-align-right">{{ userInfo.profile.birthday ? new Date(userInfo.profile.birthday).toDateString() : '-'}}</span>
                        </div>

                        <div v-if="userInfo.profile.created" class="row mt-3">
                            <span class="col-4 half-bold">Registered</span>
                            <span class="col-8 text-align-right">{{new Date(userInfo.profile.created).toDateString()}}</span>
                        </div>
                    </div>
                </div>
                <div v-if="isOwner && isEditingPersonalInfo">
                    <v-text-field v-model="editedFirstName" label="First name"></v-text-field>
                    <v-text-field v-model="editedLastName" label="Last name"></v-text-field>
                    <v-menu lazy :close-on-content-click="false" v-model="editedBirthdayMenu" transition="scale-transition" offset-y full-width min-width="290px">
                        <v-text-field slot="activator" label="Birthday" v-model="editedBirthdayDate" append-icon="event" readonly></v-text-field>
                        <v-date-picker v-model="editedBirthdayDate" @input="editedBirthdayMenu = false"></v-date-picker>
                    </v-menu>

                    <div class="text-align-center">
                        <v-tooltip bottom>
                            <v-btn slot="activator" @click="savePersonalInfo" flat icon color="grey">
                                <v-icon>done</v-icon>
                            </v-btn>
                            <span>Save</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <v-btn slot="activator" @click="isEditingPersonalInfo = false" flat icon color="grey">
                                <v-icon>close</v-icon>
                            </v-btn>
                            <span>Cancel</span>
                        </v-tooltip>
                    </div>
                </div>
            </div>
        </div>
        <!-- ### END User Profile Info Section ### -->


        <!-- ### START User Profile Invites Section ### -->
        <div v-if="isOwner && hasInvites" id="invites" class="c-mt-4">
            <div class="sidebar-fullwidth"><v-divider></v-divider></div>
            <div class="subheading bold c-pt-4">Invites: {{invites.length}}</div>
            <div class="c-pb-6">
                <div v-for="(invite, index) in invites" class="row-nowrap justify-between align-center c-pt-4">
                    <div class="left">
                        <router-link :to="`/${invite.group.permlink}/group-details`" style="text-decoration: none">
                            <span class="a">{{invite.group.name}}</span>
                        </router-link>
                        <span class="c-pl-1">({{convertToPercent(invite.research_group_token_amount)}}%)</span>
                    </div>
                    <div class="right">
                        <v-tooltip bottom>
                            <v-btn slot="activator" @click="approveInvite(invite)"  
                                :disabled="isApprovingInvite" :loading="isApprovingInvite" small flat icon color="grey" class="ma-0">
                                <v-icon>done</v-icon>
                            </v-btn>
                            <span>Accept</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <v-btn slot="activator" @click="showRejectInviteDialog(invite)" 
                                :disabled="isRejectingInvite" :loading="isRejectingInvite" small flat icon color="grey" class="ma-0">
                                <v-icon>close</v-icon>
                            </v-btn>
                            <span>Reject</span>
                        </v-tooltip>
                    </div>
                </div>
                <confirm-action-dialog
                    :meta="rejectInviteMeta"
                    :title="``" :text="`Are you sure you want to reject this invite ?`"
                    @confirmed="rejectInviteMeta.isShown = false; rejectInvite(rejectInviteMeta.item);" 
                    @canceled="rejectInviteMeta.isShown = false">
                </confirm-action-dialog>
            </div>
        </div>
        <!-- ### END User Profile Invites Section ### -->
      </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import usersService from './../../../services/http/users'
    import { approveInvite, rejectInvite } from './../../../services/InvitesService'
    import moment from 'moment';
    import deipRpc from '@deip/deip-rpc-client';

    export default {
        name: "UserDetailsSidebar",
        data() {
            return {
                editedEmail: "",
                isEditingContacts: false,
                
                editedFirstName: "",
                editedLastName: "",
                editedBirthdayDate: null,
                editedBirthdayMenu: false,
                editedRegisteredDate: null,
                isEditingPersonalInfo: false,

                isApprovingInvite: false,
                isRejectingInvite: false,
                rejectInviteMeta: { isShown: false, item: null, index: null }
            };
        },
        computed: {
            ...mapGetters({
                currentUser: 'auth/user',
                userInfo: 'userDetails/userInfo',
                expertise: 'userDetails/expertise',
                invites: 'userDetails/invites',
                isLoadingUserProfilePage:'userDetails/isLoadingUserProfilePage'
            }),
            isOwner() {
                return this.currentUser && this.currentUser.username === this.$route.params.account_name
            },
            isContactsInfoSpecified() {
                return this.userInfo && this.userInfo.profile && this.userInfo.profile.email;
            },
            isPersonalInfoSpecified() {
                return this.userInfo && this.userInfo.profile && 
                    (this.userInfo.profile.firstName || this.userInfo.profile.lastName || this.userInfo.profile.birthday);
            },
            isProfileAvailable() {
                return this.userInfo.profile != null;
            },
            hasInvites() {
                return this.invites.length;
            }
        },
        methods: {
            editContacts() {
                this.editedEmail = this.userInfo.profile.email;
                this.isEditingContacts = !this.isEditingContacts;
            },
            saveContacts() {
                const update = Object.assign({}, this.userInfo.profile, { email: this.editedEmail });
                usersService.updateUserProfile(this.currentUser.username, update)
                    .then((res) => {
                        this.$store.dispatch('userDetails/loadUserProfile', {username: this.currentUser.username});
                        this.$store.dispatch('layout/setSuccess', {
                            message: `"Email has been saved successfully!"`
                        });
                    }, (err) => {
                        this.$store.dispatch('layout/setError', {
                            message: `An error occurred while saving email, please try again later`
                        });
                        console.log(err);
                    }).finally(() => {
                        this.isEditingContacts = false;
                    })
            },

            editPersonalInfo() {
                this.editedFirstName = this.userInfo.profile.firstName;
                this.editedLastName = this.userInfo.profile.lastName;
                this.editedBirthdayDate = this.userInfo.profile.birthday ? moment(this.userInfo.profile.birthday).format('YYYY-MM-DD') : null;
                this.isEditingPersonalInfo = !this.isEditingPersonalInfo;
            },

            savePersonalInfo() {
                const update = Object.assign({}, this.userInfo.profile, { 
                        firstName: this.editedFirstName, 
                        lastName: this.editedLastName, 
                        birthday: this.editedBirthdayDate 
                });
                usersService.updateUserProfile(this.currentUser.username, update)
                    .then((res) => {
                        this.$store.dispatch('userDetails/loadUserProfile', {username: this.currentUser.username});
                        this.$store.dispatch('layout/setSuccess', {
                            message: `"Personal info has been saved successfully!"`
                        });
                    }, (err) => {
                        this.$store.dispatch('layout/setError', {
                            message: `An error occurred while saving personal info, please try again later`
                        });
                        console.log(err);
                    }).finally(() => {
                        this.isEditingPersonalInfo = false;
                    })
            },

            approveInvite(invite) {
                this.isApprovingInvite = true;
                
                approveInvite(
                    invite.id,
                    this.currentUser.username
                ).then(() => {
                    this.$store.dispatch('userDetails/loadUserInvites', {username: this.currentUser.username});
                    this.$store.dispatch('layout/setSuccess', {
                        message: `"Invite has been approved successfully !"`
                    });
                    this.$store.dispatch('auth/loadGroups');
                    
                }, (err) => {
                    this.$store.dispatch('layout/setError', {
                        message: `An error occurred while accepting invite, please try again later`
                    });
                    console.log(err);
                }).finally(() => {
                    this.isApprovingInvite = false;
                })
            },

            showRejectInviteDialog(invite, index) {
                this.rejectInviteMeta.isShown = true;
                this.rejectInviteMeta.item = invite;
                this.rejectInviteMeta.index = index;
            },

            rejectInvite(invite) {
                this.isRejectingInvite = true;

                rejectInvite(
                    invite.id,
                    this.currentUser.username
                ).then(() => {
                    this.$store.dispatch('userDetails/loadUserInvites', { username: this.currentUser.username });
                    this.$store.dispatch('layout/setSuccess', {
                        message: `"Invite has been rejected successfully !"`
                    });
                }, (err) => {
                    this.$store.dispatch('layout/setError', {
                        message: `An error occurred while rejecting invite, please try again later`
                    });
                    console.log(err);
                }).finally(() => {
                    this.isRejectingInvite = false;
                    this.rejectInviteMeta.isShown = false
                })
            },

            openClaimExpertiseDialog() {
                this.$store.dispatch('userDetails/openExpertiseTokensClaimDialog')
            }
        }
    };
</script>

<style lang="less" scoped>
    .corner-edit {
        position: absolute;
        top: 18px;
        right: 10px;
    }
    .owner-hint {
        font-style: italic;
    }
</style>
