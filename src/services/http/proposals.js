import http from './http'
const apiUrl = process.env.DEIP_SERVER_URL;

const service = {
    sendVoteForProposal(tx) {
        return http.post(`proposals/vote`, tx, { baseURL: `${apiUrl}/api/` });
    },
    sendContentProposal(tx, type) {
        return http.post(`/proposals/content/${type}`, tx, { baseURL: `${apiUrl}/api/` });
    },
    sendResearchProposal(tx) {
        return http.post(`/proposals/research`, tx, { baseURL: `${apiUrl}/api/` });
    },
    sendInviteProposal(tx) {
        return http.post(`/proposals/invite`, tx, { baseURL: `${apiUrl}/api/` });
    },
    sendTokenSaleProposal(tx) {
        return http.post(`/proposals/token-sale`, tx, { baseURL: `${apiUrl}/api/` });
    }
}

export default service;

