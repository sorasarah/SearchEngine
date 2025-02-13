<template>
  <main :class="{'h-middle': filteredBooks.length, 'h-screen': !filteredBooks.length}" class="w-full flex flex-col justify-center items-center space-y-6 mx-1.5 mt-4 md:mt-0">
    <div class="flex items-center space-x-2 mt-4 md:mt-0">
      <Icon icon="material-symbols-light:book-5" class="text-6xl text-primary-500" />
      <p class="text-6xl font-k2d">Bookseek</p>
    </div>

    <!-- Search Component (Dropdown with Titles) -->
    <Input v-model:search="searchQuery" @update:search="updateBooks" class="mb-12 md:mb-0 w-full md:w-auto max-w-xs md:max-w-none" />
  </main>

  <!-- Display Matching Book Cards -->
  <div v-if="filteredBooks.length" class="container mx-auto p-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BookCard v-for="book in filteredBooks" :key="book.id" :book="book" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Input from '../components/input.vue';
import { Icon } from "@iconify/vue";
import { ref, onMounted } from 'vue';
import { useBooksStore } from '@/stores/books';
import BookCard from '@/components/bookCard.vue';

const booksStore = useBooksStore();
const searchQuery = ref(''); // Define searchQuery
const filteredBooks = ref<any[]>([]); // Store list of matching books;

onMounted(() => {
  booksStore.fetchBooks();
});

const updateBooks = (books: any[]) => {
  filteredBooks.value = books;
}
</script>

<style scoped>
.h-middle {
  height: 70vh;
}

@media (max-width: 768px) {
  .space-y-6 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));
    margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));
  }

  .mt-4 {
    margin-top: 1rem;
  }

  .mb-12 {
    margin-bottom: 3rem;
  }
}
</style>