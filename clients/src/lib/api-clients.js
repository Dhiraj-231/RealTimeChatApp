import { HOST } from "@/utils/Constants.js"
import axios from "axios"

export const apiClient = axios.create({
    baseURL: HOST
})