import axios from 'axios'

const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = 'http://localhost:3000/';

const setupAxiosInterceptors = () => {}

export default setupAxiosInterceptors
