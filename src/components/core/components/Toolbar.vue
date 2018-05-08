<template>
        <v-toolbar app fixed clipped-left dark color="black">
            <!-- <v-toolbar-side-icon @click.stop="updateDrawer(!drawer)"></v-toolbar-side-icon> -->
            <v-toolbar-title>
                <router-link class="app-title" to="/researchFeed">DEIP</router-link>
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
                        <img src="http://deip.world/static/ashkor.7ff44c16.png" alt="User">
                    </v-avatar>
                </v-btn>
                <v-list dark dense>
                    <v-list-tile @click="goToState('UserDetails')">
                        <v-list-tile-title>My Page</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="goToState('ResearchGroupDetails')">
                        <v-list-tile-title>Research Group Details</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="goToState('ResearchGroupCreating')">
                        <v-list-tile-title>Research Group Creating</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="goToState('TokenSale')">
                        <v-list-tile-title>Token Sale</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="goToState('SignUp')">
                        <v-list-tile-title>Registration</v-list-tile-title>
                    </v-list-tile>

                    <v-divider></v-divider>
                    <v-list-tile @click="signOut()">
                        <v-list-tile-title>Sign Out</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>

            <div v-if="isLoggedIn()" class="mx-3" style="width: 180px">
                <v-btn dark round color="primary" class="full-width ma-0" to="/startCreateResearch">
                    <div class="col-grow">Add Research</div>
                    <v-icon dark small class="ml-2">add</v-icon>
                </v-btn>
            </div>
            <v-toolbar-items v-if="!isLoggedIn()">
            <!--  <v-btn flat to="/sign-in">Sign In</v-btn> -->
                <v-btn flat to="/sign-up">Sign Up</v-btn>
            </v-toolbar-items>
        </v-toolbar>
</template>

<script>

    import { isLoggedIn, clearAccessToken } from './../../../utils/auth'

    export default {
        name: 'Toolbar',
        props: {
            drawer: Boolean
        },
        methods: {
            isLoggedIn() {
                console.log(this.$route);
                return !(this.$route.fullPath === '/sign-in' || this.$route.fullPath === '/sign-up');
            },
            signOut: function() {
                clearAccessToken()
                this.$router.go('/sign-in')
            },
            updateDrawer(value) {
                this.$emit('update', value);
            },
            goToState(state) {
                this.$router.push({ name: state });
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
