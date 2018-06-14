<template>
    <div>
        <div class="row" v-if="userInfo.account">
            <v-avatar size="120px">
                <v-gravatar :title="userInfo.account.name" :email="userInfo.account.name + '@deip.world'" />
            </v-avatar>

            <div class="col-grow c-pl-12">
                <div class="display-1 half-bold c-pt-4">{{ userInfo.account.name }}</div>

                <div class="c-pt-4">
                    <v-icon small>location_on</v-icon>
                    <span class="half-bold"> Minsk, Belarus</span>
                    <span> - 11:43 am local time</span>
                    <v-icon small>mode_edit</v-icon>

                    <!-- <v-btn flat small icon color="grey" class="ma-0">
                        <v-icon small>mode_edit</v-icon>
                    </v-btn> -->
                </div>

                <div class="c-pt-2">Belarusian State University of Informatics and Radioelectronics</div>
            </div>
        </div>

        <div class="c-pt-8">
            Founder of DEIP – decentralized research platform which fairly rewards scientists corresponding to 
            their contribution to global science.
            Alex is blockchain architect and an expert in scalable distributed systems. He had been working as a 
            Chief Technical Officer and a member of the board of directors at Paralect company for 4 years, but decided 
            to leave to focus on most challenging academic problems and try to solve them by applying Blockchain 
            technology and introducing strong economic models, that will maintain protocol of new society.
        </div>

        <div class="c-pt-7">
            <state-research-list
                :research-list="researchList"
                :header-text="'Participation in research'"
            ></state-research-list>
        </div>

        <div class="c-pt-8">
            <div class="title">Research Groups: {{ groups.filter(g => !g.is_personal).length}}</div>
        </div>

        <v-card class="c-mt-6 hidden-last-child">
            <template v-for="group in groups.filter(g => !g.is_personal)">
                <div class="c-p-6">
                    <router-link :to="'/' + group.permlink + '/group-details'" class="research-group-title">{{ group.name }}</router-link>
                    <span v-if="group.is_personal" class="grey--text caption">(personal group)</span>
                        
                    <div class="caption grey--text c-pt-2 hidden-last-child" v-if="!group.is_personal">
                        <template v-for="share in group.shares">
                            <span>{{ share.owner }}</span>
                            <span> · </span>
                        </template>
                    </div>
                </div>

                <v-divider></v-divider>
            </template>
        </v-card>

        <div v-if="userInfo && userInfo.profile && userInfo.profile.education.length" class="c-pt-8">
            <div class="title">Education</div>
        </div>

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
                    <div class="subheading half-bold">{{item.school}}</div>
                    <div class="">{{item.degree}}</div>
                </div>
                <v-divider></v-divider>
            </div>
            <div v-if="isOwner" class="c-pv-4 c-ph-6">
                <v-btn class="ma-0" @click="showSaveEducationDialog(null, -1)" outline icon color="primary">
                    <v-icon small>add</v-icon>
                </v-btn>
                <span class="c-pl-2 deip-blue-color">Add Education Institutions</span>
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


        <div v-if="userInfo && userInfo.profile && userInfo.profile.employment.length" class="c-pt-8">
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
                <span class="c-pl-2 deip-blue-color">Add Employment</span>
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

        <div class="c-pt-12">
            <v-btn @click="getProfile()">GET</v-btn>
            <v-btn @click="createProfile()">CREATE</v-btn>
            <v-btn @click="updateProfile()">UPDATE</v-btn>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import usersService from './../../../../services/users'

    export default {
        name: 'UserDetailsBody',
        data() {
            return {
                saveEducationMeta: { isShown: false, item: null, index: null },
                deleteEducationMeta: { isShown: false, item: null, index: null },

                saveEmploymentMeta: { isShown: false, item: null, index: null },
                deleteEmploymentMeta: { isShown: false, item: null, index: null },

                accountName: this.$route.params.account_name
            }
        },
        computed: {
            ...mapGetters({
                currentUser: 'auth/user',
                userInfo: 'userDetails/userInfo',
                groups: 'userDetails/groups',
                researchList: 'userDetails/researchList',
            }),
            isOwner() {
                return this.currentUser && this.currentUser.username === this.$route.params.account_name
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
                        this.$store.dispatch('userDetails/loadUserProfile', this.currentUser.username);
                        this.$store.dispatch('layout/setSuccess', {
                            message: `"${item.school}" Institute has been saved successfully!"`
                        });
                    }, (err) => {
                        this.$store.dispatch('layout/setError', {
                            message: `An error occurred while saving "${item.school}" details, please try again later`
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
                        this.$store.dispatch('userDetails/loadUserProfile', this.currentUser.username);
                        this.$store.dispatch('layout/setSuccess', {
                            message: `"${item.school}" Institute has been deleted successfully!"`
                        });
                    }, (err) => {
                        this.$store.dispatch('layout/setError', {
                            message: `An error occurred while deleting "${item.school}" details, please try again later`
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
                        this.$store.dispatch('userDetails/loadUserProfile', this.currentUser.username);
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
                        this.$store.dispatch('userDetails/loadUserProfile', this.currentUser.username);
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


            createProfile() {
                 usersService.createUserProfile(this.currentUser.username, {'email': 'vasiliy@vasa.com'})
                    .then((res) => {
                        console.log(res);
                    }, (err) => {
                        console.log(err);
                    })
            },

            getProfile(){
                debugger;
                usersService.getUserProfile(this.currentUser.username)
                    .then((res) => {
                        debugger;
                        console.log(res);
                    }, (err) => {
                        debugger;
                        console.log(err);
                    })
            },

            updateProfile() {
                debugger;
                var educ1 = {
                    "school": "10-я школа",
                    "period": {
                        from: new Date('2002-09-01'),
                        to: new Date('2006-06-01')
                    },
                    "degree": "djlboeb",
                    "area": "mathematics",
                    "description": "very funny time"
                }

                usersService.updateUserProfile(this.currentUser.username, {firstName: "I AM VASYA!", bio: "S DZ9REUNI", education: [educ1]})
                    .then((res) => {
                        debugger;
                        console.log(res);
                    }, (err) => {
                        debugger;
                        console.log(err);
                    })
            }
        }
    }
</script>

<style lang="less" scoped>
    .research-group-title {
        font-size: 16px;
        color: #2F80ED;
        font-weight: 500;
        text-decoration: none;
    }
</style>
