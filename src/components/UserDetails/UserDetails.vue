<template>
  <layout-section v-if="$ready" :sidebar-cols="$route.fullPath.includes('account') ? {md: 4} : {}">
    <template #sidebar>
      <user-details-sidebar />
    </template>
    <user-details-body />
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
      }).then(() => { this.$setReady(); });
    }
  };
</script>

<style lang="less" scoped>
</style>
