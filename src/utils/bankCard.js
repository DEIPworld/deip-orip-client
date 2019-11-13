

const getInvestorBankCardKey = (username) => {
  return `deip_${username}_investor_bank_card`;
}

export function getInvestorBankCard(username) {
  let strCard = localStorage.getItem(getInvestorBankCardKey(username));
  if (!strCard) return null;
  return JSON.parse(strCard);
}

export function setInvestorBankCard(username, card) {
  let strCard = JSON.stringify(card);
  localStorage.setItem(getInvestorBankCardKey(username), strCard);
}

export function removeInvestorBankCard(username) {
  localStorage.removeItem(getInvestorBankCardKey(username));
}

export function saveInvestorBankCard(card, username) {
  if (hasInvestorBankCard(username)) {
    removeInvestorBankCard(username);
  }
  setInvestorBankCard(username, card)
}

export function hasInvestorBankCard(username) {
  const card = getInvestorBankCard(username);
  return card != null;
}