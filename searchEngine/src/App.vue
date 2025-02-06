<template>
  <div>
      <header class="fixed top-0 left-0 right-0 bg-gray-200 shadow-md flex justify-between items-center p-4 z-10 opacity-80">
          <div v-if="!isHomePage" class="flex items-center space-x-2 cursor-pointer" @click="goBack">
              <Icon icon="mdi:arrow-left" class="text-2xl text-black hover:text-gray-900" />
          </div>
          <div class="flex items-center space-x-2 cursor-pointer" @click="goHome">
              <Icon icon="material-symbols-light:book-5" class="text-3xl text-primary-500" />
              <p class="text-2xl font-k2d text-black">Bookseek</p>
          </div>
      </header>
       
      <div class="mt-50px">
          <RouterView />
      </div>
  </div>  
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute, RouterView } from 'vue-router';
import { Icon } from '@iconify/vue';

const router = useRouter();
const route = useRoute();

const isHomePage = computed(() => route.name === 'home');

function goBack() {
router.back();
}

function goHome() {
router.push({ name: 'home' });
}
</script>

<style>
.mt-50px {
margin-top: 50px;
}
</style>