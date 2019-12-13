<template>
    <v-layout column fill-height>
        <v-flex display-flex flex-column flex-grow-1 mb-3>
            <div class="step-title">Invite members</div>
            <div class="flex-grow-1 overflow-y-auto flex-basis-0">

                <v-layout row mx-auto class="group-members-max-width">
                    <v-flex xs12>
                        <v-text-field
                            label="Search..."
                            single-line
                            append-icon="search"
                            v-model="q"
                            @input="debounceSearchUsers()">
                        </v-text-field>
                        <div>

                            <v-layout row justify-space-between align-center pt-3
                                v-for="(user, i) in group.members" :key="i + '-picked'">
                                <div>
                                    <v-avatar size="30px">
                                        <img v-if="user.profile" v-bind:src="user.profile.avatar | avatarSrc(30, 30, false)" />
                                        <v-gravatar v-else :email="user.account.name + '@deip.world'" />
                                    </v-avatar>
                                    <router-link to="#" class="a c-pl-3">{{ user | fullname }}</router-link>
                                </div>
                                <v-btn v-if="user.account.name != creatorUsername" flat color="grey" class="ma-0" @click="cancelMember(i)">Cancel</v-btn>
                            </v-layout>

                        </div>
                        <v-divider class="mt-3" v-show="group.members.length > 0"></v-divider>
                        <div>

                            <v-layout row justify-space-between align-center pt-3 
                                v-for="(user, i) in selectableUsers" :key="i + '-selectable'">
                                <div>
                                    <v-avatar size="30px">
                                        <img v-if="user.profile" v-bind:src="user.profile.avatar | avatarSrc(30, 30, false)" />
                                        <v-gravatar v-else :email="user.account.name + '@deip.world'" />
                                    </v-avatar>
                                    <router-link to="#" class="a c-pl-3">{{ user | fullname }}</router-link>
                                </div>
                                <v-btn flat color="primary" class="ma-0" @click="inviteMember(user)">+ Invite</v-btn>
                            </v-layout>

                        </div>
                    </v-flex>
                </v-layout>

            </div>
        </v-flex>
        <v-flex flex-grow-0>
          <v-layout row justify-center align-center>
              <v-btn flat small @click.native="prevStep()">
                  <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
              </v-btn>
              <!-- <v-btn color="primary" @click.native="nextStep()" :disabled="group.members.length === 0">Next</v-btn> -->
              <v-btn color="primary" :loading="isLoading" @click.native="finish()" :disabled="group.members.length === 0 || isLoading">
                  Create group
              </v-btn>
          </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>
    import deipRpc from '@deip/deip-oa-rpc-client';
    import _ from 'lodash';
    import { getEnrichedProfiles } from './../../../utils/user'

    const SELECTABLE_USERS_COUNT = 5;

    const prepareSelectableUsers = (allUsers, pickedUsers, q) => {
        let handler =  _(allUsers);

        if (q !== '') {
            handler = handler.filter(user => _.startsWith(user.account.name.toLowerCase(), q.toLowerCase()));
        }
            
        return handler.take(SELECTABLE_USERS_COUNT + pickedUsers.length)
            .differenceBy(pickedUsers, item => item.account.name)
            .take(SELECTABLE_USERS_COUNT)
            .value();
    }

    function recalculateDefaultStakes(creatorUsername, members) {
        const creator = members.find(m => m.account.name == creatorUsername);
        var totalSum = 0;

        members.forEach(m => {
            m.stake = Math.floor(100 / members.length);
            totalSum += m.stake;
        })

        if (totalSum < 100){
            creator.stake += (100 - totalSum);
        }
    }

    export default {
        name: "CreateResearchGroupMembers",
        props: {
            group: {type: Object, required: true },
            isLoading:  { type: Boolean, required: true }
        },
        data() { 
            return {
                creatorUsername: this.$route.params.account_name,
                allUsers: [],
                selectableUsers: [],
                q: '',
                selectedUsers: this.group.members
            } 
        },
        methods: {
            nextStep() {
                this.$emit('incStep');
            },
            prevStep() {
                this.$emit('decStep');
            },
            debounceSearchUsers: _.debounce(
                function() {
                    this.selectableUsers = prepareSelectableUsers(this.allUsers, this.selectedUsers, this.q);
                },
                600
            ),
            
            inviteMember(member) {
                this.selectedUsers.push(member);
                recalculateDefaultStakes(this.creatorUsername, this.selectedUsers)
                this.selectableUsers = prepareSelectableUsers(this.allUsers, this.selectedUsers, this.q);
            },
            cancelMember(index) {
                this.selectedUsers.splice(index, 1);
                recalculateDefaultStakes(this.creatorUsername, this.selectedUsers)
                this.selectableUsers = prepareSelectableUsers(this.allUsers, this.selectedUsers, this.q);
            },
              finish() {
                this.$emit('finish');
            }
        },
        watch: {
            selectedUsers() {
                this.$emit('setGroupMembers', this.selectedUsers);
            }
        },
        mounted() {
            deipRpc.api.getAllAccountsAsync()
                .then(accounts => {
                    const usernames = [];
                    usernames.push(this.creatorUsername)
                    usernames.push(...accounts.filter(a => a.name != this.creatorUsername).map(a => a.name))
                    return getEnrichedProfiles(usernames)
                })
                .then((users) => {
                    users.forEach(u => { u.stake = u.account.name == this.creatorUsername ? 100 : 0 })
                    this.selectedUsers.push(users[0]) // creator
                    this.allUsers = users.slice(1)
                    this.selectableUsers = prepareSelectableUsers(this.allUsers, this.selectedUsers, this.q);
                })
        }
    };
</script>

<style lang="less" scoped>
    .group-members-max-width {
        max-width: 510px;
    }
</style>
