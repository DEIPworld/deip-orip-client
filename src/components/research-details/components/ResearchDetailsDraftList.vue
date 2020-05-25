<template>
  <v-expansion-panels flat>
    <research-details-draft-list-item
      v-for="(draft, index) in draftsList"
      :key="draft._id"
      :index="index"
      :draft="draft"
    />
  </v-expansion-panels>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ResearchDetailsDraftListItem from '@/components/research-details/components/ResearchDetailsDraftListItem';

  export default {
    name: 'ResearchDetailsDraftList',
    components: { ResearchDetailsDraftListItem },
    computed: {
      ...mapGetters({
        contentList: 'rd/contentList',
        draftsList: 'rd/draftsList'
      })
    },
    methods: {

    }
  };
</script>

<style scoped>
</style>
