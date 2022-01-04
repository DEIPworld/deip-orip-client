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

    <portal-target
      v-if="$ready"
      name="toolbar"
      slim
    >
      <toolbar
        v-if="!$route.meta.withoutHeader"
        :key="$route.fullPath + '-toolbar'"
        :is-grants-transparency-demo="isGrantsTransparencyDemo"
      />
    </portal-target>

    <portal-target
      v-if="$ready"
      name="sidebar"
      slim
    />

    <portal-target
      v-if="$ready"
      name="sidebarRight"
      slim
    />

    <v-sheet v-if="$ready" min-height="100vh" class="d-flex flex-column">
      <v-main :key="$route.fullPath + '-main'" class="flex-grow-1 flex-shrink-1">
        <router-view :key="$route.fullPath" />
      </v-main>
    </v-sheet>

    <d-snackbar />
  </v-app>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { AccessService } from '@deip/access-service';
  import { portalsListStore } from '@/features/Tenant/store/tenantsListStore';
  import DSnackbar from '@/components/Deipify/DSnackbar/DSnackbar';
  import deepmerge from 'deepmerge';
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';

  const accessService = AccessService.getInstance();

  export default {

    name: 'App',
    components: {
      DSnackbar
    },
    mixins: [
      componentStoreFactoryOnce(portalsListStore, 'Portals')
    ],
    data() {
      return {
        isGrantsTransparencyDemo: false
      };
    },

    computed: {
      ...mapGetters({
        portal: 'auth/portal'
      })
    },

    created() {
      const preload = [
        this.$store.dispatch('auth/loadAssets'),

        this.$store.dispatch('Assets/fetch'),
        this.$store.dispatch('Portals/fetch'),
        this.$store.dispatch('Attributes/fetch'),
        this.$store.dispatch('Domains/fetch'),
        this.$store.dispatch('Auth/getCurrentUser'),
      ];

      if (accessService.isLoggedIn()) {
        preload.push(this.$store.dispatch('auth/loadUser'));
      }

      const portal = this.$env.TENANT;
      preload.push(this.$store.dispatch('auth/loadPortal', { portal }));
      preload.push(this.$store.dispatch('auth/loadNetworkInfo'));

      Promise.all(preload)
        .then(() => {
          this.setTheme();
          document.title = this.portal.profile.name;
          this.$setReady();
        });

      this.isGrantsTransparencyDemo = this.$env.DEMO === 'GRANT-DISTRIBUTION-TRANSPARENCY';

    },

    methods: {
      setTheme() {
        // TODO: add setTheme from portal

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
  /*@import '~vuetify/src/styles/styles.sass';*/
  /*@import '~vuetify/src/styles/styles.sass';*/
</style>
