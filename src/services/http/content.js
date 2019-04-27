import http from './http'

const service = {
    getContentRef(researchId, hash) {
        return http.get(`/refs/research/${researchId}/${hash}`, { baseURL: `${window.env.DEIP_SERVER_URL}/content/` });
    },
    getContentRefs({researchId}) {
        return http.get(`/refs/research/${researchId}`, { baseURL: `${window.env.DEIP_SERVER_URL}/content/` });
    },
    createDarContent(researchId) {
        return http.post(`/dar/${researchId}`, {}, { baseURL: `${window.env.DEIP_SERVER_URL}/content/` });
    },
    deleteContentDraft(refId) {
        return http.delete_(`/refs/${refId}`, { baseURL: `${window.env.DEIP_SERVER_URL}/content/` });
    },
    unlockContentDraft(refId) {
        return http.put(`/refs/unlock/${refId}`, {}, { baseURL: `${window.env.DEIP_SERVER_URL}/content/` });
    }
}

export default service;