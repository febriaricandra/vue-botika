<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import EmployeeService from '@/services/EmployeeService';
import DivisionService from '@/services/DivisionService';
import type { Division } from '@/services/DivisionService';
import type { Employee } from '@/services/EmployeeService';
import type { Job } from '@/services/JobService';
import Modal from '@/components/shared/Modal.vue';
import JobService from '@/services/JobService';
import Swal from 'sweetalert2';

const employees = ref<Employee[]>([]);
const divisions = ref<Division[]>([]);
const jobs = ref<Job[]>([]);
const division = ref<string | undefined>(undefined);
const status = ref<string | undefined>(undefined);
const search = ref<string | undefined>(undefined);
const errorMessage = ref<string | undefined>(undefined);

const currentPage = ref<number>(1);
const totalPages = ref<number>(1);

const selectedEmployee = ref<Employee | null>(null);
const dialog = ref<boolean>(false);
const addDialog = ref<boolean>(false);
const editDialog = ref<boolean>(false);
const newEmployee = ref({
    id: 0,
    name: '',
    status: '',
    job_id: 0,
    created_at: '',
    updated_at: ''
});

const tableActionData = ref([
    { listtitle: 'Edit', icon: 'mdi-pencil' },
    { listtitle: 'Delete', icon: 'mdi-delete' },
]);

const fetchEmployees = async (page: number = 1) => {
    try {
        const response = await EmployeeService.getEmployees(division.value, status.value, search.value, page);
        employees.value = response.data;
        currentPage.value = response.current_page;
        totalPages.value = response.last_page;
    } catch (error) {
        console.error('Error fetching employees:', error);
        errorMessage.value = 'Failed to fetch employees. Please try again later.';
    }
};

const fetchJobs = async () => {
    try {
        const response = await JobService.getJobs();
        jobs.value = response;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        errorMessage.value = 'Failed to fetch jobs. Please try again later.';
    }
};

const fetchDivisions = async () => {
    try {
        const response = await DivisionService.getDivisions();
        divisions.value = response;
    } catch (error) {
        console.error('Error fetching divisions:', error);
        errorMessage.value = 'Failed to fetch divisions. Please try again later.';
    }
};

const changePage = (page: number) => {
    currentPage.value = page;
    fetchEmployees(page);
};

const openDialog = (employee: Employee) => {
    selectedEmployee.value = employee;
    dialog.value = true;
};

const closeDialog = () => {
    dialog.value = false;
    selectedEmployee.value = null;
};

const openAddDialog = () => {
    addDialog.value = true;
};

const openEditDialog = (employee: Employee) => {
    editDialog.value = true;
    selectedEmployee.value = employee;
}

const closeEditDialog = () => {
    editDialog.value = false;
    newEmployee.value = {
        id: 0,
        name: '',
        status: '',
        job_id: 0,
        created_at: '',
        updated_at: ''
    };
}
const closeAddDialog = () => {
    addDialog.value = false;
    newEmployee.value = {
        id: 0,
        name: '',
        status: '',
        job_id: 0,
        created_at: '',
        updated_at: ''
    };
};

const addEmployee = async () => {
    try {
        await EmployeeService.createEmployee(newEmployee.value);
        fetchEmployees();
        closeAddDialog();
        Swal.fire({
            title: "Good job!",
            text: "Added Employee!",
            icon: "success"
        });
        addDialog.value = false;
    } catch (error) {
        console.error('Error adding employee:', error);
        errorMessage.value = 'Failed to add employee. Please try again later.';
        Swal.fire({
            title: "Bad!",
            text: "Couldn't add employee!",
            icon: "error"
        });
        addDialog.value = false;
    }
};

const updateEmployee = async () => {
    if (!newEmployee.value.name || !newEmployee.value.job_id || !newEmployee.value.status) {
        errorMessage.value = 'All fields are required.';
        return;
    }

    try {
        await EmployeeService.updateEmployee(newEmployee.value.id, newEmployee.value);
        await fetchEmployees();
        closeEditDialog();
        Swal.fire({
            title: "Good job!",
            text: "Updated Employee!",
            icon: "success"
        });
        addDialog.value = false;
    } catch (error) {
        console.error('Error update employee:', error);
        errorMessage.value = 'Failed to update employee. Please try again later.';
        Swal.fire({
            title: "Bad!",
            text: "Couldn't update employee!",
            icon: "error"
        });
        addDialog.value = false;
    }
}

const confirmDelete = (employee: Employee) => {
    console.log(employee);
    Swal.fire({
        title: 'Are you sure?',
        text: `Do you really want to delete "${employee.name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
    }).then((result) => {
        if (result.isConfirmed) {
            // deleteJob(job.id);
            Swal.fire(
                'Deleted!',
                'The Job has been deleted.',
                'success'
            );
        }
    });
};

onMounted(() => {
    fetchEmployees();
    fetchJobs();
    fetchDivisions();
});


// memantau perubahan pada currentPage, untuk di assign ke fungsi
watch(currentPage, (newPage) => {
    fetchEmployees(newPage);
});

/** memantau perubahan pada division, status, search
 * dan mengubah currentPage menjadi 1 saat terjadi perubahan
 * */
watch([division, status, search], () => {
    currentPage.value = 1;
    fetchEmployees(currentPage.value)
});
</script>

<template>
    <v-card elevation="10">
        <v-card-item class="px-0">
            <div class="px-6">
                <v-card-title class="text-h5 mb-1">List Employees</v-card-title>
                <v-card-subtitle class="text-body-1">Total {{ employees.length }} Employees</v-card-subtitle>
                <div class="filters">
                    <v-text-field v-model="search" label="Search by name" @input="fetchEmployees" />
                    <v-select v-model="division" :items="divisions.map(division => division.name)"
                        label="Filter by division" @update:modelValue="() => fetchEmployees()" />
                    <v-select v-model="status" :items="['active', 'inactive']" label="Filter by status"
                        @update:modelValue="() => fetchEmployees()" />
                </div>
                <v-btn color="primary" @click="openAddDialog">Add Employee</v-btn>
            </div>
            <perfect-scrollbar style="height: 450px">
                <v-table class="revenue-table border-table">
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-h6 font-weight-semibold text-no-wrap">Name</th>
                                <th class="text-h6 font-weight-semibold text-no-wrap">Division</th>
                                <th class="text-h6 font-weight-semibold text-no-wrap">Job</th>
                                <th class="text-h6 font-weight-semibold text-no-wrap">Status</th>
                                <th class="text-h6 font-weight-semibold text-no-wrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="employee in employees" :key="employee.id" class="month-item">
                                <td>
                                    <div class="d-flex align-center overflow-hidden">
                                        <div class="mx-4" style="min-width: 250px">
                                            <h6 class="text-body-1 font-weight-semibold truncate-2">
                                                {{ employee.name }}
                                            </h6>
                                        </div>
                                    </div>
                                </td>
                                <td>{{ employee.divisi_name }}</td>
                                <td>{{ employee.job_name }}</td>
                                <td>{{ employee.status }}</td>
                                <td>
                                    <v-btn size="30" icon variant="flat" class="grey100">
                                        <v-avatar size="22">
                                            <DotsVerticalIcon size="20" color="grey100" />
                                        </v-avatar>
                                        <v-menu activator="parent">
                                            <v-list elevation="10">
                                                <v-list-item value="action" v-for="list in tableActionData"
                                                    :key="list.listtitle" hide-details min-height="38"
                                                    @click="list.listtitle === 'Delete' ? confirmDelete(employee) : openEditDialog(employee)">
                                                    <v-list-item-title>
                                                        {{ list.listtitle }}
                                                    </v-list-item-title>
                                                </v-list-item>
                                            </v-list>
                                        </v-menu>
                                    </v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-table>
            </perfect-scrollbar>
            <v-pagination v-model="currentPage" :length="totalPages" @input="changePage"></v-pagination>
        </v-card-item>
    </v-card>

    <Modal :modelValue="dialog" @update:modelValue="closeDialog">
        <template #title>
            Employee Actions
        </template>
        <template #content>
            <div v-if="selectedEmployee">
                <p><strong>Name:</strong> {{ selectedEmployee.name }}</p>
                <p><strong>Division:</strong> {{ selectedEmployee.divisi_name }}</p>
                <p><strong>Job:</strong> {{ selectedEmployee.job_name }}</p>
                <p><strong>Status:</strong> {{ selectedEmployee.status }}</p>
            </div>
        </template>
        <template #actions>
            <v-btn color="primary" @click="closeDialog">Close</v-btn>
        </template>
    </Modal>

    <Modal :modelValue="addDialog" @update:modelValue="closeAddDialog">
        <template #title>
            Add Employee
        </template>
        <template #content>
            <v-form>
                <v-text-field v-model="newEmployee.name" label="Name" required />
                <v-select v-model="newEmployee.job_id" :items="jobs" item-value="id" item-text="title" label="Job"
                    required />
                <v-select v-model="newEmployee.status" :items="['active', 'inactive']" label="Status" required />
            </v-form>
        </template>
        <template #actions>
            <v-btn color="primary" @click="addEmployee">Add</v-btn>
            <v-btn color="secondary" @click="closeAddDialog">Cancel</v-btn>
        </template>
    </Modal>
    <Modal :modelValue="editDialog" @update:modelValue="closeEditDialog">
        <template #title>
            Update Employee
        </template>
        <template #content>
            <v-form>
                <v-text-field v-model="newEmployee.name" label="Name" required />
                <v-select v-model="newEmployee.job_id" :items="jobs" item-value="id" item-text="title" label="Job"
                    required />
                <v-select v-model="newEmployee.status" :items="['active', 'inactive']" label="Status" required />
            </v-form>
        </template>
        <template #actions>
            <v-btn color="primary" @click="updateEmployee">Add</v-btn>
            <v-btn color="secondary" @click="closeEditDialog">Cancel</v-btn>
        </template>
    </Modal>
</template>

<style scoped>
.filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}
</style>