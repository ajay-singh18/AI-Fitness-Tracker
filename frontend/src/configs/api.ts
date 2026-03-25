import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://fittrack-backend-alpha.vercel.app"
})

export default api;