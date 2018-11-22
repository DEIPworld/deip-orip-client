import http from './http'
const apiUrl = process.env.DEIP_SERVER_URL;


const service = {
    getExpertiseClaims: (status = 'pending') => {
        return http.get(`/expertise-claims?status=${status}`, { baseURL: `${apiUrl}/api/` });
    },
    getExpertiseClaimsByUser: (username) => {
        return http.get(`/expertise-claims/user/${username}`, { baseURL: `${apiUrl}/api/` });
    },
    getExpertiseClaimsByDiscipline: (disciplineId) => {
        return http.get(`/expertise-claims/discipline/${disciplineId}`, { baseURL: `${apiUrl}/api/` });
    },
    getExpertiseClaimsByUserAndDiscipline: (username, disciplineId) => {
        return http.get(`/expertise-claims/user/${username}/discipline/${disciplineId}`, { baseURL: `${apiUrl}/api/` });
    },
    createExpertiseClaim: (tx, publications) => {
        return http.post(`/expertise-claims`, { tx, publications }, { baseURL: `${apiUrl}/api/` });
    },
    voteForExpertiseClaim: (tx) => {
        return http.post(`/expertise-claims/vote`, tx, { baseURL: `${apiUrl}/api/` });
    }
}

export default service;