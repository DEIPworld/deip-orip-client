<template>
  <v-card v-if="contentList.length" outlined class="my-6">
    <v-expansion-panels flat>
      <research-details-materials-item
        v-for="content of contentList"
        :key="content.id"
        :content="content"
        :is-details-available="isDetailsAvailable"
      />
    </v-expansion-panels>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ResearchDetailsMaterialsItem from '@/components/research-details/components/ResearchDetailsMaterialsItem';

  export default {
    name: 'ResearchDetailsMaterials',
    components: { ResearchDetailsMaterialsItem },
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
