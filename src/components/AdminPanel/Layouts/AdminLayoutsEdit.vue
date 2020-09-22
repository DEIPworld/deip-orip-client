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

    <v-card flat class="pa-4">
      <admin-layouts-composer
        v-model="schema"
      />
    </v-card>

    <pre>{{ JSON.stringify(schema, null, 2) }}</pre>


  </d-layout-full-screen>
</template>

<script>
  import DLayoutFullScreen from '@/components/Deipify/DLayout/DLayoutFullScreen';
  import {
    baseLayoutModules,
    gridModules,
    helperLayoutModules,
    typographyModules
  } from '@/components/AdminPanel/Layouts/modules';
  import AdminLayoutsModules from '@/components/AdminPanel/Layouts/_partials/AdminLayoutsModules';
  import AdminLayoutsComposer from '@/components/AdminPanel/Layouts/_partials/AdminLayoutsComposer';

  export default {
    name: 'AdminLayoutsEdit',
    components: { AdminLayoutsComposer, AdminLayoutsModules, DLayoutFullScreen },
    data() {
      return {
        schema: [],
      };
    },
    computed: {
      modules() {
        return [
          {
            name: 'Base Layout',
            modules: baseLayoutModules
          },
          {
            name: 'Layout helpers',
            modules: helperLayoutModules
          },
          {
            name: 'Grid',
            modules: gridModules
          },
          {
            name: 'Typography',
            modules: typographyModules
          },
          {
            name: 'Attributes',
            modules: this.$tenantSettings.researchAttributes
              .map((attr) => ({
                component: 'AttributesRead',
                name: attr.title,
                props: {
                  attribute: `@research.researchRef.attributes.${attr._id}`
                },
                id$: attr._id
              }))
          }
        ];
      }
    }
  };
</script>
