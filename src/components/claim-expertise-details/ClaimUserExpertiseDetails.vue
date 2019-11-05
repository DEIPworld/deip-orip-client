<template>
    <page-container>

        <contentbar>
            <claim-user-expertise-details-body></claim-user-expertise-details-body>
        </contentbar>

        <sidebar>
            <claim-user-expertise-details-sidebar></claim-user-expertise-details-sidebar>
        </sidebar>

    </page-container>
</template>

<script>
    import deipRpc from '@deip/deip-oa-rpc-client';

    export default {
        name: 'ClaimUserExpertiseDetails',

        data() {
            return {
            }
        },

        methods: {
        },
        
        created() {
        }
    }
</script>

<style lang="less" scoped>
</style>
