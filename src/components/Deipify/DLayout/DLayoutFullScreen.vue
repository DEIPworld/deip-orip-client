<template>
  <v-sheet
    :class="contentClasses"
    :style="contentStyles"
    v-bind="contentAttrs"
    width="100%"
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
        <v-btn icon @click="clickBack">
          <v-icon>arrow_back</v-icon>
        </v-btn>

        <v-toolbar-title v-if="title" class="text-truncate" style="max-width: 420px">
          {{ title }}
        </v-toolbar-title>
      </v-app-bar>
    </portal>

    <slot />
  </v-sheet>
</template>

<script>
  import { convertToUnit } from 'vuetify/lib/util/helpers';
  import Colorable from 'vuetify/lib/mixins/colorable';

  export default {
    name: 'DLayoutFullScreen',
    mixins: [Colorable],

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
          'pa-12': !this.noGutters,
          spacer: true,
          ...(this.setBackgroundColor(this.color).class || {})
        };
      },
      contentStyles() {
        return {
          ...(this.setBackgroundColor(this.color).style || {})
        };
      }
    },
    methods: {
      clickBack() {
        if (this.$listeners['click-back']) {
          this.$emit('click-back');
        } else {
          this.$router.back();
        }
      }
    }
  };
</script>
