<template>
  <div class="my-4" v-if="contentList.length">
    <v-expansion-panel class="elevation-0">
      <research-details-materials-item
        v-for="content of contentList"
        :key="content.id"
        :content="content"
        :isDetailsAvailable="isDetailsAvailable"
      />
    </v-expansion-panel>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'ResearchDetailsMaterials',

    props: {
      isDetailsAvailable: {
        type: Boolean,
        required: false,
        default: false
      }
    },

    data() {
      return {};
    },
    computed: {
      ...mapGetters({
        contentList: 'rd/contentList'
      })
    },
    methods: {}
  };
</script>

<style scoped>
</style>
