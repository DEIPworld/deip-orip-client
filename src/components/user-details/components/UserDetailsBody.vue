<template>
    <v-card class="pa-5 elevation-0">
        <div>
        <!-- ### START User Profile Details Section ### -->
            <div class="user-profile-info-container spinner-container">
                <v-progress-circular class="section-spinner"
                    v-if="isLoadingUserAccount || isLoadingUserProfile"
                    indeterminate color="primary"
                ></v-progress-circular>

                <v-layout row wrap v-if="isLoadingUserAccount === false && isLoadingUserProfile === false">
                    <v-avatar size="160px" class="user-avatar mr-5" 
                            v-on:mouseover="onAvatarMouseOver"
                            v-on:mouseout="onAvatarMouseOut">
                        <img v-if="userInfo.profile" v-bind:src="userInfo.profile | avatarSrc(320, 320, false)" />
                        
                        <v-gravatar v-if="!userInfo.profile && userInfo.account" :email="userInfo.account.name + '@deip.world'" />
                        
                        <vue-dropzone v-if="dropzoneOptions" v-show="avatarUploadIsShown" ref="avatar-upload" id="avatar-dropzone" 
                            :options="dropzoneOptions"
                            @vdropzone-success="avatarUploadSuccess"
                            @vdropzone-error="avatarUploadError">
                        </vue-dropzone>
                    </v-avatar>

                    <v-flex xs12 sm8>
                        <div class="display-1 font-weight-medium pt-3">{{userInfo | fullname}} <span v-if="(userInfo.profile && userInfo.profile.firstName)" class="caption username-caption grey--text">({{userInfo.account.name}})</span>
                            <v-btn
                                v-if="isOwner"
                                class="my-0 mr-0 ml-2"
                                small
                                outline
                                color="grey"
                                :to="{
                                name: 'UserSettings',
                                params: {
                                    account_name: currentUser.username
                                    }
                                }"
                            >Edit profile</v-btn>
                        </div>

                        <div class="pt-3">
                            <div v-if="userInfo.profile">
                                <v-layout row font-weight-medium>
                                    <span v-if="isOwner && !isLocationSpecified" class="owner-hint mt-1">
                                        <v-icon small>location_on</v-icon>
                                        Add location info
                                    </span>
                                    <span v-else class="mt-1">
                                        <v-icon v-if="isLocationSpecified" small>location_on</v-icon>
                                        {{locationString}}
                                    </span>
                                </v-layout>
                            </div>
                        </div>

                        <!-- display either the current employment or education, todo: add isActive flag to employment/education -->
                        <div v-if="isProfileAvailable" class="pt-2">
                            <v-icon small class="pr-1" v-if="getEmploymentOrEducation(userInfo)">school</v-icon>
                            {{ userInfo | employmentOrEducation}}
                        </div>
                    </v-flex>
                </v-layout>

                <div class="pt-4">
                    <v-layout row v-if="userInfo.profile">
                        <v-flex xs12 font-weight-medium owner-hint v-if="isOwner && !userInfo.profile.bio">
                            <v-icon small>subject</v-icon>
                            Add short bio
                        </v-flex>
                        <v-flex xs12 v-else>{{userInfo.profile.bio}}</v-flex>
                    </v-layout>
    
                </div>
            </div>
            <!-- ### END User Profile Details Section ### -->

            <!-- ### START User Profile Research Section ### -->
            <div class="user-research-groups-container spinner-container">
                <v-progress-circular class="section-spinner"
                    v-if="isLoadingUserGroups || isLoadingUserResearch"
                    indeterminate color="primary"
                ></v-progress-circular>

                <div v-if="isLoadingUserGroups === false && isLoadingUserResearch === false">

                    <div class="pt-4">
                        <state-research-list
                            :research-list="researchList"
                            :header-text="'Research projects'"
                        ></state-research-list>
                    </div>

                    <div class="pt-4" v-if="commonGroups.length">
                        <div class="title">Research groups: {{ commonGroups.length }}</div>
                    </div>

                    <v-card class="mt-4">
                        <template v-for="(group, i) in commonGroups" :class="[{'personal-group': group.is_personal}]">
                            <div class="pa-4" :key="'group-' + i">
                                <div v-if="group.is_personal">
                                    <router-link class="research-group-title" :to="{ 
                                            name: 'ResearchGroupDetails', 
                                            params: { 
                                                research_group_permlink: encodeURIComponent(group.permlink) } 
                                            }">
                                        {{userInfo | fullname}}
                                    </router-link>
                                    <span class="grey--text caption">(personal group)</span>
                                </div>
                                <div v-else>
                                    <router-link class="research-group-title" :to="{ 
                                        name: 'ResearchGroupDetails', 
                                        params: { 
                                            research_group_permlink: encodeURIComponent(group.permlink) } 
                                        }">
                                        {{group.name}}
                                    </router-link>
                                    <div class="caption grey--text pt-2 hidden-last-child">
                                        <template v-for="share in group.shares">
                                            <span :key="'share-' + share.id">
                                                <span>{{ share.owner }}</span>
                                                <span> · </span>
                                            </span>
                                        </template>
                                    </div>
                                </div>
                            </div>
                            <v-divider :key="'divider-' + i"></v-divider>
                        </template>

                        <div v-if="isOwner" class="py-3 px-4">
                            <v-btn class="ma-0" outline icon color="primary" :to="{ name: 'CreateResearchGroup' }">
                                <v-icon small>add</v-icon>
                            </v-btn>

                            <span class="pl-2">Add group</span>
                        </div>
                    </v-card>
                </div>
            </div>
            <!-- ### END User Profile Research Section ### -->

            <!-- ### START User Profile Education\Employment Section ### -->
            <div class="user-education-employment-container spinner-container">
                <v-progress-circular class="section-spinner"
                    v-if="isLoadingUserAccount || isLoadingUserProfile"
                    indeterminate color="primary"
                ></v-progress-circular>
                
                <div v-if="isLoadingUserAccount === false && isLoadingUserProfile === false">
                    <div v-if="isProfileAvailable && (isEducationSpecified || isOwner)" class="pt-4">
                        <div class="title">Education</div>
                        <v-card class="mt-4" v-if="userInfo && userInfo.profile">
                            <div v-for="(item, index) in userInfo.profile.education">
                                <div v-if="isOwner" class="right mt-4 mr-3">
                                    <v-btn class="mr-2 ml-2" @click="showSaveEducationDialog(item, index)" 
                                        outline small depressed color="primary lighten-1">
                                        Edit
                                    </v-btn>
                                    <v-btn class="mr-2 ml-2" @click="showDeleteEducationDialog(item, index)" 
                                        outline small depressed color="red lighten-1">
                                        Delete
                                    </v-btn>
                                </div>
                                <div class="pa-4">
                                    <div class="subheading font-weight-medium">{{item.educationalInstitution}}</div>
                                    <div class="">{{item.degree}}</div>
                                </div>
                                <v-divider></v-divider>
                            </div>
                            <div v-if="isOwner" class="py-3 px-4">
                                <v-btn class="ma-0" @click="showSaveEducationDialog(null, -1)" outline icon color="primary">
                                    <v-icon small>add</v-icon>
                                </v-btn>
                                <span class="pl-2">Add education institutions</span>
                            </div>
                            <div v-if="isOwner">
                                <user-edit-education-dialog 
                                    :meta="saveEducationMeta"
                                    @saveEducation="saveEducation($event); saveEducationMeta.isShown = false">
                                </user-edit-education-dialog>
                                <confirm-action-dialog
                                    :meta="deleteEducationMeta"
                                    :title="``" :text="`Are you sure you want to delete this entry ?`"
                                    @confirmed="deleteEducation($event); deleteEducationMeta.isShown = false" 
                                    @canceled="deleteEducationMeta.isShown = false">
                                </confirm-action-dialog>
                            </div>
                        </v-card>
                    </div>

                    <div v-if="isProfileAvailable && (isEmploymentSpecified || isOwner)">
                        <div class="pt-4">
                            <div class="title">Employment</div>
                        </div>
                        <v-card class="mt-4" v-if="userInfo && userInfo.profile">
                            <div v-for="(item, index) in userInfo.profile.employment">
                                <div v-if="isOwner" class="right mt-4 mr-3">
                                    <v-btn class="mr-2 ml-2" @click="showSaveEmploymentDialog(item, index)" 
                                        outline small depressed color="primary lighten-1">
                                        Edit
                                    </v-btn>
                                    <v-btn class="mr-2 ml-2" @click="showDeleteEmploymentDialog(item, index)" 
                                        outline small depressed color="red lighten-1">
                                        Delete
                                    </v-btn>
                                </div>
                                <div class="pa-4">
                                    <div class="subheading font-weight-medium">{{item.company}}</div>
                                    <div class="">{{item.position}}</div>
                                </div>
                                <v-divider></v-divider>
                            </div>
                            <div v-if="isOwner" class="py-3 px-4">
                                <v-btn class="ma-0" @click="showSaveEmploymentDialog(null, -1)" outline icon color="primary">
                                    <v-icon small>add</v-icon>
                                </v-btn>
                                <span class="pl-2">Add employment</span>
                            </div>
                            <div v-if="isOwner">
                                <user-edit-employment-dialog 
                                    :meta="saveEmploymentMeta"
                                    @saveEmployment="saveEmployment($event); saveEmploymentMeta.isShown = false">
                                </user-edit-employment-dialog>
                                <confirm-action-dialog
                                    :meta="deleteEmploymentMeta"
                                    :title="``" :text="`Are you sure you want to delete this entry ?`"
                                    @confirmed="deleteEmployment($event); deleteEmploymentMeta.isShown = false" 
                                    @canceled="deleteEmploymentMeta.isShown = false">
                                </confirm-action-dialog>
                            </div>
                        </v-card>
                    </div>
                </div>
            </div>
        </div>
        <!-- ### END User Profile Education\Employment Section ### -->
    </v-card>
</template>

<script>
    import { mapGetters } from 'vuex';
    import usersService from './../../../services/http/users'
    import vueDropzone from 'vue2-dropzone';
    import {getAccessToken} from './../../../utils/auth';
    import expertiseClaimsService from '../../../services/http/expertiseClaims.js';
    import deipRpc from '@deip/deip-oa-rpc-client';

    export default {
        name: 'UserDetailsBody',
        components: {
            vueDropzone
        },
        data() {
            return {
                saveEducationMeta: { isShown: false, item: null, index: null },
                deleteEducationMeta: { isShown: false, item: null, index: null },

                saveEmploymentMeta: { isShown: false, item: null, index: null },
                deleteEmploymentMeta: { isShown: false, item: null, index: null },

                avatarUploadIsShown: false,

                accountName: this.$route.params.account_name,
                fileStorageBaseUrl: window.env.DEIP_SERVER_URL,

                tmpClaimObjects: []
            }
        },
        computed: {
            ...mapGetters({
                currentUser: 'auth/user',
                userInfo: 'userDetails/userInfo',
                groups: 'userDetails/groups',
                researchList: 'userDetails/researchList',

                isLoadingUserAccount: 'userDetails/isLoadingUserAccount',
                isLoadingUserProfile: 'userDetails/isLoadingUserProfile',
                isLoadingUserGroups: 'userDetails/isLoadingUserGroups',
                isLoadingUserResearch: 'userDetails/isLoadingUserResearch'
            }),

            isOwner() {
                return this.currentUser && this.currentUser.username === this.$route.params.account_name
            },
            isLocationSpecified() {
                return this.userInfo && this.userInfo.profile && 
                        this.userInfo.profile.location && (this.userInfo.profile.location.city || this.userInfo.profile.location.country)
            },
            locationString() {
                const profile = this.userInfo ? this.userInfo.profile : null;
                let location = "";
                if (profile){
                    location += profile.location.city ? profile.location.city : '';
                    location += profile.location.city && profile.location.country ? ', ' : '';
                    location += profile.location.country ? profile.location.country : '';
                }
                return location;
            },
            isEducationSpecified() {
                return this.userInfo && this.userInfo.profile && this.userInfo.profile.education.length;
            },
            isEmploymentSpecified() {
                return this.userInfo && this.userInfo.profile && this.userInfo.profile.employment.length;
            },
            commonGroups() {
                return this.groups.slice().sort(g => g.is_personal ? -1 : 1);
            },
            dropzoneOptions() {
                return this.currentUser != null ? {
                        url: `${window.env.DEIP_SERVER_URL}/api/user/upload-avatar`,
                        paramName: "user-avatar",
                        headers: {
                            "username": this.currentUser.username.toString(),
                            "Authorization": 'Bearer ' + getAccessToken()
                        },
                        timeout: 0,
                        uploadMultiple: false,
                        createImageThumbnails: false,
                        previewsContainer: false,
                        dictDefaultMessage: "",
                        acceptedFiles: ['image/png', 'image/jpeg'].join(',')
                    } : null;
            },

            isProfileAvailable() {
                return this.userInfo.profile != null;
            }

        },
        methods: {
            showSaveEducationDialog(item, index) {
                this.saveEducationMeta.item = item;
                this.saveEducationMeta.index = index;
                this.saveEducationMeta.isShown = true;
            },
            showDeleteEducationDialog(item, index) {
                this.deleteEducationMeta.item = item;
                this.deleteEducationMeta.index = index;
                this.deleteEducationMeta.isShown = true;
            },
            saveEducation({item, index}) {
                const update = {};
                if (index === -1) { // new education
                    const educationList = this.userInfo.profile.education.map(e => e).concat([item]);
                    Object.assign(update, this.userInfo.profile, { education: educationList });
                } else { // edited education
                    const educationList = this.userInfo.profile.education.reduce(
                        (accum, current, i) => {
                            if (i == index) return accum.concat(item);
                            else return accum.concat(current);
                        }, []);
                    Object.assign(update, this.userInfo.profile, { education: educationList });
                }
                usersService.updateUserProfile(this.currentUser.username, update)
                    .then((res) => {
                        this.$store.dispatch('userDetails/loadUserProfile', {username: this.currentUser.username});
                        this.$store.dispatch('layout/setSuccess', {
                            message: `"${item.educationalInstitution}" Institute has been saved successfully!"`
                        });
                    }, (err) => {
                        this.$store.dispatch('layout/setError', {
                            message: `An error occurred while saving "${item.educationalInstitution}" details, please try again later`
                        });
                        console.log(err);
                    })
            },
            deleteEducation({item, index}) {
                const educationList = this.userInfo.profile.education.reduce(
                    (accum, current, i) => {
                        if (i == index) return accum;
                        else return accum.concat(current);
                    }, []);

                const update = Object.assign({}, this.userInfo.profile, { education: educationList });
                
                usersService.updateUserProfile(this.currentUser.username, update)
                    .then((res) => {
                        this.$store.dispatch('userDetails/loadUserProfile', {username: this.currentUser.username});
                        this.$store.dispatch('layout/setSuccess', {
                            message: `"${item.educationalInstitution}" Institute has been deleted successfully!"`
                        });
                    }, (err) => {
                        this.$store.dispatch('layout/setError', {
                            message: `An error occurred while deleting "${item.educationalInstitution}" details, please try again later`
                        });
                        console.log(err);
                    })
            },

            showSaveEmploymentDialog(item, index) {
                this.saveEmploymentMeta.item = item;
                this.saveEmploymentMeta.index = index;
                this.saveEmploymentMeta.isShown = true;
            },
            showDeleteEmploymentDialog(item, index) {
                this.deleteEmploymentMeta.item = item;
                this.deleteEmploymentMeta.index = index;
                this.deleteEmploymentMeta.isShown = true;
            },

            saveEmployment({item, index}) {
                const update = {};
                if (index === -1) { // new education
                    const employmentList = this.userInfo.profile.employment.map(e => e).concat([item]);
                    Object.assign(update, this.userInfo.profile, { employment: employmentList });
                } else { // edited education
                    const employmentList = this.userInfo.profile.employment.reduce(
                        (accum, current, i) => {
                            if (i == index) return accum.concat(item);
                            else return accum.concat(current);
                        }, []);
                    Object.assign(update, this.userInfo.profile, { employment: employmentList });
                }
                usersService.updateUserProfile(this.currentUser.username, update)
                    .then((res) => {
                        this.$store.dispatch('userDetails/loadUserProfile', {username: this.currentUser.username});
                        this.$store.dispatch('layout/setSuccess', {
                            message: `"${item.company}" employment has been saved successfully!"`
                        });
                    }, (err) => {
                        this.$store.dispatch('layout/setError', {
                            message: `An error occurred while saving "${item.company}" details, please try again later`
                        });
                        console.log(err);
                    })
            },

            deleteEmployment({item, index}) {
                const employmentList = this.userInfo.profile.employment.reduce(
                    (accum, current, i) => {
                        if (i == index) return accum;
                        else return accum.concat(current);
                    }, []);

                const update = Object.assign({}, this.userInfo.profile, { employment: employmentList });
                
                usersService.updateUserProfile(this.currentUser.username, update)
                    .then((res) => {
                        this.$store.dispatch('userDetails/loadUserProfile', {username: this.currentUser.username});
                        this.$store.dispatch('layout/setSuccess', {
                            message: `"${item.company}" employment has been deleted successfully!"`
                        });
                    }, (err) => {
                        this.$store.dispatch('layout/setError', {
                            message: `An error occurred while deleting "${item.company}" employment details, please try again later`
                        });
                        console.log(err);
                    })
            },

            onAvatarMouseOver() {
                if (this.currentUser.username == this.userInfo.account.name){
                    this.avatarUploadIsShown = true
                }
            },
            onAvatarMouseOut() {
                this.avatarUploadIsShown = false;
            },

            avatarUploadSuccess(file, response) {
                this.$store.dispatch('userDetails/loadUserProfile', {username: this.currentUser.username})
                this.$store.dispatch('layout/setSuccess', {
                    message: "Avatar has been changed successfully !"
                });

            },

            avatarUploadError(file, message, xhr) {
                this.$store.dispatch('layout/setError', {
                    message: "Sorry, an error occurred while uploading avatar, please try again later"
                });
                console.log(message);
            },

            getEmploymentOrEducation(user) {
                return this.$options.filters.employmentOrEducation(user)
            },

            openClaimExpertiseDialog() {
                this.$store.dispatch('userDetails/openExpertiseTokensClaimDialog')
            },
            closeClaimExpertiseDialog() {
                this.$store.dispatch('userDetails/closeExpertiseTokensClaimDialog')
            }
        },

        created() {
        }
    }
</script>

<style lang="less" scoped>

    .user-avatar {
        position: relative
    }

    #avatar-dropzone {
        background: #9e978e;
        background-color: rgba(29,32,34,.7);
        display: inline-block;
        margin: 0 1em 1em 0;
        position: absolute;
        height: 80px;
        width: 160px;
        border-bottom-left-radius: 90px;
        border-bottom-right-radius: 90px;
        border: 0.5px solid rgba(29, 32, 34, 0.7);
        bottom: -15px;
        min-height: 0 !important;
    }

    #avatar-dropzone:before {
        content: "⇪";
        font-size: 30px;
        position: absolute;
        top: 15px;
        right: 62px;
    }


    .research-group-title {
        font-size: 16px;
        color: var(--v-primary-base);
        font-weight: 500;
        text-decoration: none;
        &:hover {
            text-decoration: underline;
        }
        
    }

    .owner-hint {
        font-style: italic;
    }

    .username-caption {
        font-size: 14px !important;
    }

    .user-profile-info-container {
        min-height: 200px
    }

    .user-education-employment-container {
         min-height: 100px
    }

    .personal-group {
        margin-bottom: 20px;
    }

</style>
