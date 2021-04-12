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
  import { extendAttrModules, tenantAttributesToObject } from '@/utils/helpers';
  import { collectionMerge } from '@deip/toolbox';
  import { attributesChore } from '@/mixins/chores/attributesChore';

  export default {
    name: 'ProjectDetails',
    components: { ProjectDetailsRenderer },
    mixins: [attributesChore],
    computed: {
      ...mapGetters({
        research: 'Project/projectDetails'
      }),

      layoutSchema() {
        const schema = this.$tenantSettings.layouts.projectDetails.layout;
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
        const allAttrs = this.$$projectAttributes
          .map((attr) => ({
            attributeId: attr._id,
            value: attr.defaultValue
          }));

        const constructedAttrs = collectionMerge(
          allAttrs,
          this.research.researchRef.attributes,
          { key: 'attributeId' }
        );
        return {
          ...this.research,
          ...{

            researchRef: {
              ...this.research.researchRef,
              attributes: tenantAttributesToObject(constructedAttrs),
              created_at: this.$options.filters.dateFormat(this.research.researchRef.created_at, 'D MMM YYYY', true)
            }
          }
        };
      }
    }
  };
</script>
