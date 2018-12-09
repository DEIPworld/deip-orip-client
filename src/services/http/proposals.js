import http from './http'

const service = {
    sendVoteForProposal(tx) {
        return http.post(`/proposals/vote`, tx, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
    sendContentProposal(tx, type) {
        return http.post(`/proposals/content/${type}`, tx, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
    sendResearchProposal(tx) {
        return http.post(`/proposals/research`, tx, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
    sendInviteProposal(tx) {
        return http.post(`/proposals/invite`, tx, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
    sendTokenSaleProposal(tx) {
        return http.post(`/proposals/token-sale`, tx, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    }
}

export default service;

