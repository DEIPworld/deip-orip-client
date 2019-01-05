<template>
	<page-container>
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
		created() {}
	};
</script>

<style lang="less" scoped>
</style>