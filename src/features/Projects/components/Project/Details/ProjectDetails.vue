<template>
  <project-details-renderer
    :schema="layoutSchema"
    :research="researchExtended"
  />
</template>

<script>
  import { mapGetters } from 'vuex';
  import ProjectDetailsRenderer from '@/features/Projects/components/Project/Details/renderer';
  import { extendAttrModules, researchAttributesToObject } from '@/utils/helpers';

  export default {
    name: 'ProjectDetails',
    components: { ProjectDetailsRenderer },
    computed: {
      ...mapGetters({
        research: 'Project/data'
      }),

      layoutSchema() {
        const schema = this.$tenantSettings.researchLayouts.projectDetails.layout;
        return extendAttrModules(
          schema,
          {
            attrs: {
              projectId: this.researchExtended.externalId,
              project: _.cloneDeep(this.researchExtended), // global
            }
          }
        );
      },

      researchExtended() {
        return {
          ...this.research,
          ...{
            createdAt: this.$options.filters.dateFormat(this.research.createdAt, 'D MMM YYYY', true),
            researchRef: {
              ...this.research.researchRef,
              attributes: researchAttributesToObject(this.research.researchRef.attributes)
            }
            // cover: this.$options.filters.researchBackgroundSrc(this.research.externalId)
          }
        };
      }
    }
  };
</script>
