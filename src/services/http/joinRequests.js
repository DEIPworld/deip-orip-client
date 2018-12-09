import http from './http'

const service = {
    getJoinRequestsByGroup: function(groupId) {
        return http.get(`/join-requests/group/${groupId}`, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
    getJoinRequestsByUser: function(username) {
        return http.get(`/join-requests/user/${username}`, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
    createJoinRequest: function(data) {
        return http.post(`/join-requests`, data, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
    updateJoinRequest: function(update) {
        return http.put(`/join-requests`, update, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    }
}

export default service;