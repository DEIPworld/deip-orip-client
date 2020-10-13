<template>
  <research-details-renderer
    :schema="layoutSchema"
    :research="research$"
  />
</template>

<script>
  import { mapGetters } from 'vuex';
  import ResearchDetailsRenderer from '@/components/Research/ResearchDetails/ResearchDetailsRenderer';
  import { extendAttrModules, researchAttributesToObject } from '@/utils/helpers';

  export default {
    name: 'ResearchDetails',
    components: { ResearchDetailsRenderer },
    computed: {
      ...mapGetters({
        research: 'Research/data'
      }),

      layoutSchema() {
        const schema = this.$tenantSettings.researchLayouts.projectDetails.layout;
        return extendAttrModules(
          schema,
          {
            props: {
              projectId: this.research$.externalId,
              project: _.cloneDeep(this.research$), // global
            }
          }
        );
      },

      research$() {
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
