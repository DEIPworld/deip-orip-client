<template>
  <layout-section v-if="$ready" :sidebar-cols="$route.fullPath.includes('account') ? {md: 4} : {}">
    <user-details-body />
    <user-details-sidebar />
  </layout-section>
</template>

<script>
  import UserDetailsSidebar from '@/components/UserDetails/components/UserDetailsSidebar';
  import UserDetailsBody from '@/components/UserDetails/components/UserDetailsBody';
  import LayoutSection from '@/components/layout/components/LayoutSection';

  export default {
    name: 'UserDetails',
    components: {
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
