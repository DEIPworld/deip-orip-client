<template>
  <d-layout-section v-if="$ready">
    <d-layout-section-main>
      <user-details-body />
    </d-layout-section-main>
    <d-layout-section-sidebar>
      <user-details-sidebar />
    </d-layout-section-sidebar>
  </d-layout-section>
</template>

<script>
  import UserDetailsSidebar from '@/components/UserDetails/components/UserDetailsSidebar';
  import UserDetailsBody from '@/components/UserDetails/components/UserDetailsBody';
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DLayoutSectionSidebar from '@/components/Deipify/DLayout/DLayoutSectionSidebar';

  export default {
    name: 'UserDetails',
    components: {
      DLayoutSectionSidebar,
      DLayoutSectionMain,
      DLayoutSection,
      LayoutSection,
      UserDetailsBody,
      UserDetailsSidebar
    },
    props: {
      username: {
        type: String,
        default: 'undefined'
      }
    },

    created() {
      this.$store.dispatch('userDetails/loadUserDetailsPage', {
        username: decodeURIComponent(this.username)
      })
        .then(() => this.$store.dispatch('userDetails/loadAccountEciStatsRecords', { account: decodeURIComponent(this.username) }))
        .then(() => { this.$setReady(); });
    }
  };
</script>

<style lang="less" scoped>
</style>
