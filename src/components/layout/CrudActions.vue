<template>
  <div class="crud-actions" :class="classList">
    <slot />
  </div>
</template>

<script>
  export default {
    name: 'CrudActions',
    props: {
      row: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      classList() {
        return {
          'crud-actions--row': this.row === true
        };
      }
    }
  };
</script>

<style lang="scss">
  .crud-actions {
    display: grid;
    gap: 8px;

    &--row {
      grid-auto-columns: min-content;
      grid-auto-flow: column;
    }

    .v-data-table & {
      display: inline-grid;
      opacity: 0;
      transition: 0.2s ease-in-out;
    }

    .v-data-table tr:hover & {
      opacity: 1;
    }
  }
</style>
