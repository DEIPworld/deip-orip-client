<template>
  <div>
    <account-sidebar />
    <router-view v-if="dataLoaded" />
    <router-view name="fullscreen" />
  </div>
</template>

<script>
  import AccountSidebar from '@/components/Account/components/AccountSidebar';

  export default {
    name: 'AccountView',
    components: { AccountSidebar },

    $dataPreload() {
      return this.$store.dispatch('account/loadUserAccount', {
        username: decodeURIComponent(this.$store.getters['auth/user'].account.name)
      });
    }
  };
</script>

<style scoped>

</style>
