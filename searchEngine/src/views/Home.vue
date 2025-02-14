<template>
  <main :class="{'h-middle': filteredBooks.length, 'h-screen': !filteredBooks.length}" class="w-full flex flex-col justify-center items-center space-y-4 py-10">
    <div class="flex items-center space-x-2">
      <Icon icon="material-symbols-light:book-5" class="text-4xl sm:text-6xl text-primary-500" />
      <p class="text-4xl sm:text-6xl font-k2d">Bookseek</p>
    </div>

    <!-- Search Component (Dropdown with Titles) -->
    <Input v-model:search="searchQuery" @update:search="updateBooks" />
  </main>

  <!-- Display Matching Book Cards -->
  <div v-if="filteredBooks.length" class="flex justify-center mx-auto p-4">
    <div class="w-max grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 justify-center gap-6">
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

const updateBooks = (books: any[]) => {
  filteredBooks.value = books;
}
</script>