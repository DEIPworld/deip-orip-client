<template>
    <div>
    <!--<v-btn color="primary" block class="ma-0">
            Profile settings
        </v-btn> -->

        <div class="sm-title bold">Expertise</div>

        <div class="c-pt-4 c-pb-6">
            <div class="row justify-between" v-for="(item, i) in expertise" :key="i">
                <div class="half-bold">{{ item.discipline_name }}</div>
                <div>{{ item.amount }}</div>
            </div>
        </div>

        <div style="margin: 0 -24px">
            <v-divider></v-divider>
            <div class="row-nowrap">
                <div class="col-6 c-pv-6 display-flex" v-ripple>
                    <div class="clickable-label text-align-center c-m-auto">23<br>Folowers</div>
                </div>
                <div class="vertical-devider"></div>
                <div class="col-6 c-pv-6 display-flex" v-ripple>
                    <div class="clickable-label text-align-center c-m-auto">4<br>Following</div>
                </div>
            </div>
            <v-divider></v-divider>
        </div>

        <!-- Contacts Info -->
        <div class="sm-title bold c-pt-4" v-if="isContactsInfoSpecified || isOwner">
            <span class="row">
                <span class="col-11 mt-1">Contacts Info</span>
                <v-tooltip v-if="isOwner && !isEditingContacts" bottom class="col-1">
                    <v-btn slot="activator" @click="editContacts" flat small icon color="grey" class="mt-0">
                        <v-icon small>mode_edit</v-icon>
                    </v-btn>
                    <span>Edit Contacts</span>
                </v-tooltip>
            </span>
        </div>
        <div class="c-pt-2 c-pb-6 pos-relative" v-if="isContactsInfoSpecified || isOwner">
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

        <div style="margin: 0 -24px" v-if="isContactsInfoSpecified || isOwner">
            <v-divider></v-divider>
        </div>


        <!-- Personal Info -->
        <div class="sm-title bold c-pt-6" v-if="isPersonalInfoSpecified || isOwner">
            <span class="row">
                <span class="col-11 mt-1">Personal Info</span>
                <v-tooltip v-if="isOwner && !isEditingPersonalInfo" bottom class="col-1">
                    <v-btn slot="activator" @click="editPersonalInfo" flat small icon color="grey" class="mt-0">
                        <v-icon small>mode_edit</v-icon>
                    </v-btn>
                    <span>Edit Personal Info</span>
                </v-tooltip>
            </span>
        </div>

        <div class="c-pt-4 c-pb-6" v-if="isPersonalInfoSpecified || isOwner">
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
        
        <div style="margin: 0 -24px" v-if="isPersonalInfoSpecified || isOwner">
            <v-divider></v-divider>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import usersService from './../../../../services/users'
    import moment from 'moment';

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
                isEditingPersonalInfo: false
            };
        },
        computed: {
            ...mapGetters({
                currentUser: 'auth/user',
                userInfo: 'userDetails/userInfo',
                expertise: 'userDetails/expertise',
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
                        this.$store.dispatch('userDetails/loadUserProfile', this.currentUser.username);
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
                        this.$store.dispatch('userDetails/loadUserProfile', this.currentUser.username);
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
    .vertical-devider {
        background-color: rgba(0,0,0,0.12);
        width: 1px;
        margin: 12px 0;
    }
    .owner-hint {
        font-style: italic;
    }
</style>
