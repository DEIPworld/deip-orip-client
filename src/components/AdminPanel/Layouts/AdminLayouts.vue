<template>
  <d-layout-section>
    <d-layout-section-main>
      <v-row>
        <v-col cols="3">
          <admin-layouts-modules
            :modules="modules"
          />
        </v-col>
        <v-divider vertical />
        <v-col>
          <admin-layouts-composer
            title="Layout"
            :schema="schema"
          />
        </v-col>
      </v-row>

      <pre>
        {{ schema }}
      </pre>
    </d-layout-section-main>
  </d-layout-section>


</template>

<script>

  import AdminLayoutsComposer from '@/components/AdminPanel/Layouts/AdminLayoutsComposer';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';

  import { layoutModules } from '@/components/AdminPanel/Layouts/modules';
  import AdminLayoutsModules from '@/components/AdminPanel/Layouts/AdminLayoutsModules';

  export default {
    name: 'AdminLayouts',
    components: {
      AdminLayoutsModules,
      DLayoutSectionMain,
      DLayoutSection,
      AdminLayoutsComposer
    },
    data() {
      return {
        schema: [],
      };
    },
    computed: {
      modules() {
        return {
          layout: {
            name: 'Layout',
            modules: layoutModules
          },
          attributes: {
            name: 'Attributes',
            modules: this.$tenantSettings.researchAttributes
              .map((attr) => ({
                component: 'AttributesRead',
                name: attr.title,
                props: {
                  attributeId: attr._id
                }
              }))
          }
        };
      }
    }
  };
</script>
