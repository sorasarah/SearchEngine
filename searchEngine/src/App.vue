<template>
  <div>
        <div :style="{ height: height + 'px' }">
            <header v-if="!isHomePage" ref="header" class="fixed top-0 left-0 right-0 flex justify-between items-center p-4 z-10 opacity-80">
                <div class="flex items-center space-x-2 cursor-pointer" @click="goBack">
                    <Icon icon="mdi:arrow-left" class="text-2xl text-black hover:text-gray-900" />
                </div>
                <div class="flex items-center space-x-2 cursor-pointer" @click="goHome">
                    <Icon icon="material-symbols-light:book-5" class="text-3xl text-primary-500" />
                    <p class="text-2xl font-k2d text-black">Bookseek</p>
                </div>
            </header>
        </div>
       
      <div>
          <RouterView />
      </div>
  </div>  
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
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

// header height
const header = ref<HTMLElement | null>(null);
const height = computed(() => {
    if (header.value) {
        return header.value.clientHeight;
    }
    return 0;
});
</script>

<style>

</style>