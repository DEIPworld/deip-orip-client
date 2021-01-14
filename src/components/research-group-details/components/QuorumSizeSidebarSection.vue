<template>
  <d-block-widget
    v-if="!isResearchGroupMember || !isEditMode"
    :title="$t('researchGroupDetails.quorumThreshold')"
  >
    <div
      v-for="(proposalBlock, i) in proposalOrderMap"
      :key="`proposalBlock-${i}`"
    >
      <div v-for="proposalData in proposalBlock" :key="proposalLabels[proposalData.key]">
        <div class="d-flex justify-space-between align-center">
          <div class="font-weight-medium">
            {{ proposalLabels[proposalData.key] }}
          </div>
          <div class="width-3 text-align-right">
            {{ proposalData.value }}%
          </div>
        </div>
      </div>
    </div>
  </d-block-widget>
</template>

<script>
  import { mapGetters } from 'vuex';
  import _ from 'lodash';
  import deipRpc from '@deip/rpc-client';

  import { PROPOSAL_TYPES, proposalTypesLabels } from '@/variables';
  import DBlockWidget from '@/components/Deipify/DBlock/DBlockWidget';

  export default {
    name: 'QuorumSizeSidebarSection',
    components: { DBlockWidget },
    data() {
      return {
        isEditMode: false,
        proposalLabels: _.cloneDeep(proposalTypesLabels),

        proposalOrderMap: [
          [
            {
              key: PROPOSAL_TYPES.CREATE_RESEARCH,
              value: undefined
            },
            {
              key: PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL,
              value: undefined
            }
          ],
          [
            {
              key: PROPOSAL_TYPES.INVITE_MEMBER,
              value: undefined
            },
            {
              key: PROPOSAL_TYPES.EXCLUDE_MEMBER,
              value: undefined
            }
          ],
          [
            {
              key: PROPOSAL_TYPES.CREATE_RESEARCH_TOKEN_SALE,
              value: undefined
            },
            {
              key: PROPOSAL_TYPES.TRANSFER,
              value: undefined
            }
          ],
          [
            {
              key: PROPOSAL_TYPES.UPDATE_RESEARCH_GROUP,
              value: undefined
            },
            {
              key: PROPOSAL_TYPES.UPDATE_RESEARCH,
              value: undefined
            }
          ]
        ]
      };
    },

    computed: {
      ...mapGetters({
        group: 'researchGroup/group'
      }),

      isResearchGroupMember() {
        return this.group != null
          ? this.$store.getters['auth/userIsResearchGroupMember'](this.group.id)
          : false;
      }
    },

    created() {
      this.fillValues();
    },

    methods: {
      fillValues() {
        this.proposalOrderMap.forEach((proposalsBlock) => {
          proposalsBlock.forEach((proposalData) => {
            const intValue = this.convertToPercent(this.DEIP_100_PERCENT);
            proposalData.value = intValue.toString(); // input works with string values
          });
        });
      }
    }
  };
</script>

<style lang="less">
  .percent-input.v-text-field {
    max-width: 45px;
    padding-top: 0px;
  }

  .mode-btn-wrapper {
    margin-top: -4px;
  }
</style>
