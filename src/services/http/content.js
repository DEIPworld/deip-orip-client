import http from './http'
const apiUrl = process.env.DEIP_SERVER_URL;


const service = {
    getContentRef(refId) {
        return http.get(`/refs/${refId}`, { baseURL: `${apiUrl}/content/` });
    },
    getContentRefs({researchId}) {
        return http.get(`/refs/research/${researchId}`, { baseURL: `${apiUrl}/content/` });
    },
    createDarContent(researchId) {
        return http.post(`/dar/${researchId}`, {}, { baseURL: `${apiUrl}/content/` });
    },
    deleteContentDraft(refId) {
        return http.delete_(`/refs/${refId}`, { baseURL: `${apiUrl}/content/` });
    },
    unlockContentDraft(refId) {
        return http.put(`/refs/unlock/${refId}`, {}, { baseURL: `${apiUrl}/content/` });
    },
    createContentProposal(tx, type) {
        return http.post(`/propose/${type}`, tx, { baseURL: `${apiUrl}/content/` });
    }
}

export default service;