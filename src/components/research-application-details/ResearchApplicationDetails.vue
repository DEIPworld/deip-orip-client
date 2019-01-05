<template>
	<page-container>
		<div class="col-grow full-height">
			<research-application-details-file></research-application-details-file>
		</div>
		<sidebar>
			<research-application-details-sidebar></research-application-details-sidebar>
		</sidebar>
	</page-container>
</template>

<script>
	import { mapGetters } from 'vuex';
	import deipRpc from '@deip/deip-rpc-client';

	export default {
		name: "ResearchApplicationDetails",
		data() {
			return {}
		},
		computed: {
			...mapGetters({
				user: 'auth/user'
			})
		},
		methods: {
		},
		created() {
		}
	};
</script>

<style lang="less" scoped>

</style>
