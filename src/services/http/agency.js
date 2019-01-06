import http from './http'

const service = {
    getAgencyProfile: function(agency) {
        return http.get(`/agencies/profile/${agency}`, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
    getAgenciesProfiles: function() {
        return http.get(`/agencies/profiles`, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    }
}

export default service;