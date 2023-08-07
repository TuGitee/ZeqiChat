import axios from "axios";

axios.interceptors.request.use((config) => {
    return config;
});
axios.interceptors.response.use((response) => {
    const { authorization } = response.headers;
    authorization && localStorage.setItem("token", authorization);
    return response;
}, (error) => {
    return Promise.reject(error);
});

export default axios.create({
    baseURL: "http://47.120.2.219:3000/",
    withCredentials: true
})