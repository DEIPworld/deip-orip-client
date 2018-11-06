<template>
        <v-toolbar app fixed clipped-left dark color="black" class="deip-toolbar">
            <v-toolbar-title>
                <router-link class="app-title" to="/research-feed" tag="img" src="./static/logo.svg"></router-link>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn v-if="isLoggedIn()" to="/research-feed" icon large class="ma-0">
                <v-icon size="32px" color="grey lighten-1">search</v-icon>
            </v-btn>

            <v-menu v-if="isLoggedIn()" bottom left offset-y :close-on-content-click="false">
                <v-btn icon large class="ma-0" slot="activator">
                    <v-badge color="amber darken-3" right overlap>
                        <v-icon size="32px" color="grey lighten-1">chat_bubble</v-icon>
                        <span slot="badge">{{ user.notifications.proposals.length + groupsInvites.length }}</span>
                    </v-badge>
                </v-btn>

                <!-- temporary solution for notifications. will be better -->
                <v-list class="hidden-last-child" v-show="user.notifications.proposals.length || groupsInvites.length">
                    <template v-for="invite in groupsInvites">
                        <div class="c-pv-2 c-ph-4">
                            <div>
                                Group
                                <router-link class="a" :to="{
                                        name: 'ResearchGroupDetails', 
                                        params: { research_group_permlink: invite.group.permlink }
                                    }"
                                >{{ invite.group.name }}</router-link>
                                invites you to work in team<br>
                                Please
                                <router-link class="a" :to="{ name: 'UserDetails', params: { account_name: user.username }}">review</router-link>
                                the request
                            </div>
                            <!-- by design here should be info about time, but we have no data about it -->
                        </div>

                        <v-divider></v-divider>
                    </template>

                    <template v-for="proposal in user.notifications.proposals">
                        <div class="c-pv-2 c-ph-4">
                            <div>
                                <router-link class="a"
                                    :to="{ name: 'UserDetails', params: { account_name: proposal.creator.account.name }}"
                                >{{ proposal.creator | fullname }}</router-link>
                                created a proposal in
                                <router-link class="a" :to="{
                                        name: 'ResearchGroupDetails', 
                                        params: { research_group_permlink: proposal.group.permlink }
                                    }"
                                >{{ proposal.group.name }}</router-link>
                            </div>

                            <div class="grey--text caption c-mt-1">
                                <v-icon size="16" color="grey">event</v-icon> {{ new Date(`${proposal.creation_time}Z`).toDateString() }}
                            </div>
                        </div>
                        
                        <v-divider></v-divider>
                    </template>
                </v-list>
            </v-menu>

            <v-menu v-if="isLoggedIn()" bottom left offset-y>
                <v-btn fab flat icon class="ma-0" slot="activator">
                    <v-avatar size="32px">
                        <img v-if="user.profile" v-bind:src="user.profile.avatar | avatarSrc(32, 32, false)" />
                        <v-gravatar v-if="!user.profile && user.account" :title="user.username" :email="user.username + '@deip.world'" />
                    </v-avatar>
                </v-btn>

                <v-list dark dense>
                    <v-list-tile @click="goToState('UserDetails', {account_name: user.username})">
                        <v-list-tile-title>Profile</v-list-tile-title>
                    </v-list-tile>

                    <v-list-tile v-if="user" @click="goToState('UserWallet')">
                        <v-list-tile-title>Wallet</v-list-tile-title>
                    </v-list-tile>
                    
                    <v-list-tile v-if="user" @click="goToState('CreateGrant')">
                        <v-list-tile-title>Create Grant</v-list-tile-title>
                    </v-list-tile>

                    <v-divider></v-divider>

                    <v-list-tile @click="signOut()">
                        <v-list-tile-title>Sign Out</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>

            <div v-if="isLoggedIn()" class="mx-3" style="width: 180px">
                <v-btn dark round color="primary" class="full-width ma-0" to="/create-new-research">
                    <div class="col-grow">Add Research</div>
                    <v-icon dark small class="ml-2">add</v-icon>
                </v-btn>
            </div>
            <v-toolbar-items v-if="!isLoggedIn()">
                <!-- <v-btn flat to="/sign-in">Sign In</v-btn> -->
                <v-btn flat to="/sign-up">Beta Registration</v-btn>
            </v-toolbar-items>
        </v-toolbar>
</template>

<script>

    import { isLoggedIn, clearAccessToken } from './../../../utils/auth';
    import { mapGetters } from 'vuex';

    export default {
        name: 'Toolbar',

        props: {
            drawer: Boolean
        },

        computed: {
            ...mapGetters({
                user: 'auth/user',
                groupsInvites: 'userDetails/invites'
            })
        },

        methods: {
            isLoggedIn: isLoggedIn,
            signOut: function() {
                clearAccessToken()
                this.$router.go('/sign-in')
            },
            updateDrawer(value) {
                this.$emit('update', value);
            },
            goToState(state, params) {
                if (this.$route.name === 'UserDetails' && params && params.account_name) {
                    this.$store.dispatch('userDetails/loadUser', params.account_name);
                }

                this.$router.push({ name: state, params: params });
            }
        },

        watch: {
            '$route' (to, from) {
                // loading notifications on every state change
                this.$store.dispatch('auth/loadNotifications');
                this.$store.dispatch('userDetails/loadUserInvites', { username: this.user.username });
            }
        }
    }
</script>

<style lang="less" scoped>
    .app-title {
        user-select: none;
        cursor: pointer;
        color: #ffffff;
        text-decoration: none;
    }

    .deip-toolbar {
        z-index: 200;
    }
</style>
