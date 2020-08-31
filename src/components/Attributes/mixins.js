import Proxyable from 'vuetify/lib/mixins/proxyable';
import AttributesCommonEditOpts
  from '@/components/Attributes/AttributesCommon/AttributesCommonEditOpts';
import AttributesCommonEditNode
  from '@/components/Attributes/AttributesCommon/AttributesCommonEditNode';
import { ATTR_TYPES } from '@/variables';

export const defaultAttributeModel = () => ({
  isVisible: true,
  title: '',
  shortTitle: '',
  description: '',
  // defaultValue: null,
  valueOptions: []
});

const PROPS = {
  small: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: ATTR_TYPES.TEXT,
    validator(val) {
      return Object.values(ATTR_TYPES)
        .indexOf(val) !== -1;
    }
  },
  attribute: {
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

export const internalAttributes = {
  computed: {
    internalAttributes() {
      return this.$store.getters['auth/tenant'].profile.settings.researchAttributes;
    }
  }
};

export const internalAttribute = {
  computed: {
    internalAttribute() {
      return this.internalAttributes.find(({ _id }) => _id === this.attribute);
    }
  }
};

export const internalType = {
  mixins: [internalAttributes],
  computed: {
    internalType() {
      return this.attribute
        ? this.internalAttributes.find(({ _id }) => _id === this.attribute).type
        : this.type;
    }
  }
};

export const commonAttribute = {
  mixins: [Proxyable],
  props: {
    type: PROPS.type,
    small: PROPS.small,
    attribute: PROPS.attribute,
    multiple: PROPS.multiple
  }
};

export const commonEdit = {
  components: {
    AttributesCommonEditOpts,
    AttributesCommonEditNode
  },
  mixins: [Proxyable, resetModelOnCreate]
};

export const commonRead = {
  mixins: [Proxyable, internalAttributes, internalAttribute],
  props: {
    attribute: PROPS.attribute,
    small: PROPS.small
  }
};

export const commonSet = {
  mixins: [Proxyable, internalAttributes, internalAttribute],
  props: {
    attribute: PROPS.attribute,
    multiple: PROPS.multiple
  },
  created() {
    // console.log(this.internalValue[this.internalAttribute._id])
    // // if(!this.internalValue[this.internalAttribute._id]) {
    // //   this.$set(this.internalValue, this.internalAttribute._id, null)
    // // }
  }
};
