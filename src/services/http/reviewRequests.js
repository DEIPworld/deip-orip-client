import http from './http'

const service = {
    getReviewRequestsByExpert: function(username, status) {
        let query = status ? `?status=${status}` : "";
        return http.get(`/review-requests/expert/${username}${query}`, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
    getReviewRequestsByRequestor: function (username, status) {
        let query = status ? `?status=${status}` : "";
        return http.get(`/review-requests/requestor/${username}${query}`, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
    createReviewRequest: function(data) {
        return http.post(`/review-requests`, data, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
    denyReviewRequest: function(id) {
        return http.post(`/review-requests/${id}/deny`, null, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
}

export default service;