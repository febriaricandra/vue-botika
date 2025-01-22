import axiosInstance from './axios';

export interface Employee {
    id: number;
    name: string;
    status: string;
    job_id: number;
    created_at: string;
    updated_at: string;
    divisi_name?: string;
    job_name?: string;
}

export interface EmployeeResponse {
    current_page: number;
    data: Employee[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{ url: string | null; label: string; active: boolean }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

const getEmployees = async (division?: string, status?: string, search?: string, page: number = 1): Promise<EmployeeResponse> => {
    const params: Record<string, string | number | undefined> = {page };
    if (division) params.division = division;
    if (status) params.status = status;
    if (search) params.search = search;

    const response = await axiosInstance.get<EmployeeResponse>('/employees', { params });
    return response.data;
};

const createEmployee = async (employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> => {
    const response = await axiosInstance.post<Employee>('/employees', employee);
    return response.data;
};

const updateEmployee = async (id: number, employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> => {
    const response = await axiosInstance.put<Employee>(`/employees/${id}`, employee);
    return response.data;
};

const deleteEmployee = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/employees/${id}`);
};

export default {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
};