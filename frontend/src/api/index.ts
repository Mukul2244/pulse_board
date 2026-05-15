import { apiClient } from "./client";

export const API = {
  auth: {
    login: (data: any) => apiClient.post("/auth/login", data),
    register: (data: any) => apiClient.post("/auth/register", data),
  },
  polls: {
    getAll: () => apiClient.get("/polls"),
    getById: (id: string) => apiClient.get(`/polls/${id}`),
    create: (data: any) => apiClient.post("/polls", data),
    delete: (id: string) => apiClient.delete(`/polls/${id}`),
    publish: (id: string) => apiClient.put(`/polls/${id}/publish`),
    publishResults: (id: string) => apiClient.put(`/polls/${id}/publish-results`),
    submitResponse: (id: string, data: any) => apiClient.post(`/polls/${id}/responses`, data),
  },
  questions: {
    create: (pollId: string, data: any) => apiClient.post(`/polls/${pollId}/questions`, data), // wait, the route in new.tsx was `(`/polls/${pollId}/questions`)`? Let's check.
    addOption: (qId: string, data: any) => apiClient.post(`/questions/${qId}/options`, data),
  }
};
