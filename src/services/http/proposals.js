import http from './http'
const apiUrl = process.env.DEIP_SERVER_URL;

const service = {
    sendContentProposal(tx, type) {
        return http.post(`/propose/content/${type}`, tx, { baseURL: `${apiUrl}/api/` });
    },
    sendResearchProposal(tx) {
        return http.post(`/propose/research`, tx, { baseURL: `${apiUrl}/api/` });
    },
    sendInviteProposal(tx) {
        return http.post(`/propose/invite`, tx, { baseURL: `${apiUrl}/api/` });
    },
    sendTokenSaleProposal(tx) {
        return http.post(`/propose/token-sale`, tx, { baseURL: `${apiUrl}/api/` });
    }
}

export default service;

