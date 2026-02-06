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
