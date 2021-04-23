import { attributesChore } from '@/mixins/chores/attributesChore';
import { pascalCase } from 'change-case';

const componentTypeRender = {
  name: 'componentTypeRender',
  methods: {
    genComponent() {
      const self = this;

      const project = this.project || this.$attrs.project;

      return this.$createElement(this.attributeComponent, {
        props: {
          value: this.internalValue,
          attribute: this.attribute,
          viewType: this.viewType,
          ...(project ? { project } : {})
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
  mixins: [attributesChore, componentTypeRender],

  computed: {
    attributeComponent() {
      const a = this.$options.name.split(/(?=[A-Z])/);
      let t;

      if (this.type) {
        t = this.type;
      } else if (this.attribute.type) {
        t = this.attribute.type;
      } else if (this.attribute.attributeId) {
        const attr = this.$$networkAttributes.find(({ _id }) => _id === this.attribute.attributeId);
        t = attr.type;
      } else {
        throw new Error('Unknown attribute');
      }

      a.splice(1, 0, pascalCase(t));

      return a.join('');
    }
  }
};

export const attributeViewTypeComponentFactory = (defaultViewType) => ({
  mixins: [componentTypeRender],

  props: {
    attribute: {
      type: Object,
      default: () => ({})
    },
    viewType: {
      type: String,
      default: undefined
    }
  },

  computed: {
    attributeComponent() {
      const defaultView = `${this.$options.name}${pascalCase(defaultViewType)}`;

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
});

export const attributeViewTypeComponent = attributeViewTypeComponentFactory('default');
