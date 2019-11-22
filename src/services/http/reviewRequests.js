import http from './http'

const service = {
    getReviewRequestsByExpert: function(username, status = 'pending') {
       return http.get(`/review-requests/expert/${username}?status=${status}`, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
    createReviewRequest: function(data) {
        return http.post(`/review-requests`, data, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
    denyReviewRequest: function(id) {
        return http.post(`/review-requests/${id}/deny`, null, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
}

export default service;