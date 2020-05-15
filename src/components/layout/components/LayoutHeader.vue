<template>
  <v-sheet
    tile
    :dark="isDark"
    :light="!isDark"
    class="app-layout__header d-flex align-end justify-center"
    :class="classList"
    :style="{ backgroundImage: 'url(' + background + ')'}"
  >
    <div class="app-layout__header-inner pa-6 pa-sm-12">
      <v-sheet :max-width="fullWidth ? '100%' : 800" color="transparent">
        <slot />
      </v-sheet>
    </div>
  </v-sheet>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'LayoutHeader',
    props: {
      background: {
        type: String,
        required: false,
        default: null
      },
      muted: {
        type: Boolean,
        required: false,
        default: true
      },
      dark: {
        type: Boolean,
        required: false,
        default: true
      },
      light: {
        type: Boolean,
        required: false,
        default: false
      },
      fullWidth: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    computed: {
      classList() {
        return {
          'app-layout__header--muted': this.muted === true
        };
      },
      isDark() {
        return this.light !== true;
      },
      ...mapGetters({
        themeSettings: 'layout/themeSettings'
      })
    }
  };
</script>
