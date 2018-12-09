import http from './http'

const service = {
    getNotificationsByUser: (username) => {
        return http.get(`/notifications/user/${username}`, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
    markUserNotificationAsRead: (username, notificationId) => {
        return http.put(`/notifications/${username}/mark-read/${notificationId}`, {}, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
    markAllUserNotificationAsRead: (username) => {
        return http.put(`/notifications/${username}/mark-all-read`, {}, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    }
}

export default service;