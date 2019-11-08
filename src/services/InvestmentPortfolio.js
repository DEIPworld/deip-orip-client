import investmentPortfolioHttp from './http/investmentPortfolio';

const getInvestmentPortfolio = function (username) {
  return investmentPortfolioHttp.getInvestmentPortfolio(username)
    .then((investmentPortfolio) => {
      return investmentPortfolio;
    });
}

const updateInvestmentPortfolio = function (username, updated) {
  return investmentPortfolioHttp.updateInvestmentPortfolio(username, updated)
    .then((investmentPortfolio) => {
      return investmentPortfolio;
    });
}

export default {
  getInvestmentPortfolio,
  updateInvestmentPortfolio,
};
