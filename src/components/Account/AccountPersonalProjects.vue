<template>
  <layout-section v-if="$ready">
    <research-list :items="personalResearchers" namespace="account" />
  </layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import ResearchList from '@/components/ResearchList/ResearchList';

  export default {
    name: 'AccountPersonalProjects',
    components: { ResearchList, LayoutSection },
    computed: {
      ...mapGetters({
        researchList: 'userDetails/researchList'
      }),
      personalResearchers() {
        return this.researchList.filter(({ research_group: { is_personal } }) => is_personal);
      }
    },
    created() {
      const username = decodeURIComponent(this.$store.getters['auth/user'].account.name);
      this.$store.dispatch('userDetails/loadUserDetailsPage', { username })
        .then(() => {
          this.$setReady();
        });
    }
  };
</script>
