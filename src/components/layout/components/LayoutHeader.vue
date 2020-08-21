<template>
  <v-sheet :dark="dark">
    <v-img
      :src="background"
      :gradient="gradient"
      width="100%"
      height="100%"
      min-height="320px"
      aspect-ratio="0"
    >
      <div class="fill-height d-flex align-end">
        <v-sheet
          width="100%"
          :max-width="maxWidth"
          :class="contentClassList"
          color="transparent"
        >
          <slot />
        </v-sheet>
      </div>
    </v-img>
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
      gradient: {
        type: String,
        default: 'to top, rgba(0,0,0,.7), rgba(0,0,0,.3)'
      },
      dark: {
        type: Boolean,
        default: true
      },
      maxWidth: {
        type: [String, Number],
        default: 800
      },
      contentCenter: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapGetters({
        themeSettings: 'layout/themeSettings'
      }),
      contentClassList() {
        return {
          'pa-6': true,
          'pa-sm-12': true,
          'my-auto': this.contentCenter
        };
      }
    }
  };
</script>
