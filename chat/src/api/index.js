import axios from "axios";

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.authorization = token
        return config
    }
    return config
});
axios.interceptors.response.use((response) => {
    const { authorization } = response.headers;
    authorization && localStorage.setItem("token", authorization);
    return response;
}, (error) => {
    return Promise.reject(error);
});

export default axios.create({
    baseURL: "https://zeqichat.xyz/",
    withCredentials: true
})