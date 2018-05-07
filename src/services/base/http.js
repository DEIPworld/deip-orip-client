import axios from 'axios'
import router from './../../router'
import { clearAccessToken, getAccessToken } from './../../utils/auth'


const instance = axios.create({
    baseURL: '/api/',
    headers: { 'Content-Type': 'application/json' }
});


function handleErrors(data, status) {
    switch (status) {
        case 401:
            // sign out unauthorized user
            clearAccessToken();
            router.go('/sign-in');
            break;
        case 403:
            // redirect to "access denied" page
            clearAccessToken();
            router.go('/sign-in');
            break;
        case 404:
            // redirect to "not-found" page
            // router.go("/not-found");
            break;
        case 503:
            // maintenance mode
            // router.go("/maintenance");
            break;
        default:
            // don't do anything, just pass errors to the controllers
            console.error(data);
            break;
    }
}

function verb(method, url, model, options) {

    if (!options) options = {};
    var config = Object.assign({}, options);

    instance.defaults.headers.common['Authorization'] = 'Bearer ' + getAccessToken();

    var responsePromise = new Promise((resolve, reject) => {
        var httpPromise;

        switch (method) {

            case 'get':
                httpPromise = instance[method](url, config);
                break;
            case 'post':
                httpPromise = instance[method](url, model, config);
                break;
            case 'put':
                httpPromise = instance[method](url, model, config);
                break;
            case 'delete':
                httpPromise = instance[method](url, config);
                break;
            default:
                resolve();
                break;
        }

        httpPromise.then(
                (response) => {
                    console.log(response);
                    resolve(response.data);
                })
            .catch(
                (error) => {
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        var isProcessed = false;
                        if (options && typeof(options.handleErrors) === 'function' &&
                            status != 503 /* maintenance */ ) {
                            isProcessed = options.handleErrors(data, status);
                        }
                        if (!isProcessed) {
                            handleErrors(error.response, error.response.status);
                        }
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                    } else {
                        // Something happened in setting up the request that triggered an Error
                    }
                    console.error(error);
                    reject(error);
                });
    });

    return responsePromise;
}

var http = { // todo: add file upload

    get: function(url, options) {
        return verb('get', url, null, options);
    },

    post: function(url, model, options) {
        return verb('post', url, model, options);
    },

    put: function(url, model, options) {
        return verb('put', url, model, options);
    },

    delete_: function(url, options) {
        return verb('delete', url, null, options);
    },

    buildQueryString: function(obj, prefix) {
        var str = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                var k = prefix ? prefix + "[" + p + "]" : p,
                    v = obj[p];

                if (angular.isObject(v)) {
                    str.push(http.buildQueryString(v, k).substr(1));
                } else {
                    str.push(v || v === 0 || v === false ? (k) + "=" + encodeURIComponent(v) : (k) + "=");
                }
            }
        }
        return "?" + str.join("&");
    }
};


export default http;