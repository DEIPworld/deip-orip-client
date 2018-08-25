<template>
    <v-container fluid fill-height class="pa-0 column-page">

        <div class="content-column">
            <div class="filling">
                <user-details-body></user-details-body>
            </div>
        </div>

        <v-card height="100%" class="sidebar">
            <user-details-sidebar></user-details-sidebar>
        </v-card>

    </v-container>   
</template>

<script>
    import usersService from './../../services/http/users'

    export default {
        name: 'UserDetails',
        data() {
            return {
                accountName: this.$route.params.account_name
            }
        },
        methods: {

        },
        created() {
            this.$store.dispatch('userDetails/loadUser', this.accountName);
        }
    }
</script>

<style lang="less" scoped>
</style>
