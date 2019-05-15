<template>
    <div class="pos-relative">
        <div class="global-loader-container">
            <global-loader></global-loader>
        </div>

        <v-toolbar app fixed clipped-left color="black" dark class="deip-toolbar">
            <v-toolbar-title>
                <router-link v-if="tenant && isTreasury" :to="{ name: 'Default' }">
                    <div style="width: 40px; height: 40px">
                        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                            viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
                            <circle style="fill:#F0F0F0;" cx="256" cy="256" r="256"/>
                            <g>
                                <path style="fill:#D80027;" d="M244.87,256H512c0-23.106-3.08-45.49-8.819-66.783H244.87V256z"/>
                                <path style="fill:#D80027;" d="M244.87,122.435h229.556c-15.671-25.572-35.708-48.175-59.07-66.783H244.87V122.435z"/>
                                <path style="fill:#D80027;" d="M256,512c60.249,0,115.626-20.824,159.356-55.652H96.644C140.374,491.176,195.751,512,256,512z"/>
                                <path style="fill:#D80027;" d="M37.574,389.565h436.852c12.581-20.529,22.338-42.969,28.755-66.783H8.819
                                    C15.236,346.596,24.993,369.036,37.574,389.565z"/>
                            </g>
                            <path style="fill:#0052B4;" d="M118.584,39.978h23.329l-21.7,15.765l8.289,25.509l-21.699-15.765L85.104,81.252l7.16-22.037
                                C73.158,75.13,56.412,93.776,42.612,114.552h7.475l-13.813,10.035c-2.152,3.59-4.216,7.237-6.194,10.938l6.596,20.301l-12.306-8.941
                                c-3.059,6.481-5.857,13.108-8.372,19.873l7.267,22.368h26.822l-21.7,15.765l8.289,25.509l-21.699-15.765l-12.998,9.444
                                C0.678,234.537,0,245.189,0,256h256c0-141.384,0-158.052,0-256C205.428,0,158.285,14.67,118.584,39.978z M128.502,230.4
                                l-21.699-15.765L85.104,230.4l8.289-25.509l-21.7-15.765h26.822l8.288-25.509l8.288,25.509h26.822l-21.7,15.765L128.502,230.4z
                                M120.213,130.317l8.289,25.509l-21.699-15.765l-21.699,15.765l8.289-25.509l-21.7-15.765h26.822l8.288-25.509l8.288,25.509h26.822
                                L120.213,130.317z M220.328,230.4l-21.699-15.765L176.93,230.4l8.289-25.509l-21.7-15.765h26.822l8.288-25.509l8.288,25.509h26.822
                                l-21.7,15.765L220.328,230.4z M212.039,130.317l8.289,25.509l-21.699-15.765l-21.699,15.765l8.289-25.509l-21.7-15.765h26.822
                                l8.288-25.509l8.288,25.509h26.822L212.039,130.317z M212.039,55.743l8.289,25.509l-21.699-15.765L176.93,81.252l8.289-25.509
                                l-21.7-15.765h26.822l8.288-25.509l8.288,25.509h26.822L212.039,55.743z"/>
                            <g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
                        </svg>
                    </div>
                </router-link>

                <router-link v-else-if="tenant" :to="{ name: 'Default' }">
                    <v-avatar size="50px">
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
                    
                    <v-list-tile :to="{ name: 'UserWallet' }">
                        <v-list-tile-title>Wallet</v-list-tile-title>
                    </v-list-tile>

                    <v-list-tile :to="{ name: 'claim-user-expertise-list' }">
                        <v-list-tile-title>Expertise Committee</v-list-tile-title>
                    </v-list-tile>

                    <v-list-tile :to="{ name: 'voting-for-block-producers' }">
                        <v-list-tile-title>Voting for block producers</v-list-tile-title>
                    </v-list-tile>
                    
                    
                <!-- <v-list-tile v-if="user" :to="{ name: 'CreateDisciplineGrant' }">
                        <v-list-tile-title>Create Grant</v-list-tile-title>
                    </v-list-tile> -->

                   <!-- <v-list-tile :to="{ name: 'investor-dashboard' }">
                        <v-list-tile-title>Investor dashboard</v-list-tile-title>
                    </v-list-tile> -->

                    <v-list-tile v-if="isGrantor" :to="{ name: 'CreateFundingOpportunityAnnouncement' }">
                        <v-list-tile-title>Create Funding Opportunity</v-list-tile-title>
                    </v-list-tile>

                    <v-list-tile v-if="isGrantor" :to="{ name: 'AgencyPrograms', params: { agency: tenant } }">
                        <v-list-tile-title>Funding Opportunities</v-list-tile-title>
                    </v-list-tile>
                    
                    <v-list-tile v-if="isGrantor || isTreasury" :to="{ name: 'AgencyProgramWithdrawalRequests', params: { agency: tenant } }">
                        <v-list-tile-title>Milestone Reports</v-list-tile-title>
                    </v-list-tile>

                    <v-list-tile v-if="isGrantor || isTreasury" :to="{ name: 'TreasuryDepartment' }">
                        <v-list-tile-title>Granted Awards</v-list-tile-title>
                    </v-list-tile>

                    <v-list-tile :to="{ name: 'OrganizationDashboard', params: { org: tenant } }">
                        <v-list-tile-title>Dashboard</v-list-tile-title>
                    </v-list-tile>

                    <v-list-tile v-if="isFinancialOfficer" :to="{ name: 'OrganizationFinanceDashboard', params: { org: tenant } }">
                        <v-list-tile-title>Finance</v-list-tile-title>
                    </v-list-tile>

                    <v-divider></v-divider>

                    <v-list-tile @click="signOut()">
                        <v-list-tile-title>Sign Out</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>

            <div v-if="isLoggedIn() && !isGrantor && !isOfficer && !isTreasury" class="mx-3" style="width: 180px">
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
                isOfficer: 'auth/isOfficer',
                isTreasury: 'auth/isTreasury',
                isFinancialOfficer: 'auth/isFinancialOfficer'
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
