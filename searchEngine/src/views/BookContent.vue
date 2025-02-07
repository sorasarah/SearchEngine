<template>
  <div class="container mx-auto p-6">
    <div class="text-center mt-4">
      <h1 class="text-3xl font-bold">{{ book?.titre || "Livre inconnu" }}</h1>
    </div>

    <!-- Book Cover -->
    <div class="flex flex-col items-center mt-4">
      <img
        v-if="book?.image"
        :src="imageUrl"
        :alt="book?.titre"
        class="w-1/3 shadow-lg rounded-lg"
      >
    </div>

    <!-- Book Authors -->
    <div v-if="book?.authors?.length" class="mt-6">
      <h2 class="text-xl font-semibold">Auteurs</h2>
      <ul class="list-disc pl-6">
        <li v-for="author in book.authors" :key="author.name">{{ author.name }}</li>
      </ul>
    </div>

    <!-- Book Summary -->
    <div class="mt-6">
      <h2 class="text-xl font-semibold">Résumé</h2>
      <p class="text-gray-700">{{ book?.summary || "Aucun résumé disponible." }}</p>
    </div>

    <!-- Read More Button -->
    <div class="mt-6 text-center">
      <button @click="goToReader" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Lire la suite
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
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
onMounted(() => {
  const bookId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;

  if (!book.value || book.value.id !== parseInt(bookId)) {
    book.value = booksStore.books.find(b => b.id === parseInt(bookId)) || null;

    if (book.value) {
      booksStore.setSelectedBook(book.value);
      localStorage.setItem('selectedBook', JSON.stringify(book.value));
    } else {
      // If the book is not found in store, try loading from localStorage
      const storedBook = localStorage.getItem('selectedBook');
      if (storedBook) {
        book.value = JSON.parse(storedBook);
      }
    }
  }
});

// Navigation methods
const goHome = () => {
  router.push({ path: '/' });
};

const goToReader = () => {
  if (book.value?.id) {
    router.push({ name: 'bookReader', params: { id: book.value.id } });
  }
};
</script>
