<template>
  <layout-section v-if="$ready">
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
    created() {
      const username = decodeURIComponent(this.$store.getters['auth/user'].account.name);
      this.$store.dispatch('userDetails/loadUserDetailsPage', { username })
        .then(() => {
          this.$setReady();
        });
    }
  };
</script>
