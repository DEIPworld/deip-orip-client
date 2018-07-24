<template>
        <v-toolbar app fixed clipped-left dark color="black">
            <v-toolbar-title>
                <router-link class="app-title" to="/research-feed" tag="img" src="./static/logo.svg">
                </router-link>
            </v-toolbar-title>
            <v-spacer></v-spacer>

            <v-btn v-if="isLoggedIn()" icon large class="ma-0">
                <v-icon size="32px" color="grey lighten-1">search</v-icon>
            </v-btn>
            <v-btn v-if="isLoggedIn()" icon large class="ma-0">
                <v-badge color="amber darken-3" right overlap>
                    <v-icon size="32px" color="grey lighten-1">chat_bubble</v-icon>
                    <span slot="badge">5</span>
                </v-badge>
            </v-btn>

            <v-menu v-if="isLoggedIn()" bottom left offset-y>
                <v-btn fab flat icon class="ma-0" slot="activator">
                    <v-avatar size="32px">
                        <img v-if="user.profile" v-bind:src="user.profile.avatar | avatarSrc(32, 32, false)" />
                        <v-gravatar v-if="!user.profile && user.account" :title="user.username" :email="user.username + '@deip.world'" />
                    </v-avatar>
                </v-btn>
                <v-list dark dense>
                    <v-list-tile @click="goToState('UserDetails', {account_name: user.username})">
                        <v-list-tile-title>My Page</v-list-tile-title>
                    </v-list-tile>

                    <v-list-tile v-if="user" @click="goToState('UserWallet')">
                        <v-list-tile-title>My Wallet</v-list-tile-title>
                    </v-list-tile>

                    <v-list-tile v-if="user" @click="goToState('CreateResearchGroup', {account_name: user.username})">
                        <v-list-tile-title>Create Research Group</v-list-tile-title>
                    </v-list-tile>
                    
                    <v-list-tile v-if="user" @click="goToState('CreateDisciplineGrant')">
                        <v-list-tile-title>Create Discipline Grant</v-list-tile-title>
                    </v-list-tile>

                    <v-divider></v-divider>

                    <v-list-tile @click="signOut()">
                        <v-list-tile-title>Sign Out</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>

            <div v-if="isLoggedIn()" class="mx-3" style="width: 180px">
                <v-btn dark round color="primary" class="full-width ma-0" to="/create-research">
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
                user: 'auth/user'
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
</style>
