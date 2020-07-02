<template>
  <div v-if="$ready">
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
    components: { AccountSidebar },

    created() {
      console.log(this.$store.getters['auth/user'])
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
