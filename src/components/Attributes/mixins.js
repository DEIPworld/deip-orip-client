import Proxyable from 'vuetify/lib/mixins/proxyable';
import AttributesCommonEditOpts
  from '@/components/Attributes/_partials/Edit/AttributesCommonEditOpts';
import AttributesCommonEditMeta
  from '@/components/Attributes/_partials/Edit/AttributesCommonEditMeta';
import { ATTR_TYPES, ATTR_AREAS } from '@/variables';
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
  isRequired: false
});

export const PROPS = {
  viewType: {
    type: String,
    default: null
  },

  type: {
    type: String,
    default: ATTR_TYPES.TEXT,
    validator(val) {
      return Object.values(ATTR_TYPES)
        .indexOf(val) !== -1;
    }
  },

  clamped: {
    type: [Number, String],
    default: null
  },


  attributeId: {
    type: String,
    default: undefined
  },
  attribute: {
    type: Object,
    default: () => ({})
  },
  multiple: {
    type: Boolean,
    default: false
  }
};

export const resetModelOnCreate = {
  created() {
    if (!this.internalValue._id) {
      this.internalValue = {
        ...this.internalValue,
        ...defaultAttributeModel()
      };
    }
  }
};

export const internalAttribute = {
  mixins: [tenantAttributes],
  computed: {
    internalAttribute() {
      return this.tenantAttributes.find(({ _id }) => _id === this.attributeId);
    }
  }
};

export const attributeTypeComponent = {
  mixins: [tenantAttributes],
  computed: {
    attributeTypeComponent() {
      const a = this.$options.name.split(/(?=[A-Z])/);
      let t;
      console.log(this.attribute)
      if (this.attribute.type) {
        t = this.attribute.type;
      } else if (this.attribute.researchAttributeId) {
        t = this.tenantAttributes.find(({ _id }) => _id === this.attribute.researchAttributeId).type
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
      allowedViewTypes$: ['main', 'card', 'sidebar'],
      defaultViewType$: 'main'
    };
  },
  computed: {
    attributeViewTypeComponent() {
      const viewType = this.viewType && this.allowedViewTypes$.includes(this.viewType)
        ? this.viewType
        : this.defaultViewType$;
      return `${this.$options.name}${pascalCase(viewType)}`;
    }
  }
};

export const commonAttribute = {
  mixins: [Proxyable],
  props: {
    type: PROPS.type,

    attributeId: PROPS.attributeId,

    attribute: PROPS.attribute,
    multiple: PROPS.multiple,
    viewType: PROPS.viewType
  }
};

export const commonEdit = {
  components: {
    AttributesCommonEditOpts,
    AttributesCommonEditMeta
  },
  mixins: [Proxyable, resetModelOnCreate]
};

////////////////////////////////////////////////

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
  render(h) {
    if (this.clamped) {
      return h('v-clamp', {
        props: {
          autoresize: true,
          maxLines: parseInt(this.clamped)
        }
      }, this.attribute.value);
    }
    return this._v(this.attribute.value);
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
      );
    }
  }
};

export const attributeSet = {
  mixins: [Proxyable],
  props: {
    attribute: PROPS.attribute,
    viewType: PROPS.viewType
  },
  watch: {
    internalValue: {
      deep: true,
      handler(val) {
        this.$emit('change', val);
      }
    }
  }
};
