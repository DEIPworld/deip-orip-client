import Validatable from 'vuetify/lib/mixins/validatable';
import Proxyable from 'vuetify/lib/mixins/proxyable';

export const fieldWrapper = {
  name: 'dataSelectable',

  mixins: [
    Proxyable
  ],

  props: {
    label: {
      type: String,
      default: 'Select members'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    returnObject: {
      type: Boolean,
      default: false
    },

    ...Validatable.options.props
  },

  computed: {
    $$fieldProps() {
      return {
        label: this.label,
        multiple: this.multiple,
        returnObject: this.returnObject,
        hideDetails: 'auto',

        ...Object.keys(Validatable.options.props)
          .reduce((props, key) => ({
            ...props,
            ...(this[key] ? { [key]: this[key] } : {})
          }), {})
      };
    }
  }
};
