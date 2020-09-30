<template>
  <v-sheet
    class="mb-12"
    tile
    :max-width="maxWidth"
  >
    <div v-if="title" class="text-h6 mb-4">
      {{ title }}
    </div>
    <v-row class="ma-n3">
      <slot />
    </v-row>
  </v-sheet>
</template>

<script>
  // TODO: deprecated
  export default {
    name: 'DFormBlock',
    props: {
      maxWidth: {
        type: [String, Number],
        default: null
      },
      title: {
        type: [String],
        default: null
      }
    }
  };
</script>
