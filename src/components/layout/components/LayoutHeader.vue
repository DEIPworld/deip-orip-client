<template>
  <v-sheet
    tile
    :dark="isDark"
    :light="!isDark"
    class="app-layout__header d-flex align-end"
    :class="classList"
    :style="{ backgroundImage: 'url(' + background + ')'}"
  >
    <div class="app-layout__header-inner pa-6 pa-sm-12">
      <v-sheet :max-width="fullWidth ? '100%' : 800" color="transparent" :class="contentClass">
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
        default: null
      },
      muted: {
        type: Boolean,
        default: false
      },
      dark: {
        type: Boolean,
        default: true
      },
      light: {
        type: Boolean,
        default: false
      },
      fullWidth: {
        type: Boolean,
        default: false
      },
      centered: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      classList() {
        return {
          'app-layout__header--muted': this.muted === true,
        };
      },
      contentClass() {
        return {
          'mx-auto': this.centered
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
