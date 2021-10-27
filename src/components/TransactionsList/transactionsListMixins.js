import { PROPOSAL_STATUS, LOC_PROPOSAL_TYPES } from '@/variables';
import { assetsChore } from '@/mixins/chores';

export const transactionData = {
  props: {
    transaction: {
      type: Object,
      required: true,
      default: null
    }
  },
  data() {
    return {
      PROPOSAL_STATUS,
      LOC_PROPOSAL_TYPES
    };
  }
};

export const transactionTitle = {
  mixins: [transactionData, assetsChore],
  computed: {
    transactionTitle() {
      if (this.transaction.type === LOC_PROPOSAL_TYPES.TRANSFER_ASSET) {
        return this.$t('transactionsList.transfer',
          {
            asset: this.$$toAssetUnits(this.transaction.details.asset),
            account: this.transaction.extendedDetails.party2.name
          || this.$options.filters.fullname(this.transaction.extendedDetails.party2)
          });
      }
      if (this.transaction.type === LOC_PROPOSAL_TYPES.CREATE_RESEARCH) {
        return this.transaction.details.researchTitle;
      }
      if (this.transaction.type === LOC_PROPOSAL_TYPES.UPDATE_RESEARCH) {
        return this.transaction.extendedDetails.research.title;
      }
      if (this.transaction.type === LOC_PROPOSAL_TYPES.CONTRACT_AGREEMENT_PROPOSAL) {
        return this.$t('transactionsList.licenseRequest',
          {
            fee: this.$$toAssetUnits(this.transaction.details.terms.fee),
            project: this.transaction.extendedDetails.research.title
          });
      }
      if (this.transaction.type === LOC_PROPOSAL_TYPES.ASSET_EXCHANGE_REQUEST) {
        return this.$t('transactionsList.exchangeRequest',
          {
            asset1: this.$$toAssetUnits(this.transaction.details.asset1),
            asset2: this.$$toAssetUnits(this.transaction.details.asset2)
          });
      }
      if (this.transaction.type === LOC_PROPOSAL_TYPES.INVITE_MEMBER) {
        return this.$t('transactionsList.inviteMember', {
          invitee: this.$options.filters.accountFullname(this.transaction.extendedDetails.invitee),
          researchGroup: this.$options.filters.accountFullname(
            this.transaction.extendedDetails.researchGroup
          )
        });
      }
      if (this.transaction.type === LOC_PROPOSAL_TYPES.EXCLUDE_MEMBER) {
        return this.$t('transactionsList.excludeMember', {
          member: this.$options.filters.accountFullname(this.transaction.extendedDetails.member),
          researchGroup: this.$options.filters.accountFullname(
            this.transaction.extendedDetails.researchGroup
          )
        });
      }
      if (this.transaction.type === LOC_PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL) {
        return this.$t('transactionsList.createResearchMaterial', {
          material: this.transaction.details.source.offchain.title,
          project: this.transaction.extendedDetails.research.title
        });
      }
      if (this.transaction.type === LOC_PROPOSAL_TYPES.CREATE_RESEARCH_TOKEN_SALE) {
        return this.$t('transactionsList.createTokenSale', {
          min: this.$$toAssetUnits(this.transaction.extendedDetails.researchTokenSale.soft_cap),
          max: this.$$toAssetUnits(this.transaction.extendedDetails.researchTokenSale.hard_cap),
          project: this.transaction.extendedDetails.research.title
        });
      }
      if (this.transaction.type === LOC_PROPOSAL_TYPES.RESEARCH_NDA) {
        return this.$t('transactionsList.projectNda', { project: this.transaction.extendedDetails.research.title });
      }
      return this.$t('transactionsList.transaction');
    }
  }
};

export const transactionChips = {
  mixins: [transactionData],
  data() {
    return {
      statusChipData: {
        color: {
          [PROPOSAL_STATUS.APPROVED]: 'success',
          [PROPOSAL_STATUS.PENDING]: 'warning',
          [PROPOSAL_STATUS.REJECTED]: 'error',
          [PROPOSAL_STATUS.FAILED]: 'error',
          [PROPOSAL_STATUS.EXPIRED]: 'error'
        },
        text: {
          [PROPOSAL_STATUS.APPROVED]: this.$t('transactionsList.status.signed'),
          [PROPOSAL_STATUS.PENDING]: this.$t('transactionsList.status.pending'),
          [PROPOSAL_STATUS.REJECTED]: this.$t('transactionsList.status.declined'),
          [PROPOSAL_STATUS.FAILED]: this.$t('transactionsList.status.failed'),
          [PROPOSAL_STATUS.EXPIRED]: this.$t('transactionsList.status.expired')
        },
        icon: {
          [PROPOSAL_STATUS.APPROVED]: 'check_circle',
          [PROPOSAL_STATUS.PENDING]: 'mdi-clock-time-three',
          [PROPOSAL_STATUS.REJECTED]: 'mdi-minus-circle',
          [PROPOSAL_STATUS.FAILED]: 'cancel',
          [PROPOSAL_STATUS.EXPIRED]: 'mdi-minus-circle'
        }
      }
    };
  }
};
