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
                claimerUsername: 'bob'
            }
        },
        methods: {

        },
        created() {
            this.$store.dispatch('claimExpertise/loadClaimer', this.claimerUsername);
        }
    }
</script>

<style lang="less" scoped>
</style>
