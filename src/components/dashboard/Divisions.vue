<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Modal from '@/components/shared/Modal.vue';
import type { Division } from '@/services/DivisionService';
import DivisionService from '@/services/DivisionService';
import Swal from 'sweetalert2';


const divisions = ref<Division[]>([]);
const selectedDivision = ref<Division | null>(null);
const errorMessage = ref<string | undefined>(undefined);
const dialog = ref<boolean>(false);
const addDialog = ref<boolean>(false);
const editDialog = ref<boolean>(false);

const tableActionData = ref([
    { listtitle: 'Edit', icon: 'mdi-pencil' },
    { listtitle: 'Delete', icon: 'mdi-delete' },
]);

const newDivision = ref({
    name: ''
});

const fetchDivisions = async () => {
    try {
        const response = await DivisionService.getDivisions();
        divisions.value = response;
    } catch (error) {
        console.error('Error fetching divisions:', error);
        errorMessage.value = 'Failed to fetch divisions. Please try again later.';
    }
};

const openDialog = (division: Division) => {
    selectedDivision.value = division;
    dialog.value = true;
};

const closeDialog = () => {
    dialog.value = false;
    selectedDivision.value = null;
};

const openAddDialog = () => {
    addDialog.value = true;
};

const closeAddDialog = () => {
    addDialog.value = false;
    newDivision.value = {
        name: ''
    };
};

const addDivision = async () => {
    try {
        await DivisionService.createDivision(newDivision.value);
        fetchDivisions();
        closeAddDialog();
    } catch (error) {
        console.error('Error adding division:', error);
        errorMessage.value = 'Failed to add division. Please try again later.';
    }
};

const deleteDivision = async (id: number) => {
    try {
        await DivisionService.deleteDivision(id);
        fetchDivisions();
    } catch (error) {
        console.error('Error deleting division:', error);
        errorMessage.value = 'Failed to delete division. Please try again later.';
    }
};

const openEditDialog = (division: Division) => {
    editDialog.value = true;
    selectedDivision.value = division;
}

const closeEditDialog = () => {
    editDialog.value = false;
    newDivision.value = {
        name: '',
    }
}

const updateDivision = async () => {
    if (!newDivision.value.name) {
        errorMessage.value = "fields name are required";
        return;
    }

    try {
        await DivisionService.updateDivision(selectedDivision.value?.id, newDivision.value)
        fetchDivisions();
        closeEditDialog();
    } catch (error) {
        console.error('Error updating division:', error);
        errorMessage.value = 'Failed to update division. Please try again later.';
    }
}

const confirmDelete = (division: Division) => {
    Swal.fire({
        title: 'Are you sure?',
        text: `Do you really want to delete the division "${division.name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteDivision(division.id);
            Swal.fire(
                'Deleted!',
                'The division has been deleted.',
                'success'
            );
        }
    });
};

onMounted(() => {
    fetchDivisions();
});
</script>

<template>
    <v-card elevation="10">
        <v-card-item class="px-0">
            <div class="px-6">
                <v-card-title class="text-h5 mb-1">List Divisions</v-card-title>
                <v-btn color="primary" @click="openAddDialog">Add Division</v-btn>
            </div>
            <perfect-scrollbar style="height: 450px">
                <v-table class="revenue-table border-table">
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-h6 font-weight-semibold text-no-wrap">Name</th>
                                <th class="text-h6 font-weight-semibold text-no-wrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="division in divisions" :key="division.id" class="month-item">
                                <td>
                                    <div class="d-flex align-center overflow-hidden">
                                        <div class="mx-4" style="min-width: 250px">
                                            <h6 class="text-body-1 font-weight-semibold truncate-2">
                                                {{ division.name }}
                                            </h6>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <v-btn size="30" icon variant="flat" class="grey100">
                                        <v-avatar size="22">
                                            <DotsVerticalIcon size="20" color="grey100" />
                                        </v-avatar>
                                        <v-menu activator="parent">
                                            <v-list elevation="10">
                                                <v-list-item value="action" v-for="list in tableActionData"
                                                    :key="list.listtitle" hide-details min-height="38"
                                                    @click="list.listtitle === 'Delete' ? confirmDelete(division) : openEditDialog(division)">
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

    <Modal :modelValue="dialog" @update:modelValue="closeDialog">
        <template #title>
            Division Details
        </template>
        <template #content>
            <div v-if="selectedDivision">
                <p><strong>Name:</strong> {{ selectedDivision.name }}</p>
            </div>
        </template>
        <template #actions>
            <v-btn color="primary" @click="closeDialog">Close</v-btn>
        </template>
    </Modal>

    <Modal :modelValue="addDialog" @update:modelValue="closeAddDialog">
        <template #title>
            Add Division
        </template>
        <template #content>
            <v-form>
                <v-text-field v-model="newDivision.name" label="Name" required />
            </v-form>
        </template>
        <template #actions>
            <v-btn color="primary" @click="addDivision">Add</v-btn>
            <v-btn color="secondary" @click="closeAddDialog">Cancel</v-btn>
        </template>
    </Modal>

    <!-- Edit Job Modal -->
    <Modal :modelValue="editDialog" @update:modelValue="closeEditDialog">
        <template #title>Edit Job</template>
        <template #content>
            <v-form>
                <v-text-field v-model="newDivision.name" label="Name" required />
            </v-form>
        </template>
        <template #actions>
            <v-btn color="primary" @click="updateDivision">Update</v-btn>
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