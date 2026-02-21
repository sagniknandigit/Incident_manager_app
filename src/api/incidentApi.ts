import apiClient from './apiClient';

export interface CreateIncidentPayload {
  title: string;
  description: string;
  priority: string;
}

export const getIncidentsApi = () => {
    return apiClient.get('/incidents');
};

export const createIncidentApi = (data: CreateIncidentPayload) => {
    return apiClient.post('/incidents', data);
};

export const assignEngineerApi=(incidentId:number,engineerId:number)=>{
  return apiClient.put(`/incidents/${incidentId}/assign`,{engineerId});
};

export const getAssignedIncidentsApi=()=>{
  return apiClient.get('/incidents/assigned');
};

export const updateIncidentStatusApi=(incidentId:number,status:string)=>{
  return apiClient.put(`/incidents/${incidentId}/status`,{status});
};

export const getMyIncidentsApi=()=>{
  return apiClient.get('/incidents/my');
};