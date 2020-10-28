

import { tenantAttributes } from '@/mixins/platformAttributes';
import { pascalCase } from 'change-case';

export const attributeTypeComponent = {
  mixins: [tenantAttributes],
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
  data() {
    return {
      allowedViewTypes$: ['default'],
      defaultViewType$: 'default'
    };
  },
  computed: {
    attributeViewTypeComponent() {
      const viewType = this.viewType && this.allowedViewTypes$.includes(this.viewType)
        ? this.viewType
        : this.defaultViewType$;
      return `${this.$options.name}${pascalCase(viewType)}`;
    },

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
  }
};
