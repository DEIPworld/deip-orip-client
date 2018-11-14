<template>
    <page-container>

        <contentbar>
            <div class="spinner-container">
                <v-progress-circular class="section-spinner"
                    v-if="isDataLoading"
                    :size="100" indeterminate color="primary"
                ></v-progress-circular>

                <claim-user-expertise-details-body v-else></claim-user-expertise-details-body>
            </div>
        </contentbar>

        <sidebar>
            <sidebar-loader v-if="isDataLoading"></sidebar-loader>
            <claim-user-expertise-details-sidebar v-else></claim-user-expertise-details-sidebar>
        </sidebar>

    </page-container>
</template>

<script>
    import deipRpc from '@deip/deip-rpc-client';

    export default {
        name: 'ClaimUserExpertiseDetails',

        data() {
            return {
                claimerUsername: this.$route.params.account_name,
                claimId: this.$route.params.claim_id,

                isDataLoading: true
            }
        },

        methods: {

        },
        
        created() {
            this.$store.dispatch('claimExpertiseDetails/loadClaimer', {
                username: this.claimerUsername,
                claimId: this.claimId
            }).then(() => {
                this.isDataLoading = false;
            });
        }
    }
</script>

<style lang="less" scoped>
</style>
