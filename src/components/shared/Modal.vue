<template>
    <v-dialog v-model="isOpen" max-width="500px">
        <v-card>
            <v-card-title>
                <slot name="title">Default Title</slot>
                <v-spacer></v-spacer>
                <v-btn icon @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <slot name="content">Default Content</slot>
            </v-card-text>
            <v-card-actions>
                <slot name="actions">
                    <v-btn color="primary" @click="close">Close</v-btn>
                </slot>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    }
});

const emits = defineEmits(['update:modelValue']);

const isOpen = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
    isOpen.value = newVal;
});

const close = () => {
    isOpen.value = false;
    emits('update:modelValue', false);
};
</script>