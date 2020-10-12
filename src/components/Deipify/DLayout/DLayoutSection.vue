<template>
  <div
    :class="componentData.class"
    class="pos-relative"
    :style="componentData.style"
    v-on="componentData.on"
  >
    <v-img
      v-if="background"
      ref="image"
      v-bind="bgProps"
      :src="background"
      class="pos-absolute fill-box"
      :style="{zIndex: -1}"
    />
    <slot />
  </div>
</template>

<script>
  // only for template logic

  import { VSheet } from 'vuetify/lib/components';
  import { colorChores } from '@/mixins/chores';

  export default {
    name: 'DLayoutSectionRe',
    mixins: [VSheet, colorChores],
    props: {
      background: {
        type: String,
        default: null
      },
      alignContent: {
        type: String,
        default: 'stretch'
      }
    },
    data() {
      return {
        bgDominant: undefined
      };
    },
    computed: {
      componentData() {
        const data = {
          class: {
            ...this.classes,
            ...{
              'd-flex': true,
              [`align-${this.alignContent}`]: true
            }
          },
          style: {
            ...this.styles,
            ...{
              zIndex: 1
            }
          },
          on: this.listeners$
        };

        return this.setBackgroundColor(this.color, data); // method from VSheet
      },

      isDark() {
        if (this.dark || this.sectionIsDark) {
          return true;
        }

        if (this.light || !(this.sectionIsDark)) {
          return false;
        }

        // inherit from parent, or default false if there is none
        return this.theme.isDark;
      },

      sectionIsDark() {
        return this.background ? this.isDarkColor(this.bgDominant) : this.theme.isDark;
      },

      bgProps() {
        return {
          ...(this.bgDominant ? { gradient: 'to top, rgba(0,0,0,.8), transparent' } : {})
          // ...(this.bgDominant ? { gradient: `to top, ${this.bgDominant}, transparent` } : {})
        };
      },
    },

    created() {
      if (this.background) {
        this.getBgDominant();
      }
    },

    methods: {
      getBgDominant() {
        this.getDominantColor(this.background)
          .then((res) => {
            this.bgDominant = this.rgbToHex(res);
          });
      }
    }
  };
</script>
