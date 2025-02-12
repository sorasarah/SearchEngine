<template>
  <div class="relative w-full max-w-md">
    <!-- Search Input -->
    <div>
      <input
        type="text"
        class="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search books..."
        v-model="search"
        @keyup.enter="applySearch"
        @focus="searching = true"
      >
      <Icon
        icon="akar-icons:search"
        class="absolute right-2 top-3 text-gray-500 cursor-pointer"
        @click="applySearch"
      />
    </div>

    <!-- Dropdown with Book Titles -->
    <div
      v-if="searching && search"
      class="absolute w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto"
    >
      <ul v-if="books.length">
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
    <div v-if="searchTriggered && !books.length && search" class="p-2 text-gray-500">
        Book not found
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useBooksStore } from '@/stores/books';
import { Icon } from '@iconify/vue';

const booksStore = useBooksStore();
const search = ref("");
const searching = ref(false);
let timeout: number = 0;
const books = ref<any[]>([]);
const emit = defineEmits(["update:search"]);
const searchTriggered = ref(false);

watch(search, () => {
  clearTimeout(timeout);
  if (search.value) {
    timeout = setTimeout(updateResults, 500);
  } else {
    books.value = [];
    searching.value = false;
    searchTriggered.value = false;
    emit("update:search", books.value);
  }
});

// Emit filtered books list
const updateResults = async () => {
  await booksStore.search(search.value);
  books.value = booksStore.books;
  emit("update:search", books.value);
  searching.value = true;
};

// When a book title is clicked, emit the selected book and hide dropdown
const selectBook = (book: any) => {
  emit("update:search", [book]);
  search.value = book.titre;
  searching.value = false;
  searchTriggered.value = false;
};

// Apply search and hide dropdown
const applySearch = () => {
  searchTriggered.value = true;
  emit("update:search", books.value);
  searching.value = false;
};
</script>
