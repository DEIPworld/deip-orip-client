<template>
    <div class="pos-relative">
        <div class="global-loader-container">
            <global-loader></global-loader>
        </div>

        <v-toolbar color="black">
            <v-toolbar-side-icon class="mx-2">
                <router-link class="app-title" :to="{ name: 'Default' }" tag="img" src="./static/logo.svg"></router-link>
            </v-toolbar-side-icon>
            <v-toolbar-title>

            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items v-if="isLoggedIn()" class="hidden-sm-and-down">
                <v-btn :to="{ name: 'ResearchFeed' }" color="white" flat class="ma-0">Feed</v-btn>
                <v-btn :to="{ name: 'Dashboard' }"  color="white" flat class="ma-0">Dashboard</v-btn>
                <v-btn :to="{ name: 'InvestorDashboard' }" color="white" flat class="ma-0">Portfolio</v-btn>
                <notifications-list :notifications="user.notifications"></notifications-list>
                <v-menu bottom left offset-y>
                    <v-btn fab flat icon class="ma-0" slot="activator">
                        <v-avatar size="32px">
                            <img v-if="user.profile" v-bind:src="user.profile.avatar | avatarSrc(2 * 32, 2 * 32, false)" />
                            <v-gravatar v-if="!user.profile && user.account" :title="user.username" :email="user.username + '@deip.world'" />
                        </v-avatar>
                    </v-btn>
                    <v-list class="dropdown-list" dark dense>
                        <v-list-tile :to="{ name: 'UserDetails', params: { account_name: user.username } }">
                            <v-list-tile-title>Profile</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile :to="{ name: 'UserWallet', params: { account_name: user.username } }">
                            <v-list-tile-title>Wallet</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile @click="signOut()">
                            <v-list-tile-title>Sign Out</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar-items>

            <v-toolbar-items v-else>
                <v-btn color="white" flat :to="{ name: 'SignIn' }">Sign In</v-btn>
                <!-- <v-btn color="white" flat :to="{ name: 'SignUp' }">Sign Up</v-btn> -->
            </v-toolbar-items>
        </v-toolbar>
    </div>
</template>

<script>
    import { isLoggedIn, clearAccessToken } from './../../../utils/auth';
    import { mapGetters } from 'vuex';

    export default {
        name: 'Toolbar',
        data() {
            return {
                tenant: window.env.TENANT
            }
        },
        computed: {
            ...mapGetters({
                user: 'auth/user',
                isGrantor: 'auth/isGrantor',
                isOfficer: 'auth/isOfficer'
            })
        },

        methods: {
            isLoggedIn: isLoggedIn,

            signOut: function() {
                clearAccessToken()
                this.$router.go('/sign-in')
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
        // background-color: #313a53 !important;
    }

    .global-loader-container {
        position: fixed;
        top: 0px;
        right: 0px;
        left: 0px;
        z-index: 201;
    }

    .dropdown-list {
        min-width: 170px;
    }
</style>
