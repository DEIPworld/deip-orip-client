import http from './http'

const service = {
    getApplicationPackageRef(agency, foaId, hash) {
        return http.get(`/refs/${agency}/${foaId}/${hash}`, { baseURL: `${window.env.DEIP_SERVER_URL}/applications/` });
    },
    getApplicationsRefsByResearch(researchId) {
        return http.get(`/refs/research/${researchId}`, { baseURL: `${window.env.DEIP_SERVER_URL}/applications/` });
    },
    getApplicationsRefsByFoa(foaId) {
        return http.get(`/refs/foa/${foaId}`, { baseURL: `${window.env.DEIP_SERVER_URL}/applications/` });
    }
}

export default service;