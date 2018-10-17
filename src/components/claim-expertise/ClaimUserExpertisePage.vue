<template>
    <page-container>

        <contentbar>
            <claim-user-expertise-body></claim-user-expertise-body>
        </contentbar>

        <sidebar>
            <claim-user-expertise-sidebar></claim-user-expertise-sidebar>
        </sidebar>

    </page-container>
</template>

<script>

    export default {
        name: 'ClaimUserExpertisePage',
        data() {
            return {
                claimerUsername: 'alice',
                claimId: '5bc4b207557aa7001c4afe56'
            }
        },
        methods: {

        },
        created() {
            this.$store.dispatch('claimExpertise/loadClaimer', {
                username: this.claimerUsername,
                claimId: this.claimId
            });
        }
    }
</script>

<style lang="less" scoped>
</style>
