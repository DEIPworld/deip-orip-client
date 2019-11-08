import http from './http'

const service = {
    getInvestmentPortfolio: function(username) {
        return http.get(`/investment-portfolio/${username}`, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
    updateInvestmentPortfolio: function(username, updated) {
        return http.put(`/investment-portfolio/${username}`, updated, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
}

export default service;