import apiClient from "./apiClient";
export const getEngineersApi=()=>{
    return apiClient.get('/users?role=ENGINEER');
};

