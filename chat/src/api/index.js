import axios from "axios";

const http = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    withCredentials: true
})

http.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    config.headers.authorization = `Bearer ${token}`
    return config
}, error => {
    console.log(error)
});

http.interceptors.response.use((response) => {
    const { authorization } = response.headers;
    authorization && localStorage.setItem("token", authorization);
    return response;
}, (error) => {
    if (error.response.status === 401) {
        localStorage.removeItem("token");
        location.href = '/'
        return Promise.reject(error);
    }
});

export default http;