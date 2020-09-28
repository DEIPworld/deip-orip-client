import Proxyable from 'vuetify/lib/mixins/proxyable';
import AttributesCommonEditOpts
  from '@/components/Attributes/_partials/Edit/AttributesCommonEditOpts';
import AttributesCommonEditMeta
  from '@/components/Attributes/_partials/Edit/AttributesCommonEditMeta';
import { ATTR_TYPES } from '@/variables';
import { tenantAttributes } from '@/mixins/platformAttributes';
import { pascalCase } from 'change-case';

export const defaultAttributeModel = () => ({
  blockchainFieldMeta: null,

  title: '',
  shortTitle: '',
  description: '',

  defaultValue: null,
  valueOptions: [],

  isPublished: true,
  isFilterable: false,
  // isEditable: true,
  isRequired: false,
  isHidden: false
});

export const PROPS = {
  type: {
    type: String,
    default: ATTR_TYPES.TEXT,
    validator(val) {
      return Object.values(ATTR_TYPES)
        .indexOf(val) !== -1;
    }
  },

  attribute: {
    type: Object,
    default: () => ({})
  },

  viewType: {
    type: String,
    default: null
  },

  clamped: {
    type: [Number, String],
    default: null
  },

  // //////////////////////////////////////////////

  attributeId: {
    type: String,
    default: undefined
  },

  multiple: {
    type: Boolean,
    default: false
  }
};

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
      const requestedView = `${this.$options.name}${pascalCase(this.viewType)}`;
      const defaultView = `${this.$options.name}${pascalCase('default')}`;
      const requestedViewExist = Object.keys(this.$options.components).includes(requestedView);
      return requestedViewExist ? requestedView : defaultView;
    }
  }
};

// //////////////////////////////////////////////

export const attributeEdit = {
  components: {
    AttributesCommonEditOpts,
    AttributesCommonEditMeta
  },
  mixins: [Proxyable],
  props: {
    type: PROPS.type
  },
  created() {
    if (!this.internalValue._id) {
      this.internalValue = {
        ...this.internalValue,
        ...defaultAttributeModel()
      };
    }
  }
};

// //////////////////////////////////////////////

export const attributeRead = {
  mixins: [tenantAttributes],
  props: {
    attribute: PROPS.attribute,
    viewType: PROPS.viewType,
    clamped: PROPS.clamped
  },
  computed: {
    attributeInfo() {
      const id = this.attribute._id || this.attribute.researchAttributeId;
      return this.tenantAttributes.find(({ _id }) => _id === id);
    }
  },
  methods: {
    genContent(h) {
      if (this.clamped) {
        return h('v-clamp', {
          props: {
            autoresize: true,
            // eslint-disable-next-line radix
            maxLines: parseInt(this.clamped)
          }
        }, this.attribute.value);
      }
      return this._v(this.attribute.value);
    }
  },
  render(h) {
    return this.genContent(h);
  }
};

export const attributeReadOption = {
  mixins: [attributeRead],
  computed: {
    valueOption() {
      return this.$where(
        this.attributeInfo.valueOptions,
        {
          '+value': this.attribute.value
        }
      )[0];
    }
  }
};

export const attributeReadText = {
  render(h) {
    if (this.clamped) {
      return h('v-clamp', {
        props: {
          autoresize: true,
          // eslint-disable-next-line radix
          maxLines: parseInt(this.clamped)
        }
      }, this.attribute.value);
    }
    return this._v(this.attribute.value);
  }
}

// //////////////////////////////////////////////

export const attributeSet = {
  mixins: [Proxyable],
  props: {
    attribute: PROPS.attribute,
    viewType: PROPS.viewType
  },
  computed: {
    attributeComponent() {
      console.warn('No attribute type/view specified!!!');
      return 'div';
    }
  },
  watch: {
    internalValue: {
      deep: true,
      handler(val) {
        this.$emit('change', val);
      }
    }
  },
  render(h) {
    return h(this.attributeComponent, {
      props: {
        value: this.internalValue,
        attribute: this.attribute,
        viewType: this.viewType
      }
    }, null);
  }
};

export const attributeSetOption = {
  mixins: [attributeSet],
  methods: {
    remove(item) {
      const idx = this.internalValue.indexOf(item);
      if (idx !== -1) {
        this.internalValue.splice(idx, 1);
        this.internalValue = [...new Set(this.internalValue)];
      }
    }
  }
};
