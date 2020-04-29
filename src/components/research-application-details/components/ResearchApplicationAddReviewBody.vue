<template>
  <div style="position: relative">
    <div id="application-review-editor" ref="application-review-editor" class="deip-base-editor" />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';
  import {
    ProseEditor, ProseEditorConfigurator, EditorSession, ProseEditorPackage, ImagePackage, PersistencePackage
  } from 'substance';
  import DeipBaseEditor from '../../../editors/DeipBaseEditor';

  export default {
    name: 'ResearchApplicationAddReviewBody',
    data() {
      return {
      };
    },
    computed: {

    },

    mounted() {
      const container = this.$refs['application-review-editor'];
      const applicationReviewEditor = new DeipBaseEditor(container);
      this.$store.dispatch('rad/setApplicationReviewEditor', { applicationReviewEditor });
    },

    methods: {

    }
  };
</script>

<style lang="scss">
    @import './../../../styles/substance-editor';
</style>
