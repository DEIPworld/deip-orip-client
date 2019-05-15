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

export {
  withdrawalStatus,
  fundingContractStatus
}