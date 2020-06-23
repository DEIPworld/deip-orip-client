<template>
  <v-app>
<!--    <v-overlay v-if="!$ready" color="#fff">-->
<!--      <v-sheet min-width="320px">-->
<!--        <v-progress-linear-->
<!--          indeterminate-->
<!--          rounded-->
<!--          absolute-->
<!--          color="primary"-->
<!--        />-->
<!--      </v-sheet>-->
<!--    </v-overlay>-->

    <v-sheet v-if="$ready" min-height="100%">

      <portal-target :key="$route.fullPath + '-toolbar'" name="toolbar">
        <toolbar
          v-if="!$route.meta.withoutHeader && !$route.path.includes('/admin')"
          :is-grants-transparency-demo="isGrantsTransparencyDemo"
        />
      </portal-target>

      <portal-target :key="$route.fullPath + '-navigator'" name="navigator" />

      <router-view :key="$route.fullPath" name="navigator" />

      <v-main :key="$route.fullPath + '-main'" style="min-height: 100%">
        <router-view :key="$route.fullPath" />
      </v-main>

      <d-snackbar />
    </v-sheet>
  </v-app>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';
  import { AccessService } from '@deip/access-service';
  import ToolbarAdmin from '@/components/layout/components/ToolbarAdmin';
  import DSnackbar from '@/components/Deipify/DSnackbar/DSnackbar';
  import deepmerge from 'deepmerge';

  const accessService = AccessService.getInstance();

  export default {

    name: 'App',
    components: {
      DSnackbar,
      ToolbarAdmin
    },
    data() {
      return {
        isGrantsTransparencyDemo: false
      };
    },

    computed: {
      ...mapGetters({
        user: 'auth/user',
        tenant: 'auth/tenant'
      })
    },

    created() {
      const preload = [];

      if (accessService.isLoggedIn()) {
        preload.push(this.$store.dispatch('auth/loadUser'));
      }

      const tenant = this.$env.TENANT || null;
      if (tenant) {
        preload.push(this.$store.dispatch('auth/loadTenant', { tenant }));
      }

      Promise.all(preload)
        .then(() => {
          this.setTheme();

          if (this.tenant) {
            document.title = `${this.tenant.profile.name} | DEIP`;
          }

          this.$setReady();
        });

      this.isGrantsTransparencyDemo = this.$env.DEMO === 'GRANT-DISTRIBUTION-TRANSPARENCY';
    },

    methods: {
      setTheme() {
        // TODO: add setTheme from tenant

        this.$vuetify.theme.themes.light = deepmerge(
          this.$vuetify.theme.themes.light,
          this.$store.getters['layout/themeSettings'].themes.light
        );

        this.$vuetify.theme.themes.dark = deepmerge(
          this.$vuetify.theme.themes.dark,
          this.$store.getters['layout/themeSettings'].themes.dark
        );
      }
    }
  };
</script>

<style lang="scss">
  @import '~vuetify/src/styles/styles.sass';
</style>
