import http from './http'

const service = {
    getUserProfile: function(username) {
        return http.get(`/user/profile/${username}`, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
    getUsersProfiles: function(usernames) {
        return http.get(`/user/profiles${http.buildQueryString(usernames, 'accounts')}`, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
    createUserProfile: function(username, data) {
        return http.post(`/user/profile/${username}`, data, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
    updateUserProfile: function(username, update) {
        return http.put(`/user/profile/${username}`, update, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
    searchUsersByName: function(name) {
        return http.get('/users/search/' + name);
    }
}

export default service;