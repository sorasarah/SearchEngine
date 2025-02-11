<template>
  <div class="relative w-full max-w-md">
    <!-- Search Input -->
    <div>
      <input
        type="text"
        v-model="search"
        @keyup.enter="applySearch"
        class="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search books..."
      >
      <Icon
        icon="akar-icons:search"
        class="absolute right-2 top-3 text-gray-500 cursor-pointer"
        @click="applySearch"
      />
    </div>

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
import { ref, computed, defineEmits, watch } from 'vue';
import { useBooksStore } from '@/stores/books';
import { Icon } from '@iconify/vue';

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

// When a book title is clicked, emit the selected book and hide dropdown
const selectBook = (book: any) => {
  emit("update:search", [book]); 
  search.value = book.titre; 
  books.value = [];
};

// Apply search and hide dropdown
const applySearch = () => {
  emit("update:search", books.value);
  books.value = [];

  console.log("Search Applied", "je vide le dropdown", books.value);
};
</script>