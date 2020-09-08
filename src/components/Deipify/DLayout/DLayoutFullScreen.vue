<template>
  <v-sheet
    class="mx-auto pa-12"
    v-bind="contentAttrs"
  >
    <portal to="toolbar">
      <v-app-bar
        :key="$route.fullPath + '-toolbar'"
        flat
        app
        clipped-left
        clipped-right
        outlined
      >
        <v-btn icon @click="$router.back()">
          <v-icon>arrow_back</v-icon>
        </v-btn>

        <v-toolbar-title v-if="title">
          {{ title }}
        </v-toolbar-title>
      </v-app-bar>
    </portal>

    <slot />
  </v-sheet>
</template>

<script>
  import { convertToUnit } from 'vuetify/lib/util/helpers';

  export default {
    name: 'DLayoutFullScreen',
    props: {
      title: {
        type: String,
        default: null
      },
      contentWidth: {
        type: [Number, String],
        default: 800
      }
    },
    computed: {
      contentAttrs() {
        return {
          maxWidth: convertToUnit(this.contentWidth)
        };
      },
      dividerStyles() {
        const {
          bar, top, right, left
        } = this.$vuetify.application;

        return {
          position: 'fixed',
          zIndex: 6,
          top: `${top + bar}px`,
          right: `${right}px`,
          left: `${left}px`
        };
      }
    }
  };
</script>
