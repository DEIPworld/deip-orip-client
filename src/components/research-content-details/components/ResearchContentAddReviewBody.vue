<template>
  <d-layout-full-screen title="Submit review">
    {{ test }}
    <vex-wysiwyg v-model="test" />
    <hr>
    {{ test2 }}
    <vex-wysiwyg v-model="test2" label="Description" />
    <hr>
    <!--    <d-wysiwyg v-model="test" disabled />-->
  </d-layout-full-screen>
<!--  <div style="position: relative">-->
<!--    -->
<!--    &lt;!&ndash;    <div id="review-editor" ref="review-editor" class="deip-base-editor" />&ndash;&gt;-->
<!--  </div>-->
</template>

<script>

  import { mapGetters } from 'vuex';
  import DLayoutFullScreen from '@/components/Deipify/DLayout/DLayoutFullScreen';
  import VexWysiwyg from '@/plugins/VuetifyExtended/components/VexWysiwyg/VexWysiwyg';
  import DeipBaseEditor from '../../../editors/DeipBaseEditor';
  import { bus } from '../../../main';

  const tpl = [
    '<div><span class="non-deletable text-overline" data-required="true" data-id="aaa" spellcheck="false">Question</span></div>',
    '<p>zzz</p>'
  ].join('');

  export default {
    name: 'ResearchContentAddReviewBody',
    components: { VexWysiwyg, DLayoutFullScreen },
    data() {
      return {
        reviewEditor: null,
        // test: '<h3>Headline</h3><p>...</p>',
        // test: '',
        test: tpl,
        test2: 'sss'
      };
    },
    computed: {},

    mounted() {
      // const container = this.$refs['review-editor'];
      // const reviewEditor = new DeipBaseEditor(container);
      // this.reviewEditor = reviewEditor;
      //
      // bus.$on('reviewEditor:exportHtml', this.exportHtml);
    },

    beforeDestroy() {
      // bus.$off('reviewEditor:exportHtml', this.exportHtml);
    },

    methods: {
      // exportHtml(cb) {
      //   this.reviewEditor.exportHtml()
      //     .then((html) => {
      //       if (typeof cb === 'function') cb(html);
      //     });
      // }
    }

  };
</script>

<style lang="scss">
  @import './../../../styles/substance-editor';
</style>
