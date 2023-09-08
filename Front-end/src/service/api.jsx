import axios from "axios";

async function validate(body){
    return axios.post(`${import.meta.env.VITE_APP_API_URL}/validate`, body)
}

async function updateValues(body){
    return axios.post(`${import.meta.env.VITE_APP_API_URL}/product`, body)
}


const ConnectApi = {
    validate,
    updateValues
}

export default ConnectApi