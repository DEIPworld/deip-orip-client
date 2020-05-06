<template>
  <v-expansion-panels class="elevation-0">
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
        contentRefsList: 'rd/contentRefsList'
      }),
      draftsList() {
        return this.contentRefsList.filter((ref) => !this.contentList.some((c) => c.content === ref.hash));
      }
    },
    methods: {

    }
  };
</script>

<style scoped>
</style>
