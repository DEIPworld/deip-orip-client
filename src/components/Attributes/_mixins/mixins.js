import { tenantAttributes } from '@/mixins/platformAttributes';
import { pascalCase } from 'change-case';
import { commonProps } from '@/variables/props';

const componentTypeRender = {
  name: 'componentTypeRender',
  methods: {
    genComponent() {
      const self = this;

      return this.$createElement(this.attributeComponent, {
        props: {
          value: this.internalValue,
          attribute: this.attribute,
          viewType: this.viewType
        },
        class: {
          'visually-hidden': this.attribute.isHidden
        },
        on: {
          change(e) {
            self.$emit('change', e);
          }
        }
      }, null);
    }
  }
};

export const attributeTypeComponent = {
  mixins: [tenantAttributes, componentTypeRender],

  computed: {
    attributeComponent() {
      const a = this.$options.name.split(/(?=[A-Z])/);
      let t;

      if (this.type) {
        t = this.type;
      } else if (this.attribute.type) {
        t = this.attribute.type;
      } else if (this.attribute.researchAttributeId) {
        t = this.tenantAttributes.find(({ _id }) => _id === this.attribute.researchAttributeId).type;
      } else {
        throw new Error('Unknown attribute');
      }

      a.splice(1, 0, pascalCase(t));

      return a.join('');
    }
  }
};

export const attributeViewTypeComponent = {
  mixins: [componentTypeRender],

  props: {
    ...commonProps.attribute,
    ...commonProps.viewType
  },

  computed: {
    attributeComponent() {
      const defaultView = `${this.$options.name}${pascalCase('default')}`;

      if (this.viewType) {
        const requestedView = `${this.$options.name}${pascalCase(this.viewType)}`;
        const requestedViewExist = Object.keys(this.$options.components)
          .includes(requestedView);
        return requestedViewExist ? requestedView : defaultView;
      }
      return defaultView;
    }
  },
  render() {
    return this.genComponent();
  }
};
