<template>
  <d-layout-full-screen full-width color="grey lighten-4" :title="layoutData.name">
    <portal to="sidebar">
      <v-navigation-drawer
        :width="280 + 56"
        app
        clipped
        permanent
      >
        <admin-layouts-modules
          :layout-type="layoutData.type"
        />
      </v-navigation-drawer>
    </portal>

    <admin-layouts-composer
      v-model="schema"
      @click:remove="removeNode"
    />

    <v-btn
      class="ma-8"
      color="primary"
      fab
      fixed
      bottom
      right
      @click="saveSettings()"
    >
      <v-icon
        size="24"
      >
        mdi-content-save
      </v-icon>
    </v-btn>

    <pre>{{ JSON.stringify(schema, null, 2) }}</pre>
  </d-layout-full-screen>
</template>

<script>
  import { LayoutService } from '@deip/layout-service';
  import { find as deepFind } from 'find-keypath';
  import DLayoutFullScreen from '@/components/Deipify/DLayout/DLayoutFullScreen';

  import AdminLayoutsModules from '@/components/AdminPanel/Layouts/Composer/ModulesList/AdminLayoutsModulesList';
  import AdminLayoutsComposer from '@/components/AdminPanel/Layouts/Composer/AdminLayoutsComposer';

  import { baseLayouts } from '@/components/AdminPanel/Layouts/layouts';

  const layoutService = LayoutService.getInstance();

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
          ..._.cloneDeep(this.$tenantSettings.layouts[this.layoutKey])
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
      saveSettings() {
        this.processing = true;

        const clonedLayouts = _.cloneDeep(this.$tenant.profile.settings.layouts);

        clonedLayouts[this.layoutKey] = {
          ...this.layoutData,
          ...{
            layout: this.schema
          }
        };

        // clonedProfile.settings.layouts = baseLayouts();

        layoutService.updateLayouts(clonedLayouts)
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
      },

      removeNode(id) {
        const targetPath = deepFind(this.schema, id).slice(0, -1);
        const nodeIndex = targetPath.pop();
        let location = this.schema;

        if (targetPath.length) {
          for (const [idx, step] of targetPath.entries()) {
            location = location[step];

            if (idx === targetPath.length - 1) {
              location = location.splice(nodeIndex, 1);
            }
          }
        } else {
          location = location.splice(nodeIndex, 1);
        }
      }
    }
  };
</script>
