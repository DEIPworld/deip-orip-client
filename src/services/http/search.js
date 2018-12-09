import http from './http'

const service = {
    getAllResearchContents: () => {
        return http.get(`/search/contents/all`, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
    }
}

export default service;