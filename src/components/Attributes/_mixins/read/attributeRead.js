import { attributesChore } from '@/mixins/chores/attributesChore';
import { hasValue } from '@/utils/helpers';

export const attributeRead = {
  mixins: [attributesChore],
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
    attributeInfo() {
      const id = this.attribute._id || this.attribute.researchAttributeId;
      return this.$$tenantAttributes.find(({ _id }) => _id === id);
    },
    attrHasData() {
      return this.attribute && hasValue(this.attribute.value);
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
          },
          class: {
            'visually-hidden': this.attribute.isHidden
          }
        }, this.attribute.value);
      }
      return this._v(this.attribute.value);
    }
  },
  render(h) {
    return this.attrHasData ? this.genContent(h) : false;
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
