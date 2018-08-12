import http from './base/http'
const apiUrl = process.env.DEIP_SERVER_URL;


const service = {
    createDraft(researchId) {
        return http.post(`/create/${researchId}`, {}, { baseURL: `${apiUrl}/dar/` });
    },
    getDrafts(researchId) {
        return http.get(`/drafts/${researchId}`, { baseURL: `${apiUrl}/dar/` });
    },
    deleteDrafts(draftId) {
        return http.delete_(`/drafts/${draftId}`, { baseURL: `${apiUrl}/dar/` });
    },
    getDraftHash(draftId) {
        return http.get(`/drafts/hash/${draftId}`, { baseURL: `${apiUrl}/dar/` });
    },
    getDraftMeta(draftId) {
        return http.get(`/drafts/meta/${draftId}`, { baseURL: `${apiUrl}/dar/` });
    },
    createDarContentProposal(draftId, data) {
        return http.post(`/propose/${draftId}`, data, { baseURL: `${apiUrl}/dar/` });
    }
}

export default service;