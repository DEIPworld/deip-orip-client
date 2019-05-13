import http from './http'

const service = {
    getPaymentRequestRefByHash(researchId, awardId, hash) {
        return http.get(`/refs/research/${researchId}/payment-attachment/${awardId}/${hash}`, { baseURL: `${window.env.DEIP_SERVER_URL}/payment-requests/` });
    }
}

export default service;