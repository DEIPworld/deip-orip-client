import http from './http'

const service = {
    sendCreateGroup(tx) {
        return http.post(`/groups`, tx, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    }
}

export default service;

