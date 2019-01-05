<template>
	<page-container>
		<v-layout row wrap>
      <v-flex xs12>
   			<research-application-details-file></research-application-details-file>
      </v-flex>
    </v-layout>
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
