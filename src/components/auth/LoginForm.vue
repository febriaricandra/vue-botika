<script setup lang="ts">
import { ref } from 'vue';
import AuthService from '@/services/AuthService';
import { useRouter } from 'vue-router'; 
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const login = async () => {
    try {
        console.log('clicked');
        const authData = { email: email.value, password: password.value };
        const response = await AuthService.login(authData);
        console.log(response);
        // Store access token in localStorage (assuming 'token' is the key in the response)
        if (response && response.access_token) {
            localStorage.setItem('access_token', response.access_token); 
        }

        router.push('/dashboard'); 
    } catch (error) {
        console.log(error);
        errorMessage.value = 'Login failed. Please check your credentials.';
    }
};

</script>

<template>
    <form @submit.prevent="login">
        <v-row class="d-flex mb-3">
            <v-col cols="12">
                <v-label class="font-weight-semibold mb-1">Email</v-label>
                <v-text-field v-model="email" variant="outlined" density="compact" hide-details
                    color="primary"></v-text-field>
            </v-col>
            <v-col cols="12">
                <v-label class="font-weight-semibold mb-1">Password</v-label>
                <v-text-field v-model="password" variant="outlined" density="compact" type="password" hide-details
                    color="primary"></v-text-field>
            </v-col>
            <v-col cols="12" class="pt-0">
                <v-btn rounded="md" color="primary" size="large" block flat @click="login">Sign in</v-btn>
            </v-col>
        </v-row>
        <v-row v-if="errorMessage" class="mt-4">
            <v-col cols="12">
                <v-alert type="error">{{ errorMessage }}</v-alert>
            </v-col>
        </v-row>
    </form>
</template>
