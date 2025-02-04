<template>
    <input type="text" class="border border-gray-300 rounded-md" v-model="input">
</template>

<script setup lang="ts">
import { ref } from 'vue'
const input = ref('')
</script>