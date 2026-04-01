import axios from 'axios';

const api = axios.create({
  baseURL: '/voteadhikar',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  changePassword: (data) => api.put('/auth/profile/password', data),
};

// Candidate APIs (Admin only)
export const candidateAPI = {
  register: (data) => api.post('/candidate/register', data),
  update: (id, data) => api.put(`/candidate/update/${id}`, data),
  delete: (id) => api.delete(`/candidate/delete/${id}`),
};

// Voting APIs
export const votingAPI = {
  getCandidates: () => api.get('/voting/showCandidates'),
  vote: (candidateId) => api.post(`/voting/${candidateId}`),
  getVoteCount: () => api.get('/voting/voteCount'),
};

export default api;
