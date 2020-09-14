import Proxyable from 'vuetify/lib/mixins/proxyable';
import AttributesCommonEditOpts
  from '@/components/Attributes/AttributesCommon/AttributesCommonEditOpts';
import AttributesCommonEditMeta
  from '@/components/Attributes/AttributesCommon/AttributesCommonEditMeta';
import { ATTR_TYPES, ATTR_AREAS } from '@/variables';
import { tenantAttributes } from '@/mixins/platformAttributes';

export const defaultAttributeModel = () => ({
  isVisible: true,
  title: '',
  shortTitle: '',
  description: '',
  // defaultValue: null,
  valueOptions: [],
  isFilterable: false,
  isEditable: true,
  areas: [ATTR_AREAS.MAIN],
  order: 0
});

export const PROPS = {
  small: {
    type: Boolean,
    default: false
  },

  viewType: {
    type: String,
    validator(val) {
      return Object.values(['card', 'main', 'sidebar'])
        .indexOf(val) !== -1;
    }
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
  computed: {
    internalAttribute() {
      return this.tenantAttributes.find(({ _id }) => _id === this.attributeId);
    }
  }
};

export const internalType = {
  mixins: [tenantAttributes],
  computed: {
    internalType() {
      return this.attributeId
        ? this.tenantAttributes.find(({ _id }) => _id === this.attributeId).type
        : this.type;
    }
  }
};

export const commonAttribute = {
  mixins: [Proxyable],
  props: {
    type: PROPS.type,
    small: PROPS.small,
    attributeId: PROPS.attributeId,
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

export const commonRead = {
  mixins: [Proxyable, tenantAttributes, internalAttribute],
  props: {
    attributeId: PROPS.attributeId,
    viewType: PROPS.viewType
  }
};

export const commonSet = {
  mixins: [Proxyable, tenantAttributes, internalAttribute],
  props: {
    attributeId: PROPS.attributeId,
    multiple: PROPS.multiple
  }
};
