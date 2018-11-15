import http from './http'
const apiUrl = process.env.DEIP_SERVER_URL;

const service = {
    sendCreateGroup(tx) {
        return http.post(`/groups`, tx, { baseURL: `${apiUrl}/api/` });
    }
}

export default service;

