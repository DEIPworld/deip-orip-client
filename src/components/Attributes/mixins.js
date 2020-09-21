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

  isVisible: true,
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
      const t = this.attributeId
        ? this.tenantAttributes.find(({ _id }) => _id === this.attributeId).type
        : this.type;

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
    viewType: PROPS.viewType,
    attributeId: PROPS.attributeId,
    attribute: PROPS.attribute,
    multiple: PROPS.multiple
  }
};

export const commonEdit = {
  components: {
    AttributesCommonEditOpts,
    AttributesCommonEditMeta
  },
  mixins: [Proxyable, resetModelOnCreate]
};



export const commonSet = {
  mixins: [Proxyable, tenantAttributes, internalAttribute],
  props: {
    attributeId: PROPS.attributeId,
    multiple: PROPS.multiple
  }
};


export const commonRead = {
  mixins: [Proxyable, tenantAttributes, internalAttribute],
  props: {
    attribute: PROPS.attribute,
    attributeId: PROPS.attributeId,
    viewType: PROPS.viewType
  }
};

export const optionsRead = {
  computed: {
    valueOption() {
      return this.internalAttribute.valueOptions.find(({ value }) => value === this.internalValue);
    }
  }
};

////////////////////////////////////////////////

// export const attributeInfo = {
//   mixins: [tenantAttributes],
//   computed: {
//     attributeInfo() {
//       const id = this.attribute._id || this.attribute.researchAttributeId;
//       return this.tenantAttributes.find(({ _id }) => _id === id);
//     }
//   }
// };

export const attributeRead = {
  mixins: [tenantAttributes],
  props: {
    attribute: PROPS.attribute,
    viewType: PROPS.viewType
  },
  computed: {
    attributeInfo() {
      const id = this.attribute._id || this.attribute.researchAttributeId;
      return this.tenantAttributes.find(({ _id }) => _id === id);
    }
  },
  render(h) {
    return this._v(this.attribute.value);
  }
};

export const attributeReadOption = {
  mixins: [attributeRead],
  computed: {
    valueOption() {
      return this.attributeInfo.valueOptions.find(({ value }) => value === this.attribute.value);
    }
  }
};

export const attributeSet = {
  mixins: [Proxyable],
  props: {
    attribute: PROPS.attribute,
    viewType: PROPS.viewType
  }
};
