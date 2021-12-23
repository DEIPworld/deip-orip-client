<template>
  <!-- TODO: switch project -> project  -->
  <div>
    <project-details-renderer
      :schema="layoutSchema"

      :project="projectExtended"
    />
  </div>

</template>

<script>
  import { mapGetters } from 'vuex';
  import ProjectDetailsRenderer from '@/features/Projects/components/Details/renderer';
  import { extendAttrModules, portalAttributesToObject } from '@/utils/helpers';
  import { collectionMerge } from '@deip/toolbox';
  import { attributesChore } from '@/mixins/chores/attributesChore';

  export default {
    name: 'ProjectDetails',
    components: { ProjectDetailsRenderer },
    mixins: [attributesChore],
    computed: {
      ...mapGetters({
        project: 'Project/projectDetails'
      }),

      layoutSchema() {
        const schema = this.$portalSettings.layouts.projectDetails.layout;
        return extendAttrModules(
          schema,
          {
            attrs: {
              projectId: this.projectExtended._id,
              project: _.cloneDeep(this.projectExtended) // global
            }
          }
        );
      },

      projectExtended() {
        const allAttrs = this.$$projectAttributes
          .map((attr) => ({
            attributeId: attr._id,
            value: attr.defaultValue
          }));

        const constructedAttrs = collectionMerge(
          allAttrs,
          this.project.attributes,
          { key: 'attributeId' }
        );
        return {
          ...this.project,
          attributes: portalAttributesToObject(constructedAttrs),
          created_at: this.$options.filters.dateFormat(this.project.createdAt, 'D MMM YYYY', true)
        };
      }
    }
  };
</script>
