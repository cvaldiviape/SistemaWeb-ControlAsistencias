import Constants from '../util/constants';

const axios = require('axios');
let authorization = '';

if (localStorage.getItem(Constants.tokenName)) {
    const user = JSON.parse(localStorage.getItem(Constants.userInfo));
    if (user.data && user.data.token != null) {
        authorization = `Bearer ${user.data.token}`;
    }
}

const instanceAxios = axios.create({
    baseURL: process.env.REACT_APP_API_ENDPOINT,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json',
        Authorization: authorization
    }
});

export default instanceAxios;
