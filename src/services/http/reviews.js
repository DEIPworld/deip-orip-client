import http from './http'

const service = {
    sendMakeReviewOp(tx) {
        return http.post(`/reviews`, tx, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    }
}

export default service;

