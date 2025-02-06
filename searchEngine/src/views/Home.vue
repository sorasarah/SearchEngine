<template>
  <main class="w-full h-screen flex flex-col justify-center items-center space-y-6">
    <div class="flex items-center space-x-2">
      <Icon icon="material-symbols-light:book-5" class="text-6xl text-primary-500" />
      <p class="text-6xl font-k2d">Bookseek</p>
    </div>
    <Search />
  </main>

  <div class="books-list">
    <div v-for="book in booksStore.books" :key="book.id">
      <BookCard :book="book" @click="goToBook(book)"/>
    </div>
  </div>

</template>

<script setup lang="ts">
import Search from '@/components/search.vue';
import { Icon } from "@iconify/vue";
import { ref, onMounted } from 'vue';
import { useBooksStore } from '@/stores/books';
import BookCard from '@/components/bookCard.vue';
import { useRouter } from 'vue-router';

const booksStore = useBooksStore();
const router = useRouter();
const input = ref('');

onMounted(() => {
  booksStore.fetchBooks();
});

const goToBook = (book: any) => {
  booksStore.setSelectedBook(book);
  router.push({ name: 'book', params: { id: book.id } });
};

</script>

<style scoped>
.books-list {
  display: flex;
}
</style>