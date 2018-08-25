import http from './http'
const apiUrl = process.env.DEIP_SERVER_URL;

const service = {
    getUserProfile: function(username) {
        return http.get(`/user/profile/${username}`, { baseURL: `${apiUrl}/api/` });
    },
    getUsersProfiles: function(usernames) {
        return http.get(`/user/profiles${http.buildQueryString(usernames, 'accounts')}`, { baseURL: `${apiUrl}/api/` });
    },
    createUserProfile: function(username, data) {
        return http.post(`/user/profile/${username}`, data, { baseURL: `${apiUrl}/api/` });
    },
    updateUserProfile: function(username, update) {
        return http.put(`/user/profile/${username}`, update, { baseURL: `${apiUrl}/api/` });
    },
    searchUsersByName: function(name) {
        return http.get('/users/search/' + name);
    }
}

export default service;