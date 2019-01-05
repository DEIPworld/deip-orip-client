<template>
	<page-container>
		<v-layout row wrap>
      		<v-flex xs12>
   				<research-application-details-file></research-application-details-file>
      		</v-flex>
			<v-flex xs10 offset-xs1>
				<!-- START Research Content Reviews section -->
				<div class="c-pt-5 sidebar-fullwidth"><v-divider></v-divider></div>

                <div class="c-pt-5 c-pb-10" v-if="applicationReviewsList.length">
                    <div id="appliation-reviews">
                        <div class="c-pt-2 title">Reviews: {{ applicationReviewsList.length }}</div>
                        <div class="c-pt-6">
                            <application-review-list-item v-for="(review, i) in applicationReviewsList" :review="review" :key="i"></application-review-list-item>
                        </div>
                    </div>
                </div>
                <!-- END Research Content Reviews section -->
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
				user: 'auth/user',
				applicationReviewsList: 'rad/applicationReviewsList'
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
