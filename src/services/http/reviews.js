import http from './http'
const apiUrl = process.env.DEIP_SERVER_URL;

const service = {
    sendMakeReviewOp(tx) {
        return http.post(`/reviews`, tx, { baseURL: `${apiUrl}/api/` });
    }
}

export default service;

