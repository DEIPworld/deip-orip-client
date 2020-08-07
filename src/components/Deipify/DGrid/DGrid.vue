<template>
  <div :class="$style.host" :style="vars">
    <slot />
  </div>
</template>

<script>
  import kindOf from 'kind-of';

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
          const width = kindOf(this.itemMaxWidth) === 'number' ? `${this.itemMaxWidth}px` : this.itemMaxWidth;
          return {
            '--grid-item-max-width': width
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
