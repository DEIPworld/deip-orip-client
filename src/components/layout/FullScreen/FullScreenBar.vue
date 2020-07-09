<template>
  <v-app-bar
    :key="$route.fullPath + '-toolbar'"
    flat
    clipped-left
    :app="!toolbarOverlap"
    :absolute="toolbarOverlap"
    :color="toolbarColor"
    class="v-app-bar--light"
  >
    <slot name="toolbarButton">
      <v-btn icon @click="$router.back()">
        <v-icon>arrow_back</v-icon>
      </v-btn>
    </slot>

    <v-toolbar-title v-if="title">
      {{ title }}
    </v-toolbar-title>

  </v-app-bar>
</template>

<script>
  import { FullScreenBarMixin } from '@/components/layout/FullScreen/FullScreenMixin';

  export default {
    name: 'FullScreenBar',
    mixins: [FullScreenBarMixin],
    props: {
      toolbarOverlap: {
        type: Boolean,
        default: false
      },
      toolbarColor: {
        type: String,
        default: 'white'
      },
      title: {
        type: String,
        default: null
      }
    }
  };
</script>

<style scoped>

</style>
