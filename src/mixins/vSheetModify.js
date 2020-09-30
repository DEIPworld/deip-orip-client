import { VSheet } from 'vuetify/lib/components/VSheet';

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
    },
    additionalChildren() {
      return [];
    },
    renderData$() {
      return {
        class: {
          ...this.classes,
          ...this.additionalClasses
        },
        style: {
          ...this.styles,
          ...this.additionalStyles
        },
        on: this.listeners$
      }
    }
  },
  methods: {
    genAdditionalChildren(h) {
      return this.additionalChildren.map((child) => h(...child));
    }
  },
  render(h) {
    return h(
      this.tag,
      this.setBackgroundColor(this.color, this.renderData$),
      [...this.genAdditionalChildren(h), this.$slots.default]
    );
  }
};
