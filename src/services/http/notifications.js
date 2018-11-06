import http from './http'
const apiUrl = process.env.DEIP_SERVER_URL;


const service = {
    createResearchGroupNotification: (groupId, body) => {
        return http.post(`/notifications/group/${groupId}`, body, { baseURL: `${apiUrl}/api/` });
    },
    getNotificationsByUser: (username) => {
        return http.get(`/notifications/user/${username}`, { baseURL: `${apiUrl}/api/` });
    },
    markUserNotificationAsRead: (notificationId) => {
        return http.put(`/notifications/mark-read/${notificationId}`, {}, { baseURL: `${apiUrl}/api/` });
    }
}

export default service;