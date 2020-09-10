<template>
  <div :class="$style.host" :style="vars">
    <slot />
  </div>
</template>

<script>
  import { convertToUnit } from 'vuetify/lib/util/helpers';

  export default {
    name: 'DGrid',
    props: {
      itemMaxWidth: {
        type: [Number, String],
        default: 0
      }
    },
    computed: {
      vars() {
        if (this.itemMaxWidth) {
          return {
            '--grid-item-max-width': convertToUnit(this.itemMaxWidth)
          };
        }
        return false;
      }
    }
  };
</script>

<style module lang="scss">
  .host {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--grid-item-max-width, 280px), 1fr));
    grid-gap: 1.5rem;
  }
</style>
