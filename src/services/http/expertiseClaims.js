import http from './http'

const service = {
    getExpertiseClaims: (status = 'pending') => {
        return http.get(`/expertise-claims?status=${status}`, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
    getExpertiseClaimsByUser: (username) => {
        return http.get(`/expertise-claims/user/${username}`, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
    getExpertiseClaimsByDiscipline: (disciplineId) => {
        return http.get(`/expertise-claims/discipline/${disciplineId}`, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
    getExpertiseClaimsByUserAndDiscipline: (username, disciplineId) => {
        return http.get(`/expertise-claims/user/${username}/discipline/${disciplineId}`, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
    createExpertiseClaim: (tx, publications) => {
        return http.post(`/expertise-claims`, { tx, publications }, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
    voteForExpertiseClaim: (tx) => {
        return http.post(`/expertise-claims/vote`, tx, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    }
}

export default service;