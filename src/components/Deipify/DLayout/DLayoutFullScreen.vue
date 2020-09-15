<template>
  <v-sheet
    :class="contentClasses"
    v-bind="contentAttrs"
  >
    <portal to="sidebar">
      <div class="d-none">
        <!-- hide sidebar if present -->
      </div>
    </portal>

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
      },
      fullWidth: {
        type: Boolean,
        default: false
      },
      noGutters: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      contentAttrs() {
        return {
          ...(!this.fullWidth ? { maxWidth: convertToUnit(this.contentWidth) } : {})
        };
      },
      contentClasses() {
        return {
          'mx-auto': !this.fullWidth,
          'pa-12': !this.noGutters
        };
      }
    }
  };
</script>
