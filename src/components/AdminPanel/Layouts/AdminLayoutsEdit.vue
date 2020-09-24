<template>
  <d-layout-full-screen full-width color="grey lighten-4">
    <!--    <pre>{{$tenantSettings}}</pre>-->
    <portal to="sidebar">
      <v-navigation-drawer
        :width="280"
        app
        clipped
        permanent
      >
        <admin-layouts-modules
          :modules="modules"
        />
      </v-navigation-drawer>
    </portal>

    <v-btn
      class="ma-8"
      color="primary"
      :disabled="!modelChanged || processing"
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

    <v-card flat>
      <v-sheet color="grey lighten-2" class="pa-3 d-flex">
        <v-avatar
          v-for="(x, index) of new Array(3)"
          :key="index"
          size="12"
          color="white"
          class="mr-2"
        />
      </v-sheet>
      <admin-layouts-composer
        v-model="schema"
        class="pa-12"
      />
    </v-card>

    <pre>{{ JSON.stringify(schema, null, 2) }}</pre>
  </d-layout-full-screen>
</template>

<script>
  import DLayoutFullScreen from '@/components/Deipify/DLayout/DLayoutFullScreen';

  import {
    modulesLayout,
    modulesGrid,
    modulesHelpers,
    modulesTypography,
    setComponentProps,
    extendModuleObject
  } from '@/components/AdminPanel/Layouts/modules';

  import AdminLayoutsModules from '@/components/AdminPanel/Layouts/_partials/AdminLayoutsModules';
  import AdminLayoutsComposer from '@/components/AdminPanel/Layouts/_partials/AdminLayoutsComposer';

  import { baseLayouts } from '@/components/AdminPanel/Layouts/baseLayouts';
  import { TenantService } from '@deip/tenant-service';
  import { ATTR_TYPES_ICONS } from '@/variables';

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
      attrModules() {
        const forSets = (attr) => ({
          component: 'AttributesSet',
          model: `researchRef.attributes.${attr._id}`,
          props: {
            attribute: `@attributes.${attr._id}`
          }
        });

        const forReads = (attr) => ({
          component: 'AttributesRead',
          ...(/text|textarea/.test(attr.type)
            ? setComponentProps({
              clamped: 'number'
            })
            : {}),
          ...{
            props: {
              attribute: `@research.researchRef.attributes.${attr._id}`
            }
          }
        });

        return this.$tenantSettings.researchAttributes
          .map((attr) => ({
            icon: ATTR_TYPES_ICONS[attr.type],
            name: attr.shortTitle || attr.title,
            ...(this.layoutKey.includes('Form') ? forSets(attr) : forReads(attr))
          }));
      },

      modules() {
        return [
          {
            name: 'Base Layout',
            modules: extendModuleObject(modulesLayout)
          },
          {
            name: 'Layout helpers',
            modules: extendModuleObject(modulesHelpers)
          },
          {
            name: 'Grid',
            modules: extendModuleObject(modulesGrid)
          },
          {
            name: 'Typography',
            modules: extendModuleObject(modulesTypography, { type: 'typography' })
          },
          {
            name: 'Attributes',
            modules: extendModuleObject(this.attrModules, { type: 'attribute' })
          }
        ];
      },

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

        tenantService.updateTenantProfile(clonedProfile)
          .then(() => {
            this.$notifier.showSuccess();
            const tenant = this.$env.TENANT;
            this.$store.dispatch('auth/loadTenant', { tenant });
            this.$router.push({
              name: 'admin.layouts'
            });
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
