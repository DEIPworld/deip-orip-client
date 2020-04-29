<template>
  <v-expansion-panels class="elevation-0">
    <research-details-draft-list-item
      v-for="(draft, index) of contentRefsList.filter(d => !isDraftApproved(d))"
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
      })
    },
    methods: {
      isDraftApproved(draft) {
        return this.contentList.some(
          (c) => c.content === `${draft.type}:${draft.hash}`
        );
      }
    }
  };
</script>

<style scoped>
</style>
