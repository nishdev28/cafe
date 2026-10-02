import axiosInstance from "@/lib/axiosInstance";

const API_URL = import.meta.env.VITE_API_URL + "/crew";

export const createCrew = async (data: any, token: string) => {
  const response = await axiosInstance.post(
    `${API_URL}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const getAllCrew = async (filters?: { status?: string, search?: string }) => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.search) params.append('search', filters.search);
  
  const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
  const response = await axiosInstance.get(url);
  return response.data;
};

export const getCrewById = async (id: string) => {
  const response = await axiosInstance.get(`${API_URL}/${id}`);
  return response.data;
};


export const updateCrew = async (id: string, data: any, token: string) => {
  const response = await axiosInstance.put(
    `${API_URL}/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const deleteCrew = async (id: string) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found, please login");

  const response = await axiosInstance.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export const updateCrewStatusBulk = async (ids: string[], status: string, token: string) => {
  const response = await axiosInstance.put(
    `${API_URL}/status/bulk`,
    { ids, status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

