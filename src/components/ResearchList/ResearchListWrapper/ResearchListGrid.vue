<template>
  <div :class="$style.host">
    <slot />
  </div>
</template>

<script>
  export default {
    name: 'ResearchListGrid'
  };
</script>

<style module lang="scss">
  .host {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    grid-gap: 1.5rem;
  }
</style>
