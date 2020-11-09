export const projectsView = {
  props: {
    projects: {
      type: Array,
      default: () => ([])
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    iteratorProps() {
      return {
        itemsPerPage: 12,
        hideDefaultFooter: this.projects.length < 12,
        footerProps: {
          'items-per-page-options': [12, 24, 48, -1]
        },
        noDataText: this.$t('defaultNaming.noProjects')
      };
    }
  },
  methods: {
    onUpdatePage() {
      this.$emit('update:page');
    }
  }
};
