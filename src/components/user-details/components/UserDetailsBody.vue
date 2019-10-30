<template>
    <div>
        <div>
        <!-- ### START User Profile Details Section ### -->
            <div class="user-profile-info-container spinner-container">
                <v-progress-circular class="section-spinner"
                    v-if="isLoadingUserAccount || isLoadingUserProfile"
                    indeterminate color="primary"
                ></v-progress-circular>

                <div v-if="isLoadingUserAccount === false && isLoadingUserProfile === false" class="row">
                    <v-avatar size="160px" class="user-avatar" 
                            v-on:mouseover="onAvatarMouseOver"
                            v-on:mouseout="onAvatarMouseOut">
                        <img v-if="userInfo.profile" v-bind:src="userInfo.profile.avatar | avatarSrc(160, 160, false)" />
                        
                        <v-gravatar v-if="!userInfo.profile && userInfo.account" :email="userInfo.account.name + '@deip.world'" />
                        
                        <vue-dropzone v-if="dropzoneOptions" v-show="avatarUploadIsShown" ref="avatar-upload" id="avatar-dropzone" 
                            :options="dropzoneOptions"
                            @vdropzone-success="avatarUploadSuccess"
                            @vdropzone-error="avatarUploadError">
                        </vue-dropzone>
                    </v-avatar>

                    <div class="legacy-col-grow c-pl-12">
                        <div class="display-1 half-bold c-pt-4">{{userInfo | fullname}} <span v-if="(userInfo.profile && userInfo.profile.firstName)" class="caption username-caption grey--text">({{userInfo.account.name}})</span></div>

                        <div class="c-pt-4">
                            <div v-if="userInfo.profile">
                                <div v-if="!isEditingLocation" class="row half-bold">
                                    <span v-if="isOwner && !isLocationSpecified" class="owner-hint c-mt-1">
                                        <v-icon small>location_on</v-icon>
                                        Add location info
                                    </span>
                                    <span v-else class="c-mt-1">
                                        <v-icon v-if="isLocationSpecified" small>location_on</v-icon>
                                        {{locationString}}
                                    </span>
                                    <v-tooltip v-if="isOwner && !isEditingLocation" bottom>
                                        <v-btn slot="activator" @click="editLocation" flat small icon color="grey" class="mt-0">
                                            <v-icon small>mode_edit</v-icon>
                                        </v-btn>
                                        <span>Edit Location</span>
                                    </v-tooltip>
                                </div>
                                <div class="row" v-if="isOwner && isEditingLocation">
                                    <v-text-field class="col-3 c-pr-3" v-model="editedCity" label="City"></v-text-field>
                                    <v-text-field class="col-3 c-pr-3" v-model="editedCountry" label="Country"></v-text-field>
                                    <span class="col-3">
                                        <v-tooltip bottom>
                                            <v-btn slot="activator" @click="saveLocation" flat icon color="grey" class="c-mt-5">
                                                <v-icon>done</v-icon>
                                            </v-btn>
                                            <span>Save</span>
                                        </v-tooltip>
                                        <v-tooltip bottom>
                                            <v-btn slot="activator" @click="isEditingLocation = false" flat icon color="grey" class="c-mt-5">
                                                <v-icon>close</v-icon>
                                            </v-btn>
                                            <span>Cancel</span>
                                        </v-tooltip>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- display either the current employment or education, todo: add isActive flag to employment/education -->
                        <div v-if="isProfileAvailable" class="c-pt-2">
                            <v-icon small class="c-pr-1" v-if="getEmploymentOrEducation(userInfo)">school</v-icon>
                            {{ userInfo | employmentOrEducation}}
                        </div>
                    </div>
                </div>

                <div class="c-pt-8">
                    <div v-if="!isEditingBio && userInfo.profile" class="row">
                        <span v-if="isOwner && !userInfo.profile.bio" class="half-bold owner-hint col-12">
                            <v-icon small>subject</v-icon>
                            Add short bio
                        </span>
                        <span v-else class="col-12">{{userInfo.profile.bio}}</span>
                        <v-tooltip v-if="isOwner && !isEditingBio" bottom class="col-12 right">
                            <v-btn slot="activator" @click="editBio" flat small icon color="grey" class="ma-0 right">
                                <v-icon small>mode_edit</v-icon>
                            </v-btn>
                            <span>Edit Bio</span>
                        </v-tooltip>
                    </div>
    
                    <div v-if="isOwner && isEditingBio" class="row">
                        <v-textarea class="col-12" v-model="editedBio" label="Short Bio"></v-textarea>
                        <span class="col-12">
                            <v-tooltip bottom>
                                <v-btn slot="activator" @click="isEditingBio = false" flat icon color="grey" class="ma-0 mr-3 right">
                                    <v-icon>close</v-icon>
                                </v-btn>
                                <span>Cancel</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <v-btn slot="activator" @click="saveBio" flat icon color="grey" class="ma-0 mr-3 right">
                                    <v-icon>done</v-icon>
                                </v-btn>
                                <span>Save</span>
                            </v-tooltip>
                        </span>
                    </div>
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

                    <div class="c-pt-7">
                        <state-research-list
                            :research-list="researchList"
                            :header-text="'Research projects'"
                        ></state-research-list>
                    </div>

                    <div class="c-pt-8" v-if="commonGroups.length">
                        <div class="title">Research groups: {{ commonGroups.length }}</div>
                    </div>

                    <v-card class="c-mt-6">
                        <template v-for="group in commonGroups" :class="[{'personal-group': group.is_personal}]">
                            <div class="c-p-6">
                                <router-link v-if="group.is_personal" :to="'/' + encodeURIComponent(group.permlink) + '/group-details'" class="research-group-title">
                                    {{userInfo | fullname}}
                                    <span class="grey--text caption">(personal group)</span>
                                </router-link>
                                
                                <router-link v-if="!group.is_personal" :to="'/' + encodeURIComponent(group.permlink) + '/group-details'" class="research-group-title">
                                    {{group.name}}
                                    <div class="caption grey--text c-pt-2 hidden-last-child">
                                        <template v-for="share in group.shares">
                                            <span>{{ share.owner }}</span>
                                            <span> · </span>
                                        </template>
                                    </div>
                                </router-link>
                            </div>
                            <v-divider></v-divider>
                        </template>

                        <div v-if="isOwner" class="c-pv-4 c-ph-6">
                            <v-btn class="ma-0" outline icon color="primary" :to="{ name: 'CreateResearchGroup' }">
                                <v-icon small>add</v-icon>
                            </v-btn>

                            <span class="c-pl-2 deip-blue-color">Add group</span>
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
                    <div v-if="isProfileAvailable && (isEducationSpecified || isOwner)" class="c-pt-8">
                        <div class="title">Education</div>
                        <v-card class="c-mt-6" v-if="userInfo && userInfo.profile">
                            <div v-for="(item, index) in userInfo.profile.education">
                                <div v-if="isOwner" class="right c-mt-7 c-mr-5">
                                    <v-btn class="c-mr-2 c-ml-2" @click="showSaveEducationDialog(item, index)" 
                                        outline small depressed color="primary lighten-1">
                                        Edit
                                    </v-btn>
                                    <v-btn class="c-mr-2 c-ml-2" @click="showDeleteEducationDialog(item, index)" 
                                        outline small depressed color="red lighten-1">
                                        Delete
                                    </v-btn>
                                </div>
                                <div class="c-p-6">
                                    <div class="subheading half-bold">{{item.educationalInstitution}}</div>
                                    <div class="">{{item.degree}}</div>
                                </div>
                                <v-divider></v-divider>
                            </div>
                            <div v-if="isOwner" class="c-pv-4 c-ph-6">
                                <v-btn class="ma-0" @click="showSaveEducationDialog(null, -1)" outline icon color="primary">
                                    <v-icon small>add</v-icon>
                                </v-btn>
                                <span class="c-pl-2 deip-blue-color">Add education institutions</span>
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
                        <div class="c-pt-8">
                            <div class="title">Employment</div>
                        </div>
                        <v-card class="c-mt-6" v-if="userInfo && userInfo.profile">
                            <div v-for="(item, index) in userInfo.profile.employment">
                                <div v-if="isOwner" class="right c-mt-7 c-mr-5">
                                    <v-btn class="c-mr-2 c-ml-2" @click="showSaveEmploymentDialog(item, index)" 
                                        outline small depressed color="primary lighten-1">
                                        Edit
                                    </v-btn>
                                    <v-btn class="c-mr-2 c-ml-2" @click="showDeleteEmploymentDialog(item, index)" 
                                        outline small depressed color="red lighten-1">
                                        Delete
                                    </v-btn>
                                </div>
                                <div class="c-p-6">
                                    <div class="subheading half-bold">{{item.company}}</div>
                                    <div class="">{{item.position}}</div>
                                </div>
                                <v-divider></v-divider>
                            </div>
                            <div v-if="isOwner" class="c-pv-4 c-ph-6">
                                <v-btn class="ma-0" @click="showSaveEmploymentDialog(null, -1)" outline icon color="primary">
                                    <v-icon small>add</v-icon>
                                </v-btn>
                                <span class="c-pl-2 deip-blue-color">Add employment</span>
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
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import usersService from './../../../services/http/users'
    import vueDropzone from 'vue2-dropzone';
    import {getAccessToken} from './../../../utils/auth';
    import expertiseClaimsService from '../../../services/http/expertiseClaims.js';
    import deipRpc from '@deip/deip-rpc-client';

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

                editedBio: "",
                isEditingBio: false,

                editedCity: "",
                editedCountry: "",
                isEditingLocation: false,

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
                        url: `${window.env.DEIP_SERVER_URL}/api/files/upload-avatar`,
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

            editBio() {
                this.editedBio = this.userInfo.profile.bio; 
                this.isEditingBio = !this.isEditingBio;
            },

            saveBio() {
                const update = Object.assign({}, this.userInfo.profile, { bio: this.editedBio });
                usersService.updateUserProfile(this.currentUser.username, update)
                    .then((res) => {
                        this.$store.dispatch('userDetails/loadUserProfile', {username: this.currentUser.username});
                        this.$store.dispatch('layout/setSuccess', {
                            message: `"Short bio has been saved successfully!"`
                        });
                    }, (err) => {
                        this.$store.dispatch('layout/setError', {
                            message: `An error occurred while saving short bio, please try again later`
                        });
                        console.log(err);
                    }).finally(() => {
                        this.isEditingBio = false;
                    })
            },

            editLocation() {
                this.editedCity = this.userInfo.profile && this.userInfo.profile.location ? this.userInfo.profile.location.city : undefined;
                this.editedCountry = this.userInfo.profile && this.userInfo.profile.location ? this.userInfo.profile.location.country : undefined;
                this.isEditingLocation = !this.isEditingLocation;
            },

            saveLocation(){
                const update = Object.assign({}, this.userInfo.profile, { location: {city: this.editedCity, country: this.editedCountry} });
                usersService.updateUserProfile(this.currentUser.username, update)
                    .then((res) => {
                        this.$store.dispatch('userDetails/loadUserProfile', {username: this.currentUser.username});
                        this.$store.dispatch('layout/setSuccess', {
                            message: `"Location info has been saved successfully!"`
                        });
                    }, (err) => {
                        this.$store.dispatch('layout/setError', {
                            message: `An error occurred while saving location info, please try again later`
                        });
                        console.log(err);
                    }).finally(() => {
                        this.isEditingLocation = false;
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
        color: #2F80ED;
        font-weight: 500;
        text-decoration: none;
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
