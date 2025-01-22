<script setup lang="ts">
import { ref } from 'vue';
import AuthService from '@/services/AuthService';
import { useRouter } from 'vue-router';

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');

const register = async () => {
    try {
        const authData = { name: name.value, email: email.value, password: password.value };
        const response = await AuthService.register(authData);
        console.log(response.access_token);
        // Store access token in localStorage (assuming 'token' is the key in the response)
        if (response && response.access_token) {
            localStorage.setItem('access_token', response.access_token);
        }

        router.push('/dashboard');
    } catch (error) {
        console.log(error);
        errorMessage.value = 'Login failed. Please check your credentials.';
    }
}
</script>

<template>
    <form @submit.prevent="register">
        <v-row class="d-flex mb-3">
            <v-col cols="12">
                <v-label class="font-weight-semibold mb-1">Name</v-label>
                <v-text-field v-model="name" variant="outlined" density="compact" hide-details
                    color="primary"></v-text-field>
            </v-col>
            <v-col cols="12">
                <v-label class="font-weight-semibold mb-1">Email Address</v-label>
                <v-text-field v-model="email" variant="outlined" density="compact" type="email" hide-details
                    color="primary"></v-text-field>
            </v-col>
            <v-col cols="12">
                <v-label class="font-weight-semibold mb-1">Password</v-label>
                <v-text-field v-model="password" variant="outlined" type="password" density="compact" hide-details
                    color="primary"></v-text-field>
            </v-col>
            <v-col cols="12">
                <v-btn rounded="md" color="primary" size="large" block flat @click="register">Sign up</v-btn>
            </v-col>
        </v-row>
        <v-row v-if="errorMessage" class="mt-4">
            <v-col cols="12">
                <v-alert type="error">{{ errorMessage }}</v-alert>
            </v-col>
        </v-row>
    </form>
</template>
