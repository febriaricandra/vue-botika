import axiosInstance from './axios';

export interface Division {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface DivisionResponse {
    data: Division[];
}

const getDivisions = async (): Promise<Division[]> => {
    const response = await axiosInstance.get('/divisions');
    console.log(response.data.data);
    return response.data.data;
};

const getDivisionById = async (id: number): Promise<Division> => {
    const response = await axiosInstance.get<Division>(`/divisions/${id}`);
    return response.data;
};

const createDivision = async (division: Omit<Division, 'id' | 'created_at' | 'updated_at'>): Promise<Division> => {
    const response = await axiosInstance.post<Division>('/divisions', division);
    return response.data;
};

const updateDivision = async (id: number, division: Omit<Division, 'id' | 'created_at' | 'updated_at'>): Promise<Division> => {
    const response = await axiosInstance.put<Division>(`/divisions/${id}`, division);
    return response.data;
};

const deleteDivision = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/divisions/${id}`);
};

export default {
    getDivisions,
    getDivisionById,
    createDivision,
    updateDivision,
    deleteDivision
};