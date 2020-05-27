<template>
  <v-dialog
    :value="open"
    fullscreen
    hide-overlay
    :transition="false"
    scrollable
  >
    <v-card tile>
      <v-app-bar
        flat
        absolute
        color="#fff"
      >
        <v-btn @click="open = false" icon>
          <v-icon>arrow_back</v-icon>
        </v-btn>

        <v-toolbar-title v-if="title">{{ title }}</v-toolbar-title>
      </v-app-bar>

      <v-card-text
        class="pb-0 px-0 full-height"
        style="padding-top: 64px"
      >
        <v-sheet
          :height="height"
          :max-width="maxWidth || 800"
          class="mx-auto"
          :class="{'pa-12': !noGutters}"
        >
          <slot />
        </v-sheet>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  import { FullScreenMixin } from '@/components/layout/FullScreen/FullScreenMixin';

  export default {
    name: 'FullScreenModal',
    mixins: [FullScreenMixin],

    props: {
      value: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      open: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('input', value);
        }
      }
    }
  };
</script>

<style scoped>

</style>
