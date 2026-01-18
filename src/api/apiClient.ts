import axios from 'axios';

const apiClient=axios.create({
  baseURL:'https://10.0.2.2:5000/api',
  headers:{
    'Content-Type':'application/json',
  },
});

export default apiClient;