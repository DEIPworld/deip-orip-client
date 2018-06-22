import http from './base/http'
import config from './../../src/config'
const apiUrl = config['deip-server-url'];


const service = {
    getJoinRequestsByGroup: function(groupId) {
        return http.get(`/join-requests/group/${groupId}`, { baseURL: `${apiUrl}/api/` });
    },
    getJoinRequestsByUser: function(username) {
        return http.get(`/join-requests/user/${username}`, { baseURL: `${apiUrl}/api/` });
    },
    createJoinRequest: function(data) {
        return http.post(`/join-requests`, data, { baseURL: `${apiUrl}/api/` });
    },
    updateJoinRequest: function(update) {
        return http.put(`/join-requests`, update, { baseURL: `${apiUrl}/api/` });
    }
}

export default service;