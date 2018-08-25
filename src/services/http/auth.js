import http from './http'
const registrationCommitteeUrl = process.env.DEIP_FOUNDATION_URL;
const authorizationUrl = process.env.DEIP_SERVER_URL;

const service = {

    signIn: function(model) {
        return http.post('/sign-in/', model, { baseURL: `${authorizationUrl}/auth/` });
    },
    signUp: function(model) {
        console.log(process.env.NODE_ENV);
        return http.post('/preliminary-registration', model, { baseURL: `${registrationCommitteeUrl}/api` });
    }
}

export default service;