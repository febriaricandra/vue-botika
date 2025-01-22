<script setup lang="ts">
/*Call Components*/
import Employees from '@/components/dashboard/Employees.vue';

</script>

<template>
    <v-row>
        <!-- <v-col cols="12" md="8">
            <RevenueCard />
        </v-col>
        <v-col cols="12" md="4">
            <TotalFolllowers class="mb-6" />
            <Totalincome />
        </v-col> -->
        <v-col cols="12" lg="12">
            <Employees />
        </v-col>

    </v-row>

</template>
