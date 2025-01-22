import axiosInstance from './axios';

export interface Job {
    id: number;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface JobResponse {
    data: Job[];
}

const getJobs = async (): Promise<Job[]> => {
    const response = await axiosInstance.get<JobResponse>('/jobs');
    return response.data.data;
};

const getJobById = async (id: number): Promise<Job> => {
    const response = await axiosInstance.get<Job>(`/jobs/${id}`);
    return response.data;
};

const createJob = async (job: Omit<Job, 'id' | 'created_at' | 'updated_at'>): Promise<Job> => {
    const response = await axiosInstance.post<Job>('/jobs', job);
    return response.data;
};

const updateJob = async (id: number, job: Omit<Job, 'id' | 'created_at' | 'updated_at'>): Promise<Job> => {
    const response = await axiosInstance.put<Job>(`/jobs/${id}`, job);
    return response.data;
};

const deleteJob = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/jobs/${id}`);
};

export default {
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob
};