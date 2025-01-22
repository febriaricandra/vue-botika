<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Modal from '@/components/shared/Modal.vue';
import type { Job } from '@/services/JobService';
import type { Division } from '@/services/DivisionService';
import DivisionService from '@/services/DivisionService';
import JobService from '@/services/JobService';
import Swal from 'sweetalert2';

const divisions = ref<Division[]>([]);
const jobs = ref<Job[]>([]);
const selectedJob = ref<Job | null>(null);
const errorMessage = ref<string | null>(null);
const dialog = ref<boolean>(false);
const addDialog = ref<boolean>(false);
const editDialog = ref<boolean>(false);

const newJob = ref({
    title: '',
    description: '',
    division_id: null,
});

const editJob = ref({
    id: 0,
    title: '',
    description: '',
    division_id: null,
});

const tableActionData = ref([
    { listtitle: 'Edit', icon: 'mdi-pencil' },
    { listtitle: 'Delete', icon: 'mdi-delete' },
]);

const fetchJobs = async () => {
    try {
        const response = await JobService.getJobs();
        jobs.value = response || [];
    } catch (error) {
        console.error('Error fetching jobs:', error);
        errorMessage.value = 'Failed to fetch jobs. Please try again later.';
    }
};

const fetchDivisions = async () => {
    try {
        const response = await DivisionService.getDivisions();
        divisions.value = response || [];
    } catch (error) {
        console.error('Error fetching divisions:', error);
        errorMessage.value = 'Failed to fetch divisions. Please try again later.';
    }
};

const openDialog = (job: Job) => {
    selectedJob.value = job;
    dialog.value = true;
};

const closeDialog = () => {
    dialog.value = false;
    selectedJob.value = null;
};

const openAddDialog = () => {
    addDialog.value = true;
};

const closeAddDialog = () => {
    addDialog.value = false;
    newJob.value = {
        title: '',
        description: '',
        division_id: null,
    };
};

const openEditDialog = (job: Job) => {
    console.log(job);
    editJob.value = { ...job, division_id: divisions.value.id }
    editDialog.value = true;
};

const closeEditDialog = () => {
    editDialog.value = false;
    editJob.value = {
        id: 0,
        title: '',
        description: '',
        division_id: null,
    };
};

const addJob = async () => {
    if (!newJob.value.title || !newJob.value.description || !newJob.value.division_id) {
        errorMessage.value = 'All fields are required.';
        return;
    }

    try {
        await JobService.createJob(newJob.value);
        await fetchJobs();
        closeAddDialog();
    } catch (error) {
        console.error('Error adding job:', error);
        errorMessage.value = 'Failed to add job. Please try again later.';
    }
};

const updateJob = async () => {
    if (!editJob.value.title || !editJob.value.description || !editJob.value.division_id) {
        errorMessage.value = 'All fields are required.';
        return;
    }

    try {
        await JobService.updateJob(editJob.value.id, editJob.value);
        await fetchJobs();
        closeEditDialog();
    } catch (error) {
        console.error('Error updating job:', error);
        errorMessage.value = 'Failed to update job. Please try again later.';
    }
};

const confirmDelete = (job: Job) => {
    Swal.fire({
        title: 'Are you sure?',
        text: `Do you really want to delete the job "${job.title}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteJob(job.id);
            Swal.fire(
                'Deleted!',
                'The Job has been deleted.',
                'success'
            );
        }
    });
};

const deleteJob = async (id: number) => {
    try {
        await JobService.deleteJob(id);
        fetchJobs();
    } catch (error) {
        console.error('Error deleting Job:', error);
        errorMessage.value = 'Failed to delete job. Please try again later.';
    }
};

onMounted(() => {
    fetchJobs();
    fetchDivisions();
});
</script>

<template>
    <v-card elevation="10">
        <v-card-item class="px-0">
            <div class="px-6">
                <v-card-title class="text-h5 mb-1">List Jobs</v-card-title>
                <v-btn color="primary" @click="openAddDialog">Add Job</v-btn>
            </div>
            <perfect-scrollbar style="height: 450px">
                <v-table class="revenue-table border-table">
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-h6 font-weight-semibold text-no-wrap">Title</th>
                                <th class="text-h6 font-weight-semibold text-no-wrap">Description</th>
                                <th class="text-h6 font-weight-semibold text-no-wrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="job in jobs" :key="job.id" class="month-item">
                                <td>
                                    <div class="d-flex align-center overflow-hidden">
                                        <div class="mx-4" style="min-width: 250px">
                                            <h6 class="text-body-1 font-weight-semibold truncate-2">
                                                {{ job.title }}
                                            </h6>
                                        </div>
                                    </div>
                                </td>
                                <td>{{ job.description }}</td>
                                <td>
                                    <v-btn size="30" icon variant="flat" class="grey100">
                                        <v-avatar size="22">
                                            <DotsVerticalIcon size="20" color="grey100" />
                                        </v-avatar>
                                        <v-menu activator="parent">
                                            <v-list elevation="10">
                                                <v-list-item value="action" v-for="list in tableActionData"
                                                    :key="list.listtitle" hide-details min-height="38"
                                                    @click="list.listtitle === 'Delete' ? confirmDelete(job) : openEditDialog(job)">
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
        </v-card-item>
    </v-card>

    <!-- Job Details Modal -->
    <Modal :modelValue="dialog" @update:modelValue="closeDialog">
        <template #title>Job Details</template>
        <template #content>
            <div v-if="selectedJob">
                <p><strong>Title:</strong> {{ selectedJob.title }}</p>
                <p><strong>Description:</strong> {{ selectedJob.description }}</p>
            </div>
        </template>
        <template #actions>
            <v-btn color="primary" @click="closeDialog">Close</v-btn>
        </template>
    </Modal>

    <!-- Add Job Modal -->
    <Modal :modelValue="addDialog" @update:modelValue="closeAddDialog">
        <template #title>Add Job</template>
        <template #content>
            <v-form>
                <v-text-field v-model="newJob.title" label="Title" required />
                <v-text-field v-model="newJob.description" label="Description" required />
                <v-select v-model="newJob.division_id" :items="divisions" item-title="name" item-value="id"
                    label="Division" required />
            </v-form>
        </template>
        <template #actions>
            <v-btn color="primary" @click="addJob">Add</v-btn>
            <v-btn color="secondary" @click="closeAddDialog">Cancel</v-btn>
        </template>
    </Modal>

    <!-- Edit Job Modal -->
    <Modal :modelValue="editDialog" @update:modelValue="closeEditDialog">
        <template #title>Edit Job</template>
        <template #content>
            <v-form>
                <v-text-field v-model="editJob.title" label="Title" required />
                <v-text-field v-model="editJob.description" label="Description" required />
                <v-select v-model="editJob.division_id" :items="divisions" item-title="name" item-value="id"
                    label="Division" required />
            </v-form>
        </template>
        <template #actions>
            <v-btn color="primary" @click="updateJob">Update</v-btn>
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