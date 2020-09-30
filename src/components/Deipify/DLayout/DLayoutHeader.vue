<template>
  <component
    :is="headerComponent"
    v-bind="headerProps"
  >
    <d-layout-section>
      <d-layout-section-main>
        <slot />
      </d-layout-section-main>
    </d-layout-section>
  </component>
</template>

<script>
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import { VImg, VSheet } from 'vuetify/lib/components';
  import { convertToUnit } from 'vuetify/lib/util/helpers';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';

  export default {
    name: 'DLayoutHeader',
    components: {
      DLayoutSectionMain,
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
        default: 280
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
