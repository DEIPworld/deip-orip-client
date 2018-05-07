import http from './base/http'
import config from './../../src/config'

const registrationCommitteeUrl = config['deip-foundation-url'];
const authorizationUrl = config['deip-server-url'];


const service = {

    signIn: function(model) {
        return http.post('/sign-in/', model, { baseURL: `${authorizationUrl}/auth/` });
    },
    signUp: function(model) {
        return http.post('/preliminary-registration', model, { baseURL: `${registrationCommitteeUrl}/api` });
    }
}

export default service;