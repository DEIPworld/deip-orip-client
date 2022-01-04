<template>
  <div
    v-if="isActionsBlockVisible(transaction) && transaction.type"
    class="d-flex mt-4"
  >
    <v-btn
      outlined
      x-small
      color="primary"
      class="mr-4"
      :disabled="disableButtons.status"
      :loading="
        disableButtons.status && disableButtons.btnType === actions.sign
      "
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
      :loading="
        disableButtons.status && disableButtons.btnType === actions.reject
      "
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
  import { ProposalsService } from '@deip/proposals-service';
  import { transactionData } from '@/components/TransactionsList/transactionsListMixins';

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
        const {
          proposal: { _id, approvals },
          type
        } = this.transaction;
        const currentPortalId = this.$portal.id;
        this.disableButtons.status = true;
        this.disableButtons.btnType = actions.sign;

        const activeApprovalsToAdd = [this.$currentUser.username];
        if (type === this.LOC_PROPOSAL_TYPES.PROJECT_NDA) {
          const {
            portalId: projectPortalId,
            teamId
          } = this.transaction.extendedDetails.project;
          activeApprovalsToAdd.push(teamId);
          if (projectPortalId != currentPortalId) {
            if (!approvals.some((approval) => approval == projectPortalId)) {
              activeApprovalsToAdd.push(projectPortalId);
            }
          } else if (!approvals.some((approval) => approval == currentPortalId)) {
            activeApprovalsToAdd.push(currentPortalId);
          }
        }

        const promises = [];
        for (let i = 0; i < activeApprovalsToAdd.length; i++) {
          const approver = activeApprovalsToAdd[i];
          promises.push(proposalsService.acceptProposal(this.$currentUser, {
            proposalId: _id,
            account: approver
          }));
        }

        Promise.all(promises)
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
          proposal: { _id, required_approvals },
          type
        } = this.transaction;
        this.disableButtons.status = true;
        this.disableButtons.btnType = actions.reject;

        const account = type == this.LOC_PROPOSAL_TYPES.CONTRACT_AGREEMENT_PROPOSAL
          ? required_approvals.some((ra) => this.$currentUser.teams.some((rg) => rg.account.name == ra))
            ? required_approvals.find((ra) => this.$currentUser.teams.some((rg) => rg.account.name == ra))
            : this.$currentUser.username
          : type === this.LOC_PROPOSAL_TYPES.PROJECT_NDA
            ? // this.transaction?.extendedDetails?.project?.teamId
              this.transaction
              && this.transaction.extendedDetails
              && this.transaction.extendedDetails.project
              && (this.transaction.extendedDetails.project.teamId || this.$currentUser.username)
            : this.$currentUser.username;

        const promise = proposalsService.declineProposal(this.$currentUser, {
          proposalId: _id,
          account
        });

        promise
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
