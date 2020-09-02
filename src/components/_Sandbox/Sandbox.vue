<template>
  <layout-section>
    <v-tabs v-model="tab">
      <v-tab>Layout generator</v-tab>
    </v-tabs>
    <v-divider class="mb-12" />
    <v-tabs-items v-model="tab">
      <v-tab-item><sandbox-layout /></v-tab-item>
    </v-tabs-items>
  </layout-section>
</template>

<script>
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import SandboxLayout from '@/components/_Sandbox/SandboxLayout';

  export default {
    name: 'Sandbox',
    components: { SandboxLayout, LayoutSection },
    data() {
      return {
        tab: undefined
      };
    }
  };
</script>
