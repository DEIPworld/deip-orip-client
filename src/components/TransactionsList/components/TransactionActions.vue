<template>
  <div v-if="isActionsBlockVisible(transaction) && transaction.type" class="d-flex mt-4">
    <v-btn
      outlined
      x-small
      color="primary"
      class="mr-4"
      :disabled="disableButtons.status"
      :loading="disableButtons.status && disableButtons.btnType === actions.sign"
      @click="handleAction(actions.sign)"
    >
      <v-icon left>
        done
      </v-icon>
      {{ $t('transactionsList.confirm') }}
    </v-btn>
    <v-btn
      outlined
      x-small
      color="primary"
      :disabled="disableButtons.status"
      :loading="disableButtons.status && disableButtons.btnType === actions.reject"
      @click="handleAction(actions.reject)"
    >
      <v-icon left>
        clear
      </v-icon>
      {{ $t('transactionsList.decline') }}
    </v-btn>
  </div>
</template>

<script>
  import { transactionData } from '@/components/TransactionsList/transactionsListMixins';
  import { ProposalsService } from '@deip/proposals-service';

  const proposalsService = ProposalsService.getInstance();
  const actions = {
    sign: 'sign',
    reject: 'reject'
  };

  export default {
    name: 'TransactionActions',
    mixins: [transactionData],
    data() {
      return {
        disableButtons: {
          status: false,
          btnType: ''
        },
        actions
      };
    },
    methods: {
      isActionsBlockVisible(item) {
        const { approvals, rejectors } = item.proposal;

        const hasApprovals = approvals.some(([name]) => name == this.$currentUser.username);
        const hasRejections = rejectors.some(([name]) => name == this.$currentUser.username);

        return !hasApprovals && !hasRejections;
      },
      handleAction(action) {
        this[action]();
      },
      [actions.sign]() {
        const { proposal: { external_id, approvals }, type } = this.transaction;
        const currentTenantId = this.$tenant.id;
        this.disableButtons.status = true;
        this.disableButtons.btnType = actions.sign;

        const activeApprovalsToAdd = [this.$currentUser.username];
        if (type === this.LOC_PROPOSAL_TYPES.RESEARCH_NDA) {
          const { tenantId: researchTenantId } = this.transaction.extendedDetails.research;
          if (researchTenantId != currentTenantId) {
            if (!approvals.some((approval) => approval == researchTenantId)) {
              activeApprovalsToAdd.push(researchTenantId);
            }
          } else if (!approvals.some((approval) => approval == currentTenantId)) {
            activeApprovalsToAdd.push(currentTenantId);
          }
        }

        proposalsService.updateProposal(
          { privKey: this.$currentUser.privKey, username: this.$currentUser.username }, {
            externalId: external_id,
            activeApprovalsToAdd
          }
        )
          .then(() => {
            this.$emit('update-data');
            this.$notifier.showSuccess(this.$t('transactionsList.voteSucc'));
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError(this.$t('transactionsList.voteFail'));
          })
          .finally(() => {
            this.disableButtons.status = false;
          });
      },

      [actions.reject]() {
        const {
          proposal: { external_id, required_approvals },
          type
        } = this.transaction;
        this.disableButtons.status = true;
        this.disableButtons.btnType = actions.reject;
        proposalsService.deleteProposal(
          { privKey: this.$currentUser.privKey, username: this.$currentUser.username }, {
            externalId: external_id,
            account: type == this.LOC_PROPOSAL_TYPES.EXPRESS_LICENSE_REQUEST
              ? required_approvals.some((ra) => this.$currentUser.teams.some((rg) => rg.account.name == ra))
                ? required_approvals.find((ra) => this.$currentUser.teams.some((rg) => rg.account.name == ra))
                : this.$currentUser.username
              : type === this.LOC_PROPOSAL_TYPES.RESEARCH_NDA ? 
                // this.transaction?.extendedDetails?.research?.research_group?.external_id
                this.transaction && this.transaction.extendedDetails && this.transaction.extendedDetails.research && this.transaction.extendedDetails.research.research_group 
                  ? this.transaction.extendedDetails.research.research_group.external_id
                  : this.$currentUser.username
              : this.$currentUser.username,
            authority: 2, // active auth
            extensions: []
          }
        )
          .then(() => {
            this.$emit('update-data');
            this.$notifier.showSuccess(this.$t('transactionsList.voteSucc'));
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError(this.$t('transactionsList.voteFail'));
          })
          .finally(() => {
            this.disableButtons.status = false;
          });
      }
    }
  };
</script>
