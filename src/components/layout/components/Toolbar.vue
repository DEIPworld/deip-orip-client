<template>
    <div class="pos-relative">
        <div class="global-loader-container">
            <global-loader></global-loader>
        </div>

        <v-toolbar app fixed clipped-left color="black" dark class="deip-toolbar">
            <v-toolbar-title>
                <router-link v-if="tenant" :to="{ name: 'Default' }">
                    <v-avatar size="60px">
                        <img :src="tenant | agencyLogoSrc(160, 160, false)" />
                    </v-avatar>
                </router-link>
                <router-link v-else class="app-title" :to="{ name: 'Default' }" tag="img" src="./static/logo.svg"></router-link>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn v-if="isLoggedIn()" to="/research-feed" icon large class="ma-0">
                <v-icon size="32px" color="grey lighten-1">search</v-icon>
            </v-btn>

            <notifications-list v-if="isLoggedIn()" :notifications="user.notifications"></notifications-list>

            <v-menu v-if="isLoggedIn()" bottom left offset-y>
                <v-btn fab flat icon class="ma-0" slot="activator">
                    <v-avatar size="32px">
                        <img v-if="user.profile" v-bind:src="user.profile.avatar | avatarSrc(32, 32, false)" />
                        <v-gravatar v-if="!user.profile && user.account" :title="user.username" :email="user.username + '@deip.world'" />
                    </v-avatar>
                </v-btn>

                <v-list class="dropdown-list" dark dense>
                    <v-list-tile :to="{ name: 'UserDetails', params: { account_name: user.username } }">
                        <v-list-tile-title>Profile</v-list-tile-title>
                    </v-list-tile>

                    <!-- temporary commented for the NSF demo -->
                    <!--
                    <v-list-tile :to="{ name: 'UserWallet' }">
                        <v-list-tile-title>Wallet</v-list-tile-title>
                    </v-list-tile>

                    <v-list-tile :to="{ name: 'claim-user-expertise-list' }">
                        <v-list-tile-title>Expertise Committee</v-list-tile-title>
                    </v-list-tile>

                    <v-list-tile :to="{ name: 'voting-for-block-producers' }">
                        <v-list-tile-title>Voting for block producers</v-list-tile-title>
                    </v-list-tile>
                    -->
                    
                <!-- <v-list-tile v-if="user" :to="{ name: 'CreateDisciplineGrant' }">
                        <v-list-tile-title>Create Grant</v-list-tile-title>
                    </v-list-tile> -->

                   <!-- <v-list-tile :to="{ name: 'investor-dashboard' }">
                        <v-list-tile-title>Investor dashboard</v-list-tile-title>
                    </v-list-tile> -->

                    <v-list-tile v-if="isGrantor" :to="{ name: 'CreateFundingOpportunityAnnouncement' }">
                        <v-list-tile-title>Create Funding Opportunity</v-list-tile-title>
                    </v-list-tile>

                    <v-divider></v-divider>

                    <v-list-tile @click="signOut()">
                        <v-list-tile-title>Sign Out</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>

            <div v-if="isLoggedIn() && !isGrantor && !isOfficer" class="mx-3" style="width: 180px">
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
