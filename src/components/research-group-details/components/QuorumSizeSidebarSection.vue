<template>
  <div>
    <div class="subtitle-1 bold">
      Quorum threshold
    </div>

    <div class="pt-4">
      <div v-if="!isResearchGroupMember || !isEditMode">
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
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import _ from 'lodash';
  import deipRpc from '@deip/rpc-client';

  import { PROPOSAL_TYPES, proposalTypesLabels } from '@/variables';

  export default {
    name: 'QuorumSizeSidebarSection',

    data() {
      return {
        isEditMode: false,
        proposalLabels: _.cloneDeep(proposalTypesLabels),

        proposalOrderMap: [
          [
            { key: PROPOSAL_TYPES.START_RESEARCH, value: undefined },
            { key: PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL, value: undefined },
            { key: PROPOSAL_TYPES.CHANGE_RESEARCH_REVIEW_SHARE_PERCENT, value: undefined }
          ],
          [
            { key: PROPOSAL_TYPES.INVITE_MEMBER, value: undefined },
            { key: PROPOSAL_TYPES.EXCLUDE_MEMBER, value: undefined }
          ],
          [
            { key: PROPOSAL_TYPES.START_RESEARCH_TOKEN_SALE, value: undefined },
            { key: PROPOSAL_TYPES.OFFER_RESEARCH_TOKENS, value: undefined },
            { key: PROPOSAL_TYPES.SEND_FUNDS, value: undefined }
          ],
          [
            { key: PROPOSAL_TYPES.CHANGE_QUORUM, value: undefined },
            { key: PROPOSAL_TYPES.REBALANCE_RESEARCH_GROUP_TOKENS, value: undefined }
          ],
          [
            { key: PROPOSAL_TYPES.CHANGE_RESEARCH_GROUP_META_DATA_TYPE, value: undefined },
            { key: PROPOSAL_TYPES.CHANGE_RESEARCH_META_DATA_TYPE, value: undefined }
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
            const intValue = this.convertToPercent(
              this.group.proposal_quorums[proposalData.key - 1][1]
            );
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
