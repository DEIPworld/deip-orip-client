
const INVESTOR_BANK_CARD_KEY = 'investor_bank_card';

export function getInvestorBankCard() {
  return localStorage.getItem(INVESTOR_BANK_CARD_KEY);
}

export function getInvestorBankCardJson() {
  const strCard = getInvestorBankCard();
  if (!strCard) return null;
  return JSON.parse(strCard);
}

export function clearInvestorBankCard() {
  localStorage.removeItem(INVESTOR_BANK_CARD_KEY);
}

export function saveInvestorBankCard(card) {
  if (hasInvestorBankCard()) clearInvestorBankCard();
  let strCard = JSON.stringify(card);
  localStorage.setItem(INVESTOR_BANK_CARD_KEY, strCard);
}

export function hasInvestorBankCard() {
  const card = getInvestorBankCardJson();
  return card != null;
}