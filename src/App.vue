<template>
    <div id="app">
        <div v-if="$route.meta.withoutHeader">
            <router-view/>
        </div>

        <v-app v-else>
            <!-- <v-navigation-drawer clipped fixed v-model="drawer" app>
                <v-list dense>
                    <v-list-tile @click="">
                        <v-list-tile-action>
                            <v-icon>dashboard</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Dashboard</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-navigation-drawer> -->
            <toolbar :drawer="drawer" @update="onDrawerUpdate"></toolbar>
            <v-content>
                <router-view/>
            </v-content>
        </v-app>
    </div>
</template>

<script>
    export default {
        name: 'App',
        data() {
            return {
                drawer: true
            };
        },
        methods: {
            onDrawerUpdate(value) {
                this.drawer = value;
            }
        },
        mounted() {
            console.log(this.$route);
        }
    }
</script>

<style>
    #app {
        font-family: 'Roboto', 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }
</style>
