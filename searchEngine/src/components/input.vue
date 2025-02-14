<template>
  <div class="relative w-full max-w-xl px-2">
    <!-- Search Input -->
    <div class="flex group rounded-md focus-within:ring-2 focus-within:ring-blue-500/50">
      <input
        type="text"
        class="border-l border-t border-b border-gray-300 rounded-l-md p-2 w-full outline-none"
        placeholder="Search books..."
        v-model="search"
        @input="searching = true"
        @keyup.enter="applySearch"
        @focus="searching = true"
        @blur="stop_search"
      >
      <div class="flex items-center border-t border-r border-b border-gray-300 rounded-r-md p-2 bg-white">
        <Icon
          icon="akar-icons:search"
          class="text-gray-500"
          @click="applySearch"
        />
      </div>
    </div>

    <!-- Dropdown with Book Titles -->
    <div
      v-if="searching && books.length"
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
    <div v-if="booksStore.suggestion" class="p-2 text-gray-500">
        No books found, maybe you was tring to search for: <span class="text-gray-800 font-bold cursor-pointer" @click="search = booksStore.suggestion">{{ booksStore.suggestion }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useBooksStore } from '@/stores/books';
import { Icon } from '@iconify/vue';

const booksStore = useBooksStore();
const search = ref("");
const searching = ref(false);

let timeout: number = 0;
const books = ref<any[]>([]);
const emit = defineEmits(["update:search"]);

watch(search, () => {
  clearTimeout(timeout);
  if (search.value) {
    timeout = setTimeout(updateResults, 100);
  } else {
    books.value = [];
    searching.value = false;
    emit("update:search", books.value);
  }
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
  searching.value = false;
};

// Apply search and hide dropdown
const applySearch = () => {
  emit("update:search", books.value);
  searching.value = false;
};

const stop_search = () => {
  setTimeout(() => {
    searching.value = false;
  }, 200);
}
</script>
