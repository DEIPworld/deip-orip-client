import http from './http'
const apiUrl = process.env.DEIP_SERVER_URL;


const service = {
    getNotificationsByUser: (username) => {
        return http.get(`/notifications/user/${username}`, { baseURL: `${apiUrl}/api/` });
    },
    markUserNotificationAsRead: (username, notificationId) => {
        return http.put(`/notifications/${username}/mark-read/${notificationId}`, {}, { baseURL: `${apiUrl}/api/` });
    },
    markAllUserNotificationAsRead: (username) => {
        return http.put(`/notifications/${username}/mark-all-read`, {}, { baseURL: `${apiUrl}/api/` });
    }
}

export default service;