import axios from 'axios';

const API_BASE = '/api';

// Tank API
export const tankAPI = {
  addTank: (data) => axios.post(`${API_BASE}/tanks`, data),
  getTanks: () => axios.get(`${API_BASE}/tanks`),
  getTank: (id) => axios.get(`${API_BASE}/tanks/${id}`),
  updateTank: (id, data) => axios.put(`${API_BASE}/tanks/${id}`, data),
  deleteTank: (id) => axios.delete(`${API_BASE}/tanks/${id}`),
  calibrateTank: (id, data) => axios.post(`${API_BASE}/tanks/${id}/calibrate`, data),
  pairSensor: (id, data) => axios.post(`${API_BASE}/tanks/${id}/pair-sensor`, data),
  getDashboardSummary: () => axios.get(`${API_BASE}/tanks/dashboard-summary`)
};

// Order API
export const orderAPI = {
  createOrder: (data) => axios.post(`${API_BASE}/orders`, data),
  getOrders: () => axios.get(`${API_BASE}/orders`),
  getOrder: (id) => axios.get(`${API_BASE}/orders/${id}`),
  acceptOrder: (id) => axios.post(`${API_BASE}/orders/${id}/accept`),
  updateOrderStatus: (id, data) => axios.put(`${API_BASE}/orders/${id}/status`, data),
  completeOrder: (id, data) => axios.post(`${API_BASE}/orders/${id}/complete`, data),
  rateOrder: (id, data) => axios.post(`${API_BASE}/orders/${id}/rate`, data),
  cancelOrder: (id) => axios.post(`${API_BASE}/orders/${id}/cancel`),
  getAvailableDrivers: () => axios.get(`${API_BASE}/orders/drivers/available`)
};

// Maintenance API
export const maintenanceAPI = {
  createRequest: (data) => axios.post(`${API_BASE}/maintenance`, data),
  getRequests: () => axios.get(`${API_BASE}/maintenance`),
  getRequest: (id) => axios.get(`${API_BASE}/maintenance/${id}`),
  acceptJob: (id) => axios.post(`${API_BASE}/maintenance/${id}/accept`),
  completeJob: (id, data) => axios.post(`${API_BASE}/maintenance/${id}/complete`, data),
  rateService: (id, data) => axios.post(`${API_BASE}/maintenance/${id}/rate`, data),
  getTechnicianJobs: () => axios.get(`${API_BASE}/maintenance/technician/jobs`),
  getAvailableTechnicians: (serviceType) =>
    axios.get(`${API_BASE}/maintenance/technicians/available`, { params: { serviceType } }),
  assignTechnician: (id, data) => axios.post(`${API_BASE}/maintenance/${id}/assign`, data),
  getTankMaintenanceHistory: (tankId) => axios.get(`${API_BASE}/maintenance/tank/${tankId}/history`)
};

// Setup interceptors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;
