<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">Add Members</div>
            <div class="col-grow overflow-y-auto">

                <div class="row c-mh-auto group-members-max-width">
                    <div class="col-12">
                        <v-text-field
                            label="Search..."
                            single-line
                            append-icon="search"
                            v-model="q"
                            @input="debounceSearchUsers()"
                        ></v-text-field>
                        <div>

                            <div class="row-nowrap justify-between align-center c-pt-4"
                                v-for="(user, i) in groupInfo.members" :key="i + '-picked'"
                            >
                                <div>
                                    <v-avatar size="40px">
                                        <img src="http://deip.world/static/ybokach.acb12e7e.png" alt="User">
                                    </v-avatar>
                                    <router-link to="#" class="a c-pl-3">{{ user.name }}</router-link>
                                </div>
                                <v-btn flat color="grey" class="ma-0" @click="cancelMember(i)">Cancel</v-btn>
                            </div>

                        </div>
                        <v-divider class="c-mt-4" v-show="groupInfo.members.length > 0"></v-divider>
                        <div>

                            <div class="row-nowrap justify-between align-center c-pt-4" 
                                v-for="(user, i) in selectableUsers" :key="i + '-selectable'"
                            >
                                <div>
                                    <v-avatar size="40px">
                                        <img src="http://deip.world/static/ybokach.acb12e7e.png" alt="User">
                                    </v-avatar>
                                    <router-link to="#" class="a c-pl-3">{{ user.name }}</router-link>
                                </div>
                                <v-btn flat color="primary" class="ma-0" @click="inviteMember(user)">+ Invite</v-btn>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="row justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>
            <v-btn color="primary" @click.native="nextStep()" :disabled="groupInfo.members.length === 0">Next</v-btn>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';

    const SELECTABLE_USERS_COUNT = 5;

    const prepareSelectableUsers = (allUsers, pickedUsers, q) => {
        let handler =  _(allUsers);

        if (q !== '') {
            handler = handler.filter(user => _.startsWith(user.name.toLowerCase(), q.toLowerCase()));
        }
            
        return handler.take(SELECTABLE_USERS_COUNT + pickedUsers.length)
            .differenceBy(pickedUsers, item => item.name)
            .take(SELECTABLE_USERS_COUNT)
            .value();
    }

    export default {
        name: "CreateResearchGroupMembers",
        props: {
            groupInfo: { required: true }
        },
        data() { 
            return {
                allUsers: [],
                selectableUsers: [],
                q: ''
            } 
        },
        methods: {
            nextStep() {
                this.$emit('incStep');
            },
            prevStep() {
                this.$emit('decStep');
            },
            debounceSearchUsers:  _.debounce(
                function() { this.selectableUsers = prepareSelectableUsers(this.allUsers, this.groupInfo.members, this.q) },
                600
            ),
            inviteMember(member) {
                member.stake = 0;
                this.groupInfo.members.push(member);
                this.selectableUsers = prepareSelectableUsers(this.allUsers, this.groupInfo.members, this.q);
            },
            cancelMember(index) {
                this.groupInfo.members.splice(index, 1);
                this.selectableUsers = prepareSelectableUsers(this.allUsers, this.groupInfo.members, this.q);
            }
        },
        mounted() {
            deipRpc.api.getAllAccountsAsync().then(data => { 
                this.allUsers = _.map(data, item => {
                    return { name: item.name, stake: 0 };
                });

                // for testing when array is too small
                // for (let i = 0; i < 10; i++) {
                //     let newData = _.cloneDeep(data);
                //     newData.forEach(element => {
                //         element.name = element.name + ' ' + i;
                //     });
                //     this.allUsers = _.concat(this.allUsers, newData);
                // }

                this.selectableUsers = prepareSelectableUsers(this.allUsers, this.groupInfo.members, this.q);
            });
        }
    };
</script>

<style lang="less" scoped>
    .group-members-max-width {
        max-width: 600px;
    }
</style>
