<template>
  <main class="w-full h-screen flex flex-col justify-center items-center space-y-6">
    <div class="flex items-center space-x-2">
      <Icon icon="material-symbols-light:book-5" class="text-6xl text-primary-500" />
      <p class="text-6xl font-k2d">Bookseek</p>
    </div>
    <Search v-model:search="searchQuery"  @updateResults="updateBooks"/>
  </main>

<div class="container mx-auto p-4">
  <div class="grid grid-cols-3 gap-6">
    <div class="" v-for="book in booksStore.books" :key="book.id">
      <BookCard :book=book />
    </div>
  </div>
</div>

</template>

<script setup lang="ts">
import Search from '@/components/search.vue';
import { Icon } from "@iconify/vue";
import { ref, onMounted } from 'vue';
import { useBooksStore } from '@/stores/books';
import BookCard from '@/components/bookCard.vue';

const booksStore = useBooksStore();
const searchQuery = ref('');
const filteredBooks = ref<any[]>([]);

onMounted(() => {
  booksStore.fetchBooks();
});

const updateBooks = (books: any[]) => {
  filteredBooks.value = books;
}

</script>