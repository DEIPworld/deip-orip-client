<template>
  <d-layout-section v-if="$ready">
    <user-details-body />

    <template #sidebar>
      <user-details-sidebar />
    </template>
  </d-layout-section>
</template>

<script>
  import UserDetailsSidebar from '@/components/UserDetails/components/UserDetailsSidebar';
  import UserDetailsBody from '@/components/UserDetails/components/UserDetailsBody';
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';

  export default {
    name: 'UserDetails',
    components: {
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
