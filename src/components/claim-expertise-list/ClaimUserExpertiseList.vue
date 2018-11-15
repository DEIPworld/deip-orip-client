<template>
    <page-container>
        <sidebar>
            <claim-user-expertise-list-sidebar></claim-user-expertise-list-sidebar>
        </sidebar>

        <contentbar>
            <claim-user-expertise-list-body></claim-user-expertise-list-body>
        </contentbar>
    </page-container>
</template>

<script>

    import { mapGetters } from 'vuex';
    import _ from 'lodash';

    export default {
        name: "ClaimUserExpertiseList",

        methods: {
        },

        created() {
            this.$store.dispatch('claimExpertiseList/loadAllClaims');
        }
    };
</script>

<style lang="less" scoped>
</style>
