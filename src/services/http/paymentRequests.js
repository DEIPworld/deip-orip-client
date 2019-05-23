import http from './http'

export async function getPaymentRequestRefByHash(researchId, awardId, hash) {
    return http.get(`/refs/research/${researchId}/payment-attachment/${awardId}/${hash}`, { baseURL: `${window.env.DEIP_SERVER_URL}/payment-requests/` });
}

const service = {
    getPaymentRequestRefByHash
}

export default service;