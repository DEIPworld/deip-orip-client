import http from './http'

const service = {
    getTenantProfile: function(tenant) {
        return http.get(`/profile/${tenant}`, { baseURL: `${window.env.DEIP_SERVER_URL}/tenants/` });
    },
    getTenantsProfiles: function() {
        return http.get(`/profiles`, { baseURL: `${window.env.DEIP_SERVER_URL}/tenants/` });
    }
}

export default service;