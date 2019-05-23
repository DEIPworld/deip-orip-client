import deipRpc from '@deip/deip-rpc-client';
import { getEnrichedProfiles } from './../utils/user';
import { getPaymentRequestRefByHash } from './http/paymentRequests';

export const WITHDRAWAL_PENDING= 1;
export const WITHDRAWAL_CERTIFIED = 2;
export const WITHDRAWAL_APPROVED= 3;
export const WITHDRAWAL_REJECTED = 4;
const withdrawalStatus = {
  WITHDRAWAL_PENDING,
  WITHDRAWAL_CERTIFIED,
  WITHDRAWAL_APPROVED,
  WITHDRAWAL_REJECTED
};

export const FUNDING_CONTRACT_PENDING = 1;
export const FUNDING_CONTRACT_APPROVED = 2;
export const FUNDING_CONTRACT_REJECTED = 3;
const fundingContractStatus = {
  FUNDING_CONTRACT_PENDING,
  FUNDING_CONTRACT_APPROVED,
  FUNDING_CONTRACT_REJECTED
};

export const FUNDING_TRANSACTION_TRANSFER = 1;
export const FUNDING_TRANSACTION_WITHDRAW = 2;
export const FUNDING_TRANSACTION_FEE = 3;
const fundingTransactionStatus = {
  FUNDING_TRANSACTION_TRANSFER,
  FUNDING_TRANSACTION_WITHDRAW,
  FUNDING_TRANSACTION_FEE
};

export {
  withdrawalStatus,
  fundingContractStatus,
  fundingTransactionStatus
}

export async function loadFundingContracts() {
  const contracts = [];
  return deipRpc.api.getFundingsAsync()
    .then((items) => {
      contracts.push(...items);
      return Promise.all(items.map(c => loadFundingContractDetails(c)));
    })
    .then(() => {
      return Promise.all(contracts.map(c => deipRpc.api.getFundingOpportunityAsync(c.funding_opportunity_id)))
    })
    .then((fundingOpportunities) => {
      for (let i = 0; i < fundingOpportunities.length; i++) {
        let foa = fundingOpportunities[i];
        let contract = contracts[i];
        contract.foa = foa;
      }
      let names = contracts.map(r => r.granter);
      return getEnrichedProfiles(names);
    })
    .then((creators) => {
      for (let i = 0; i < creators.length; i++) {
        let creator = creators[i];
        let contract = contracts[i];
        contract.creatorUser = creator;
      }
      return contracts;
    });
}

export async function loadFundingContractDetails(contract) {
  const flattenWithdrawals = []
  return deipRpc.api.getFundingResearchRelationsByFundingAsync(contract.id)
    .then((relations) => {
      contract.relations = relations;
      return Promise.all(contract.relations.map(r => deipRpc.api.getFundingMilestonesByResearchAsync(r.id)));
    })
    .then((milestones) => {
      for (let i = 0; i < milestones.length; i++) {
        contract.relations[i].milestones = milestones[i];
      }
      let names = contract.relations.map(r => r.researcher);
      return getEnrichedProfiles(names);
    })
    .then((researchers) => {
      for (let i = 0; i < researchers.length; i++) {
        contract.relations[i].researcherUser = researchers[i];
      }
      for (let i = 0; i < contract.relations.length; i++) {
        contract.relations[i].researchExpenses = contract.relations[i]
          .research_expenses.map((exp) => {
            let title = exp[0] == 1 ? 'Salary' : exp[0] == 2 ? 'Equipment' : 'Business Travel';
            let amount = exp[1];
            let type = exp[0];

            return { title, amount, type };
          })
      }
      return Promise.all(contract.relations.map(r => deipRpc.api.getFundingWithdrawalRequestsByResearchAsync(r.research_id)));
    })
    .then((withdrawals) => {
      for (let i = 0; i < contract.relations.length; i++) {
        contract.relations[i].withdrawals = withdrawals[i].filter(w => w.funding_research_relation_id == contract.relations[i].id);
      }
      flattenWithdrawals.push(...[].concat.apply([], withdrawals));
      return Promise.all(flattenWithdrawals
        .map(payment => payment.attachment
          ? getPaymentRequestRefByHash(payment.research_id, payment.funding_research_relation_id, payment.attachment)
          : Promise.resolve(null))
        );
    })
    .then((attachments) => {
      for (let i = 0; i < flattenWithdrawals.length; i++) {
        flattenWithdrawals[i].attachment = attachments[i] || null;
      }
    });
}
