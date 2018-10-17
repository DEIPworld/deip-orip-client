<template>
    <page-container>
        <contentbar>
            <user-details-body></user-details-body>
        </contentbar>

        <sidebar>
            <user-details-sidebar></user-details-sidebar>
        </sidebar>
    </page-container>
</template>

<script>
    import usersService from './../../services/http/users'
    import expertiseClaimsService from '../../services/http/expertiseClaims.js';

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

            expertiseClaimsService.getExpertiseClaimsByUser(this.$route.params.account_name)
                .then(data => {
                    console.log(data);
                });
        }
    }
</script>

<style lang="less" scoped>
</style>
