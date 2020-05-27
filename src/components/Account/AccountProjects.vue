<template>
  <layout-section>
    <state-research-list
      :research-list="researchList"
      :header-text="'Research projects'"
    />
  </layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import LayoutSection from '@/components/layout/components/LayoutSection';

  export default {
    name: 'AccountProjects',
    components: { LayoutSection },
    computed: {
      ...mapGetters({
        researchList: 'userDetails/researchList'
      })
    },
    $dataPreload() {
      const username = decodeURIComponent(this.$store.getters['auth/user'].account.name);
      return this.$store.dispatch('userDetails/loadUserDetailsPage', { username });
    }
  };
</script>
