<template>
  <component
    :is="headerComponent"
    v-bind="headerProps"
  >
    <d-layout-section>

      <slot />

    </d-layout-section>
  </component>
</template>

<script>
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import { VImg, VSheet } from 'vuetify/lib/components';
  import { convertToUnit } from 'vuetify/lib/util/helpers';

  export default {
    name: 'DLayoutHeader',
    components: {
      DLayoutSection,
      VImg,
      VSheet
    },
    props: {
      background: {
        type: String,
        default: null
      },
      gradient: {
        type: String,
        default: 'to top, rgba(0,0,0,.7), rgba(0,0,0,.3)'
      },
      minHeight: {
        type: [Number, String],
        default: 320
      }
    },
    computed: {
      headerComponent() {
        return this.background ? 'v-img' : 'v-sheet';
      },

      headerProps() {
        return this.background
          ? {
            src: this.background,
            gradient: this.gradient,
            dark: true,
            width: '100%',
            minHeight: convertToUnit(this.minHeight),
            aspectRatio: '0',
            class: 'd-flex align-end'
          }
          : {};
      }
    }
  };
</script>
