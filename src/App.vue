<template>
  <v-app id="deip-app">
    <toolbar
      v-if="!$route.meta.withoutHeader && !$route.path.includes('/admin')"
      :is-grants-transparency-demo="isGrantsTransparencyDemo"
    />
    <toolbar-admin v-if="$route.path.includes('/admin') && !$route.meta.withoutHeader" />
    <portal-target name="toolbar" />

    <router-view :key="$route.fullPath" name="navigator" />

    <v-content :key="$route.fullPath">
      <router-view :key="$route.fullPath" />
    </v-content>

    <d-snackbar />
  </v-app>
</template>

<script>
  import { mapGetters } from 'vuex';

  import { AccessService } from '@deip/access-service';
  import { AppConfigService } from '@deip/app-config-service';
  import ToolbarAdmin from '@/components/layout/components/ToolbarAdmin';
  import DSnackbar from '@/components/Deipify/DSnackbar/DSnackbar';

  const accessService = AccessService.getInstance();
  const appConfigService = AppConfigService.getInstance();

  export default {

    name: 'App',
    components: { DSnackbar, ToolbarAdmin },
    data() {
      return {
        isGrantsTransparencyDemo: false
      };
    },

    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    },

    created() {
      const pollNotifications = () => {
        if (accessService.isLoggedIn()) {
          this.$store.dispatch('auth/loadNotifications');
        }
      };
      pollNotifications();
      setInterval(pollNotifications, 10000);
      const env = appConfigService.get('env');
      this.isGrantsTransparencyDemo = env.DEMO == 'GRANT-DISTRIBUTION-TRANSPARENCY';
    }
  };
</script>

<style lang="scss">
  @import '~vuetify/src/styles/styles.sass';

  #deip-app {
    font-family: 'Roboto', 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>
