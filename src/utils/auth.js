import decode from 'jwt-decode';

const ACCESS_TOKEN_KEY = 'deip_jwt';
const OWNER_PRIVATE_KEY = 'deip_owner_wif';

export function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getOwnerWif() {
    return localStorage.getItem(OWNER_PRIVATE_KEY);
}

export function clearAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(OWNER_PRIVATE_KEY);
}

export function setAccessToken(jwt, wif) {
    localStorage.setItem(ACCESS_TOKEN_KEY, jwt);
    localStorage.setItem(OWNER_PRIVATE_KEY, wif);
}

export function isLoggedIn() {
    const jwt = getAccessToken();
    return !!jwt && !isTokenExpired(jwt);
}

export function getDecodedToken() {
    const jwt = getAccessToken();
    if (!jwt) return null;
    return decode(jwt)
}

export function decodedToken(jwt) {
    return decode(jwt)
}

function isTokenExpired(jwt) {
    const expirationDate = getTokenExpirationDate(jwt);
    return expirationDate < new Date();
}

function getTokenExpirationDate(jwt) {
    const token = decode(jwt);
    if (!token.exp) { return null; }

    const date = new Date(0);
    date.setUTCSeconds(token.exp);

    return date;
}