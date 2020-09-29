<template>
  <d-layout-full-screen full-width color="grey lighten-4" :title="layoutData.name">
    <portal to="sidebar">
      <v-navigation-drawer
        :width="280"
        app
        clipped
        permanent
      >
        <admin-layouts-modules
          :layout-type="layoutData.type"
        />
      </v-navigation-drawer>
    </portal>

    <v-btn
      class="ma-8"
      color="primary"
      fab
      fixed
      bottom
      right
      @click="safeSettings()"
    >
      <v-icon
        size="24"
      >
        mdi-content-save
      </v-icon>
    </v-btn>

    <admin-layouts-composer
      v-model="schema"
    />

    <pre>{{ JSON.stringify(schema, null, 2) }}</pre>
  </d-layout-full-screen>
</template>

<script>
  import DLayoutFullScreen from '@/components/Deipify/DLayout/DLayoutFullScreen';

  import AdminLayoutsModules from '@/components/AdminPanel/Layouts/Composer/Modules/AdminLayoutsModules';
  import AdminLayoutsComposer from '@/components/AdminPanel/Layouts/Composer/AdminLayoutsComposer';

  import { baseLayouts } from '@/components/AdminPanel/Layouts/layouts';
  import { TenantService } from '@deip/tenant-service';

  const tenantService = TenantService.getInstance();

  export default {
    name: 'AdminLayoutsEdit',
    components: {
      AdminLayoutsComposer,
      AdminLayoutsModules,
      DLayoutFullScreen
    },
    data() {
      return {
        schema: [],
        schemaCache: JSON.stringify([]),
        processing: false
      };
    },
    computed: {

      layoutKey() {
        return this.$route.params.layoutName;
      },

      layoutData() {
        return {
          ...baseLayouts()[this.layoutKey],
          ..._.cloneDeep(this.$tenantSettings.researchLayouts[this.layoutKey])
        };
      },

      modelChanged() {
        return this.schemaCache !== JSON.stringify(this.schema);
      }
    },

    created() {
      this.schema = _.cloneDeep(this.layoutData.layout);
      this.schemaCache = JSON.stringify(this.schema);
    },

    methods: {
      safeSettings() {
        this.processing = true;

        const clonedProfile = _.cloneDeep(this.$tenant.profile);

        clonedProfile.settings.researchLayouts[this.layoutKey] = {
          ...this.layoutData,
          ...{
            layout: this.schema
          }
        };

        // clonedProfile.settings.researchLayouts = baseLayouts();

        tenantService.updateTenantProfile(clonedProfile)
          .then(() => {
            this.$notifier.showSuccess();
            const tenant = this.$env.TENANT;
            this.$store.dispatch('auth/loadTenant', { tenant });
            // this.$router.push({
            //   name: 'admin.layouts'
            // });
            this.processing = false;
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError();
            this.processing = false;
          });
      }
    }
  };
</script>
