<template>
  <div>
    <div class="subheading bold">Quorum size</div>

    <div class="pt-3">
      <div v-if="!isResearchGroupMember || !isEditMode">
        <div
          v-for="(proposalBlock, i) in proposalOrderMap"
          :key="`proposalBlock-${i}`"
        >
          <div v-for="proposalData in proposalBlock" :key="proposalLabels[proposalData.key]">
            <div class="d-flex justify-space-between align-center">
              <div class="font-weight-medium">{{ proposalLabels[proposalData.key] }}</div>
              <div class="width-3 text-align-right">{{ proposalData.value }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import _ from "lodash";
import deipRpc from "@deip/deip-oa-rpc-client";
import * as proposalService from "./../../../services/ProposalService";

export default {
  name: "QuorumSizeSidebarSection",

  data() {
    return {
      isEditMode: false,
      proposalLabels: _.cloneDeep(proposalService.labels),

     proposalOrderMap: [
        [
          { key: proposalService.types.START_RESEARCH, value: undefined },
          {
            key: proposalService.types.CREATE_RESEARCH_MATERIAL,
            value: undefined
          },
          {
            key: proposalService.types.CHANGE_RESEARCH_REVIEW_SHARE_PERCENT,
            value: undefined
          }
        ],
        [
          { key: proposalService.types.INVITE_MEMBER, value: undefined },
          { key: proposalService.types.DROPOUT_MEMBER, value: undefined }
        ],
        [
          {
            key: proposalService.types.START_RESEARCH_TOKEN_SALE,
            value: undefined
          },
          {
            key: proposalService.types.OFFER_RESEARCH_TOKENS,
            value: undefined
          },
          { key: proposalService.types.SEND_FUNDS, value: undefined }
        ],
        [
          { key: proposalService.types.CHANGE_QUORUM, value: undefined },
          {
            key: proposalService.types.REBALANCE_RESEARCH_GROUP_TOKENS,
            value: undefined
          }
        ],
        [
          {
            key: proposalService.types.CHANGE_RESEARCH_GROUP_META_DATA_TYPE,
            value: undefined
          },
          {
            key: proposalService.types.CHANGE_RESEARCH_META_DATA_TYPE,
            value: undefined
          }
        ]
      ],
    };
  },

  computed: {
    ...mapGetters({
      group: "researchGroup/group"
    }),

    isResearchGroupMember() {
      return this.group != null
        ? this.$store.getters["auth/userIsResearchGroupMember"](this.group.id)
        : false;
    }
  },

  methods: {
    fillValues() {
      this.proposalOrderMap.forEach(proposalsBlock => {
        proposalsBlock.forEach(proposalData => {
          const intValue = this.convertToPercent(
            this.group.proposal_quorums[proposalData.key - 1][1]
          );
          proposalData.value = intValue.toString(); // input works with string values
        });
      });
    }
  },

  created() {
    this.fillValues();
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
