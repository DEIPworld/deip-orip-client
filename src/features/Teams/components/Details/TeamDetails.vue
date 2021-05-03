<template>
  <div>
    <team-details-renderer :schema="layoutSchema" :team="teamExtended" />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import TeamDetailsRenderer from '@/features/Teams/components/Details/renderer';
  import { extendAttrModules, tenantAttributesToObject } from '@/utils/helpers';
  import { collectionMerge } from '@deip/toolbox';
  import { attributesChore } from '@/mixins/chores/attributesChore';

  export default {
    name: 'TeamDetails',
    components: { TeamDetailsRenderer },
    mixins: [attributesChore],
    computed: {
      ...mapGetters({
        team: 'Team/teamDetails'
      }),

      layoutSchema() {
        return extendAttrModules(
          this.$tenantSettings.layouts.teamDetails.layout
        );
      },

      teamExtended() {
        const allAttrs = this.$$teamAttributes
          .map((attr) => ({
            attributeId: attr._id,
            value: attr.defaultValue
          }));

        const constructedAttrs = collectionMerge(
          allAttrs,
          this.team.researchGroupRef.attributes,
          { key: 'attributeId' }
        );
        return {
          ...this.team,
          ...{
            researchGroupRef: {
              ...this.team.researchGroupRef,
              attributes: tenantAttributesToObject(constructedAttrs)
            }
          }
        };
      }
    }
  };
</script>
