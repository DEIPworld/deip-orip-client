<template>
  <layout-section v-if="$ready">
    <research-list no-filter :items="researchList" namespace="account" />
  </layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import ResearchList from '@/components/ResearchList/ResearchList';

  export default {
    name: 'AccountProjects',
    components: { ResearchList, LayoutSection },
    computed: {
      ...mapGetters({
        researchList: 'userDetails/researchList'
      })
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
