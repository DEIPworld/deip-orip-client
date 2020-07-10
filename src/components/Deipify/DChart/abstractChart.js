import deepmerge from 'deepmerge';

export const AbstractChart = {
  props: {
    data: {
      type: Array,
      default: () => ([])
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      commonChartOptions: {
        fontSize: 12,
        fontName: 'Roboto',
        tooltip: { isHtml: true },
      }
    };
  },

  computed: {
    defaultOptions() {
      return {};
    },

    _options() {
      return deepmerge.all([
        this.commonChartOptions,
        this.defaultOptions,
        this.options
      ]);
    }
  },

  methods: { }
}
