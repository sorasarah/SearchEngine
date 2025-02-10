<template>
  <div class="relative w-full max-w-md">
    <!-- Search Input -->
    <div>
      <input
        type="text"
        v-model="searchQuery"
        @input="updateResults"
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
      v-if="searchQuery && filteredBooks.length"
      class="absolute w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto"
    >
      <ul>
        <li
          v-for="book in filteredBooks"
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
import { ref, computed, defineEmits } from 'vue';
import { useBooksStore } from '@/stores/books';
import { Icon } from '@iconify/vue';

const booksStore = useBooksStore();
const searchQuery = ref("");
const emit = defineEmits(["update:search", "updateResults"]);

// Computed list of books that match the search
const filteredBooks = computed(() => {
  if (!searchQuery.value) return [];
  return booksStore.books.filter(book =>
    book.titre.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Emit filtered books list
const updateResults = () => {
  emit("updateResults", filteredBooks.value);
};

// When a book title is clicked, emit the selected book and hide dropdown
const selectBook = (book: any) => {
  emit("updateResults", [book]); 
  searchQuery.value = book.titre; 
  filteredBooks.value.splice(0, filteredBooks.value.length); 
};

// Apply search and hide dropdown
const applySearch = () => {
  emit("updateResults", filteredBooks.value);
  searchQuery.value = searchQuery.value;
  filteredBooks.value.splice(0, filteredBooks.value.length); 

  console.log("Search Applied", "je vide le dropdown", filteredBooks.value);
};
</script>