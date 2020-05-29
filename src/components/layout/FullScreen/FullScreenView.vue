<template>
  <div class="full-height">
    <portal v-if="!hideToolbar" to="toolbar">
      <v-app-bar
        flat
        :app="!toolbarOverlap"
        :absolute="toolbarOverlap"
        :color="toolbarColor"
        :style="{borderBottom: toolbarColor === 'transparent' ? '0 !important' : false}"
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
    </portal>

    <v-sheet
      :height="height"
      :max-width="maxWidth || 800"
      class="mx-auto"
      :class="{'pa-12': !noGutters}"
    >
      <slot />
    </v-sheet>
  </div>
</template>

<script>
  import { FullScreenMixin } from '@/components/layout/FullScreen/FullScreenMixin';

  export default {
    name: 'FullScreenView',
    mixins: [FullScreenMixin]
  };
</script>

<style scoped>

</style>
