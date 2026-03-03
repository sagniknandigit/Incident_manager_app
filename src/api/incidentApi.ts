import apiClient from './apiClient';

export interface CreateIncidentPayload {
  title: string;
  description: string;
  priority: string;
  imageUrl?: string;
}

export interface GetIncidentsParams {
  status?: string;
  priority?: string;
  engineerId?: number;
  page?: number;
  limit?: number;
}

export const getIncidentsApi = (params?: GetIncidentsParams) => {
  return apiClient.get('/incidents', { params });
};

export const createIncidentApi = (data: CreateIncidentPayload) => {
  return apiClient.post('/incidents', data);
};

export const assignEngineerApi = (incidentId: number, engineerId: number) => {
  return apiClient.put(`/incidents/${incidentId}/assign`, { engineerId });
};

export const getAssignedIncidentsApi = () => {
  return apiClient.get('/incidents/assigned');
};

export const updateIncidentStatusApi = (incidentId: number, status: string) => {
  return apiClient.put(`/incidents/${incidentId}/status`, { status });
};

export const getMyIncidentsApi = () => {
  return apiClient.get('/incidents/my');
};

export const getIncidentStatsApi = () => {
  return apiClient.get('/incidents/stats');
};