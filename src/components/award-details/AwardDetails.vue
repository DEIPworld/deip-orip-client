<template>
    <div>{{award}}</div>
</template>

<script>

    import deipRpc from '@deip/deip-rpc-client';
    import { mapGetters } from 'vuex'

    export default {
        name: "AwardDetails",

        data() {
          return {}
        },

        computed: {
          ...mapGetters({
            user: 'auth/user',
            isPrincipalInvestigator: 'auth/isPrincipalInvestigator',
            isCertifier: 'auth/isCertifier',
            isProgramOfficer: 'auth/isProgramOfficer',
            isFinancialOfficer: 'auth/isFinancialOfficer',
            organization: 'award_details/organization',
            award: 'award_details/award'
          }),
        },

        created() {}
    };
</script>

<style lang="less" scoped>
</style>
