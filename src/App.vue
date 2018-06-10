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

        <v-snackbar :timeout="5000" color="error" v-model="errorSnack.isVisible">
            {{errorSnack.message}}
            <v-btn dark flat @click.native="closeError()">Close</v-btn>
        </v-snackbar>
        <v-snackbar :timeout="5000" color="success" v-model="successSnack.isVisible">
            {{successSnack.message}}
            <v-btn dark flat @click.native="closeSuccess();">Close</v-btn>
        </v-snackbar>

    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'App',
        data() {
            return {
                successSnack: {isVisible: false, message: ""},
                errorSnack: {isVisible: false, message: ""},
                drawer: true
            };
        },
        computed: {
            ...mapGetters({
                success: 'layout/success',
                error: 'layout/error'
            })
        },
        methods: {
            onDrawerUpdate(value) {
                this.drawer = value;
            },
            closeError(){
                this.$store.dispatch('layout/setError', {isVisible: false, message: ""});
            },
            closeSuccess(){
                this.$store.dispatch('layout/setSuccess', {isVisible: false, message: ""});
            }
        },
        // we have to keep these watchers as Vuex store state must not be altered outside of migrations, 
        // but v-snackbar alters 'isVisible' internally after timeout
        watch: {
            success: function (newVal, oldVal) {
                this.successSnack.isVisible = newVal.isVisible;
                this.successSnack.message = newVal.message;
            },
            error: function (newVal, oldVal) {
                this.errorSnack.isVisible = newVal.isVisible;
                this.errorSnack.message = newVal.message;
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
