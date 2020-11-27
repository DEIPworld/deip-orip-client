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
        returnObject: this.returnObject,
        hideDetails: 'auto',

        ...(this.multiple ? {
          multiple: this.multiple,
          chips: true,
          deletableChips: true
        } : {}),

        ...Object.keys(Validatable.options.props)
          .reduce((props, key) => ({
            ...props,
            ...(this[key] ? { [key]: this[key] } : {})
          }), {})
      };
    }
  }
};
