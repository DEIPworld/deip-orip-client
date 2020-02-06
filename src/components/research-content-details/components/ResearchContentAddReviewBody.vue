<template>
  <div style="position: relative">
    <div id="review-editor" class="deip-base-editor" ref="review-editor"></div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import DeipBaseEditor from './../../../editors/DeipBaseEditor'
import { bus } from './../../../main';

export default {
  name: "ResearchContentAddReviewBody",
  data() {
    return {
      reviewEditor: null
    };
  },
  computed: {

  },

  methods: {
    exportHtml(cb) {
      this.reviewEditor.exportHtml()
        .then((html) => {
          if (typeof cb === "function") cb(html);
        });
    }
  },

  mounted() {
    const container = this.$refs['review-editor'];
    const reviewEditor = new DeipBaseEditor(container);
    this.reviewEditor = reviewEditor;
    
    bus.$on('reviewEditor:exportHtml', this.exportHtml);
  }
};
</script>

<style lang="scss">
  @import './../../../styles/substance-editor';
</style>
