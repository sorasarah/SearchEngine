<template>
  <div class="relative w-full max-w-md">
    <!-- Search Input -->
    <input
      type="text"
      v-model="search"
      class="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Search books..."
    >

    <!-- Dropdown with Book Titles -->
    <div
      v-if="search && books.length"
      class="absolute w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto"
    >
      <ul>
        <li
          v-for="book in books"
          :key="book.id"
          @click="selectBook(book)"
          class="p-2 hover:bg-gray-100 cursor-pointer"
        >
          {{ book.titre }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, watch } from 'vue';
import { useBooksStore } from '@/stores/books';

const booksStore = useBooksStore();
const search = ref("");
let timeout: number = 0;
const books = ref<any[]>([]);
const emit = defineEmits(["update:search"]);

watch(search, () => {
  console.log("Search: ", search.value);
  
  clearTimeout(timeout);
  timeout = setTimeout(updateResults, 500);
});

// Emit filtered books list
const updateResults = async () => {
  await booksStore.search(search.value);
  books.value = booksStore.books;
  emit("update:search", books.value);
};

// When a book title is clicked, emit the selected book
const selectBook = (book: any) => {
  emit("update:search", [book]); // Emit a list with the single selected book
  search.value = book.titre;
};
</script>
