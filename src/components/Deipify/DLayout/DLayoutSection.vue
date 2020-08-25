<template>
  <div class="d-flex align-stretch">
    <div class="pa-6 pa-md-12 flex-grow-1 flex-shrink-1">
      <slot />
    </div>
    <v-navigation-drawer
      v-if="$hasSlot('sidebar')"
      class="flex-shrink-0"
      :width="280"
      height="auto"
      permanent
      right
    >
      <div>
        <slot name="sidebar" />
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
  export default {
    name: 'DLayoutSection'
  };
</script>
