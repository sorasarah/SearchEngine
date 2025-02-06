<template>
  <div class="container mx-auto p-6">
    <button @click="goHome" class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Retour</button>
    <div class="text-center mt-4">
      <h1 class="text-3xl font-bold">{{ book?.title }}</h1>
    </div>
    <div class="flex flex-col items-center mt-4">
      <img :src="book?.formats['image/jpeg']" :alt="book?.title" class="w-1/3 shadow-lg rounded-lg">
    </div>
    <div class="mt-6">
      <h2 class="text-xl font-semibold">Auteurs</h2>
      <ul class="list-disc pl-6">
        <li v-for="author in book?.authors" :key="author.name">{{ author.name }}</li>
      </ul>
    </div>
    <div class="mt-6">
      <h2 class="text-xl font-semibold">Résumé</h2>
      <p class="text-gray-700">{{ book?.summaries.join(', ') }}</p>
    </div>
    <div class="mt-6 text-center">
      <button @click="goToReader" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Lire la suite</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useBooksStore } from '@/stores/books';

const router = useRouter();
const route = useRoute();
const booksStore = useBooksStore();
const book = ref(booksStore.selectedBook);

onMounted(() => {
  const bookId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
  if (!book.value || book.value.id !== parseInt(bookId)) {
    book.value = booksStore.books.find(b => b.id === parseInt(bookId));
    booksStore.setSelectedBook(book.value);
    localStorage.setItem('selectedBook', JSON.stringify(book.value));
  }
});

function goHome() {
  router.push({ path: '/' });
}

function goToReader() {
  router.push({ name: 'bookReader', params: { id: book.value?.id } });
}
</script>