<template>
  <!-- TODO: switch research -> project  -->
  <div>
    <project-details-renderer
      :schema="layoutSchema"

      :research="researchExtended"
      :project="researchExtended"
    />
  </div>

</template>

<script>
  import { mapGetters } from 'vuex';
  import ProjectDetailsRenderer from '@/features/Projects/components/Details/renderer';
  import { extendAttrModules, researchAttributesToObject } from '@/utils/helpers';
  import { collectionMerge } from '@deip/toolbox';

  export default {
    name: 'ProjectDetails',
    components: { ProjectDetailsRenderer },
    computed: {
      ...mapGetters({
        research: 'Project/projectDetails'
      }),

      layoutSchema() {
        const schema = this.$tenantSettings.researchLayouts.projectDetails.layout;
        return extendAttrModules(
          schema,
          {
            attrs: {
              projectId: this.researchExtended.externalId,
              project: _.cloneDeep(this.researchExtended) // global
            }
          }
        );
      },

      researchExtended() {
        const allAttrs = this.$tenantSettings.researchAttributes
          .map((attr) => ({
            researchAttributeId: attr._id,
            value: attr.defaultValue
          }));

        const constructedAttrs = collectionMerge(
          allAttrs,
          this.research.researchRef.attributes,
          { key: 'researchAttributeId' }
        );
        return {
          ...this.research,
          ...{

            researchRef: {
              ...this.research.researchRef,
              attributes: researchAttributesToObject(constructedAttrs),
              created_at: this.$options.filters.dateFormat(this.research.researchRef.created_at, 'D MMM YYYY', true)
            }
          }
        };
      }
    }
  };
</script>
