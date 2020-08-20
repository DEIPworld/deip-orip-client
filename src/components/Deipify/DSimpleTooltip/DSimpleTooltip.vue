<template>
  <v-tooltip bottom :max-width="260" :open-delay="500">
    <template v-slot:activator="{ on }">
      <component :is="tag" v-on="on">
        <slot />
      </component>
    </template>
    <span>{{ tooltip }}</span>
    <slot name="tooltip" />
  </v-tooltip>
</template>

<script>
  export default {
    name: 'DSimpleTooltip',
    props: {
      tooltip: {
        type: String,
        default: undefined
      },
      tag: {
        type: String,
        default: 'span'
      }
    }
  };
</script>

<style scoped>

</style>
