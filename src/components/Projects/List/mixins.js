import { extendAttrModules, researchAttributesToObject } from '@/utils/helpers';

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

export const projectItem = {
  props: {
    project: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    layoutSchema() {
      const { layout } = this.$tenantSettings.researchLayouts[this.layoutKey];

      return extendAttrModules(
        layout,
        { attrs: { project: this.project } }
      );
    },

    project$() {
      return {
        ...this.project,
        ...{
          created_at: this.$options.filters.dateFormat(this.project.created_at, 'D MMM YYYY', true),
          researchRef: {
            attributes: researchAttributesToObject(this.project.researchRef.attributes)
          },
          cover: this.$options.filters.researchBackgroundSrc(this.project.external_id)
        }
      };
    }
  }
};
