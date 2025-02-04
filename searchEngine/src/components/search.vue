<template>
    <div class="w-1/3 h-9 flex justify-center items-center ring-1 ring-gray-300 focus-within:ring-neutral-900 rounded-lg">
        <input type="text" class="flex-1 h-full outline-0 px-2" v-model="input">
        <div class="w-10 h-full flex justify-center items-center text-gray-500 ">
            <Icon icon="akar-icons:search" class="text-gray-500" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref } from 'vue'

const input = ref('')
</script>