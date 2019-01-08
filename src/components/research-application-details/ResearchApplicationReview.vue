<template>
    <page-container v-if="isPageLoaded">
        <contentbar>
            <research-application-review-body></research-application-review-body>
        </contentbar>
        <sidebar>
            <research-application-review-sidebar></research-application-review-sidebar>
        </sidebar>
    </page-container>
</template>

<script>
    import { mapGetters } from 'vuex'
    import deipRpc from '@deip/deip-rpc-client'

    export default {
        name: "ResearchApplicationReview",
        data() { 
            return {} 
        },
        computed: {
			...mapGetters({
				isLoadingResearchApplicationDetails: 'rad/isLoadingResearchApplicationDetails'
			}),
			isPageLoaded() {
				return this.isLoadingResearchApplicationDetails === false;
			}
        }
    };
</script>

<style lang="less" scoped>
</style>