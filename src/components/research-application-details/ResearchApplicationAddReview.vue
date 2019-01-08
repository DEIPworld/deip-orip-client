<template>
	<page-container v-if="isPageLoaded">
		<contentbar>
			<research-application-add-review-body></research-application-add-review-body>
		</contentbar>
		<sidebar>
			<research-application-add-review-sidebar></research-application-add-review-sidebar>
		</sidebar>
	</page-container>  
</template>

<script>
	import { mapGetters } from 'vuex'

	export default {
		name: "ResearchApplicationAddReview",
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