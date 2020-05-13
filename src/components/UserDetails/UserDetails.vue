<template>
  <base-page-layout v-if="dataLoaded">
    <template #sidebar>
      <layout-sidebar right>
        <user-details-sidebar />
      </layout-sidebar>
    </template>
    <user-details-body />
  </base-page-layout>
</template>

<script>
  import LayoutSidebar from '@/components/layout/components/LayoutSidebar';
  import UserDetailsSidebar from '@/components/UserDetails/components/UserDetailsSidebar';
  import UserDetailsBody from '@/components/UserDetails/components/UserDetailsBody';

  export default {
    name: 'UserDetails',
    components: {
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
