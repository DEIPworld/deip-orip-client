import http from './http'
const apiUrl = process.env.DEIP_SERVER_URL;

const service = {
    sendApproveInvite(tx) {
        return http.post(`/invites/approve`, tx, { baseURL: `${apiUrl}/api/` });
    },
    sendRejectInvite(tx) {
        return http.post(`/invites/reject`, tx, { baseURL: `${apiUrl}/api/` });
    }
}

export default service;

