<template>
  <v-card outlined>
    <div class="d-flex">
      <v-card-text>
        <slot />
      </v-card-text>
      <v-divider vertical />
      <crud-actions class="pa-4">
        <slot name="actions" />
      </crud-actions>
    </div>
  </v-card>
</template>

<script>
  import CrudActions from '@/components/layout/CrudActions';

  export default {
    name: 'SideActionsCard',
    components: { CrudActions }
  };
</script>

<style lang="scss">

</style>
