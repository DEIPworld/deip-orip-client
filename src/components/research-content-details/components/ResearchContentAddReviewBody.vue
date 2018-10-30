<template>
    <div style="position: relative">
        <div id="review-editor" class="deip-base-editor" ref="review-editor"></div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import deipRpc from '@deip/deip-rpc-client';
    import { ProseEditor, ProseEditorConfigurator, EditorSession, ProseEditorPackage, ImagePackage, PersistencePackage } from 'substance'
    import DeipBaseEditor from './../../../editors/DeipBaseEditor'

    export default {
        name: "ResearchContentAddReviewBody",
        data() {
            return {
            };
        },
        computed: {

        },

        methods: {

        },

        mounted() {
            const container = this.$refs['review-editor'];
            const reviewEditor = new DeipBaseEditor(container);
            this.$store.dispatch('rcd/setReviewEditor', { reviewEditor });
        }
    };
</script>

<style lang="less">
    @import './../../../styles/substance-editor';
</style>
