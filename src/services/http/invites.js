import http from './http'

const service = {
    sendApproveInvite(tx) {
        return http.post(`/invites/approve`, tx, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    },
    sendRejectInvite(tx) {
        return http.post(`/invites/reject`, tx, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    }
}

export default service;

