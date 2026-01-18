import apiClient from './apiClient';

export const loginApi=(email:string,password:string)=>{
  return apiClient.post('/auth/login',{email,password});
};

export const registerApi=(name:string,email:string,password:string,role:string)=>{
  return apiClient.post('/auth/register',{name,email,password,role});
};