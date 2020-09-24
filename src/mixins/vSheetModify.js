import { VSheet } from 'vuetify/lib/components';

export const vSheetModify = {
  mixins: [VSheet],
  props: {
    color: {
      type: String,
      default: 'transparent'
    }
  },
  computed: {
    additionalClasses() {
      return { };
    },
    additionalStyles() {
      return { };
    }
  },
  render(h) {
    const data = {
      class: {
        ...this.classes,
        ...this.additionalClasses
      },
      style: {
        ...this.styles,
        ...this.additionalStyles
      },
      on: this.listeners$
    };
    return h(this.tag, this.setBackgroundColor(this.color, data), [this.$slots.default]);
  }
}
