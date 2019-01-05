<template>
	<div style="position: relative">
		<div id="application-review-editor" class="deip-base-editor" ref="application-review-editor"></div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
	import deipRpc from '@deip/deip-rpc-client';
	import { ProseEditor, ProseEditorConfigurator, EditorSession, ProseEditorPackage, ImagePackage, PersistencePackage } from 'substance'
	import DeipBaseEditor from './../../../editors/DeipBaseEditor'

	export default {
		name: "ResearchApplicationAddReviewBody",
		data() {
			return {
			};
		},
		computed: {

		},

		methods: {

		},

		mounted() {
			const container = this.$refs['application-review-editor'];
			const applicationReviewEditor = new DeipBaseEditor(container);
			this.$store.dispatch('rad/setApplicationReviewEditor', {applicationReviewEditor});
		}
	};
</script>

<style lang="less">
    @import './../../../styles/substance-editor';
</style>
