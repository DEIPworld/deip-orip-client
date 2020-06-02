<template>
  <div v-if="$ready">
    <account-sidebar v-if="!$route.meta.hideSidebar" />
    <router-view v-if="dataLoaded" />
  </div>
</template>

<script>
  import AccountSidebar from '@/components/Account/components/AccountSidebar';

  export default {
    name: 'AccountView',
    components: { AccountSidebar },

    created() {
      this.$store.dispatch('account/loadUserAccount', {
        username: decodeURIComponent(this.$store.getters['auth/user'].account.name)
      }).then(() => {
        this.$setReady();
      });
    }
  };
</script>

<style scoped>

</style>
