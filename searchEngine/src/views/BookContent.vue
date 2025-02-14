<template>
  <div class="w-full xl:w-2/3 px-4 xl:mx-auto my-4">
    <div class="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5">
      <div class="bg-orange-100 flex flex-col items-center justify-center rounded-md p-16">
        <img v-if="book?.image" :src="imageUrl" :alt="book?.titre" class="w-60 rounded-md">
      </div>
      <div class="flex-1 space-y-4">
        <div>
          <h1 class="text-2xl font-bold font-k2d">{{ book?.titre || "Livre inconnu" }}</h1>
          <p class="text-neutral-500 text-sm">By {{ book?.authors?.map((author: any) => author.name).join(', ') || "Auteur inconnu" }}</p>
        </div>
        <div>
          <p class="font-bold font-k2d">Description</p>
          <p class="text-neutral-500 text-sm">{{ book?.summary || "Aucune description disponible." }}</p>
        </div>
        <div class="flex justify-center sm:justify-end">
          <button @click="goToReader" class="text-white font-medium font-k2d bg-neutral-900 hover:bg-neutral-800 rounded-full cursor-pointer px-6 py-1.5 transition-transform duration-300 ease-in-out">Lire la suite</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { ref, computed, onMounted, watch } from 'vue';
import { useBooksStore } from '@/stores/books';

const router = useRouter();
const route = useRoute();
const booksStore = useBooksStore();
const book = ref(booksStore.selectedBook);

// Get BACK_URL from environment variables
const BACK_URL = import.meta.env.VITE_BACK_URL;

// Computed property for the image URL
const imageUrl = computed(() => book.value?.image ? `${BACK_URL}/${book.value.image.replace(/\\/g, '/')}` : '');

// Fetch the book when the page loads
watch(() => booksStore.selectedBook, () => {
  book.value = booksStore.selectedBook;
});

onMounted(async () => {
  const ID = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
  await booksStore.get(parseInt(ID));
});

const goToReader = () => {
  if (book.value?.id) {
    router.push({ name: 'bookReader', params: { id: book.value.id } });
  }
};
</script>