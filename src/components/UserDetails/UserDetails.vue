<template>
  <layout-section v-if="dataLoaded" :sidebar-cols="$route.fullPath.includes('account') ? {md: 4} : {}">
    <template #sidebar>
      <user-details-sidebar />
    </template>
    <user-details-body />
  </layout-section>
</template>

<script>
  import LayoutSidebar from '@/components/layout/components/LayoutSidebar';
  import UserDetailsSidebar from '@/components/UserDetails/components/UserDetailsSidebar';
  import UserDetailsBody from '@/components/UserDetails/components/UserDetailsBody';
  import LayoutSection from '@/components/layout/components/LayoutSection';

  export default {
    name: 'UserDetails',
    components: {
      LayoutSection,
      UserDetailsBody,
      UserDetailsSidebar,
      LayoutSidebar
    },
    props: {
      username: {
        type: String,
        default: 'undefined'
      }
    },

    $dataPreload() {
      return this.$store.dispatch('userDetails/loadUserDetailsPage', {
        username: decodeURIComponent(this.username)
      });
    }
  };
</script>

<style lang="less" scoped>
</style>
