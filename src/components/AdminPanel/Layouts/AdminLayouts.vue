<template>
  <d-layout-section>
    <d-layout-section-main>
      <v-row>
        <v-col>
          <admin-layouts-composer
            :schema="inbox"
          />
        </v-col>
        <v-divider vertical />
        <v-col>
          <admin-layouts-composer
            :schema="schema"
          />
        </v-col>
        <v-divider vertical />
        <v-col>
          <pre>
            {{schema}}
          </pre>
        </v-col>
      </v-row>
    </d-layout-section-main>
  </d-layout-section>


</template>

<script>
  import AdminLayoutsComposer from '@/components/AdminPanel/Layouts/AdminLayoutsComposer';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';

  export default {
    name: 'AdminLayouts',
    components: { DLayoutSectionMain, DLayoutSection, AdminLayoutsComposer },
    data() {
      return {
        inbox: [

          { component: 'd-layout-section-header', children: [] },
          { component: 'd-layout-section-section', children: [] },
          { component: 'd-layout-section-main', children: [] },
          { component: 'd-layout-section-sidebar', children: [] }
        ],

        schema: []
      };
    }
  };
</script>
