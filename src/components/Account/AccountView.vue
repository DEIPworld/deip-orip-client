<template>
  <div>
    <portal to="sidebar">
      <account-sidebar v-if="!$route.meta.hideSidebar" />
    </portal>
    <router-view />
  </div>
</template>

<script>
  import AccountSidebar from '@/components/Account/components/AccountSidebar';

  export default {
    name: 'AccountView',
    components: { AccountSidebar }
  };
</script>

<style scoped>

</style>
