import http from './http'
const apiUrl = process.env.DEIP_SERVER_URL;

const service = {
    getAllResearchContents: () => {
        return http.get(`/search/contents/all`, { baseURL: `${apiUrl}/api/` });
    }
}

export default service;