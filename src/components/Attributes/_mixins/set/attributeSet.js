import { ValidationProvider } from 'vee-validate';
import { VeeFieldValidatable } from '@/mixins/veeFieldValidatable';

import Proxyable from 'vuetify/lib/mixins/proxyable';
import { wrapInArray } from 'vuetify/lib/util/helpers';
import { commonProps } from '@/variables/props';

export const attributeSet = {
  components: { ValidationProvider },

  mixins: [Proxyable, VeeFieldValidatable],

  props: {
    ...commonProps.attribute,
    viewType: {
      type: String,
      default: undefined
    }
  },

  computed: {
    $$isRequired() {
      return this.attribute.isRequired;
    }
  },

  render(h) {
    const self = this;
    return h('div', {
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
};

export const attributeSetForceArray = {
  mixins: [attributeSet],

  computed: {
    internalValue: {
      get() {
        const v = wrapInArray(this.internalLazyValue);
        return this.attribute.isMultiple ? v : v[0];
      },

      set(val) {
        const v = wrapInArray(val);
        if (v === this.internalLazyValue) return;
        this.internalLazyValue = v;
        this.$emit('change', v);
      }

    }
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
