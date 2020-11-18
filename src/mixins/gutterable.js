import { convertToUnit } from 'vuetify/lib/util/helpers';

export const gutterable = {
  name: 'gutterable',
  props: {
    gutter: {
      type: [Number, String],
      default: 24
    }
  },

  computed: {
    $$gutter() {
      return convertToUnit(this.gutter);
    },

    $$gutterInfo() {
      const matches = this.$$gutter.match(/^(\d+)(\w+)/);

      return {
        string: matches[0],
        number: parseFloat(matches[1]),
        unit: matches[2]
      };
    }
  }
}
