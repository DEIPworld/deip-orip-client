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
    createExpertiseClaim: (username, disciplineId, coverLetter, publications) => {
        return http.post(`/expertise-claims`, { username, disciplineId, coverLetter, publications }, { baseURL: `${apiUrl}/api/` });
    }
}

export default service;