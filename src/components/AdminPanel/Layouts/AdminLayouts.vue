<template>
  <d-layout-section>
    <d-layout-section-main>
      <d-grid>
        <v-card
          v-for="(key, index) of Object.keys(layouts)"
          :key="index"
          outlined
          :to="{ name: 'admin.layouts.edit', params: { layoutName: key} }"
        >
          <v-list-item>
            <v-list-item-icon class="mr-4">
              <v-icon>{{ layouts[key].icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="text-h6">
              {{ layouts[key].name }}
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </d-grid>
    </d-layout-section-main>
  </d-layout-section>
</template>

<script>

  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';

  import DGrid from '@/components/Deipify/DGrid/DGrid';
  import { baseLayouts } from '@/components/AdminPanel/Layouts/layouts';



  export default {
    name: 'AdminLayouts',
    components: {
      DGrid,
      DLayoutSectionMain,
      DLayoutSection
    },
    data() {
      return {
        schema: []
      };
    },
    computed: {
      layouts() {
        return {
          ...baseLayouts(),
          ..._.cloneDeep(this.$portalSettings.layouts)
        };
      }
    }
  };
</script>

Layouts
-- index.vue
-- Edit
---- index.vue
---- Modules
------ index.vue
---- Composer
------ index.vue
------ Nodes
-------- index.vue
------ Node
-------- index.vue
-------- Types
---------- ...
