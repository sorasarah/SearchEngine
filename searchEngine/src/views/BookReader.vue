<!-- filepath: /Users/sarahsarah/Desktop/CFA-INSTA/MoteurDeRecherche/M2R/searchEngine/src/views/BookReader.vue -->
<template>
  <div class="min-h-screen bg-gray-100 text-gray-900">
    <div class="pt-20 book-reader">
      <h1 class="book-title text-3xl font-bold text-center my-6">{{ book?.title || 'Titre Inconnu' }}</h1>
      <div class="book-content-container relative flex items-center justify-center mx-auto p-4 border border-gray-300 bg-white shadow-lg rounded-lg">
        <div class="nav-button left" @click="previousPage">&#60;</div>
        <div class="book-content text-lg leading-relaxed">{{ currentText }}</div>
        <div class="nav-button right" @click="nextPage">&#62;</div>
      </div>
      <p class="pagination text-center mt-4">Page {{ currentPage }} / {{ totalPages }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useBooksStore } from '@/stores/books';

const route = useRoute();
const booksStore = useBooksStore();
const book = ref(booksStore.selectedBook || JSON.parse(localStorage.getItem('selectedBook') || 'null'));
const content = ref('');
const currentPage = ref(1);
const charsPerPage = 500;

onMounted(() => {
  const bookId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
  if (!book.value || book.value.id !== parseInt(bookId)) {
    book.value = booksStore.books.find(b => b.id === parseInt(bookId));
    booksStore.setSelectedBook(book.value);
    localStorage.setItem('selectedBook', JSON.stringify(book.value));
  }
  if (book.value && book.value.formats['text/html']) {
    content.value = book.value.formats['text/html'].replace(/<[^>]*>/g, '').trim();
  }
});

const totalPages = computed(() => Math.ceil(content.value.length / charsPerPage));
const currentText = computed(() => content.value.slice((currentPage.value - 1) * charsPerPage, currentPage.value * charsPerPage));

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}
</script>

<style scoped>
:root {
  --bg-color: white;
  --text-color: black;
}

.dark-mode {
  --bg-color: #1e1e1e;
  --text-color: white;
}

.book-reader {
  text-align: center;
  padding: 20px;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.book-title {
  margin-top: 40px;
  font-size: 24px;
  font-weight: bold;
  color: var(--text-color);
}

.book-content-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80%;
  height: 80vh;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.book-content {
  font-size: 18px;
  text-align: justify;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.nav-button {
  position: absolute;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: bold;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.3s, transform 0.3s;
  background-color: var(--bg-color);
  color: var(--text-color);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.nav-button:hover {
  opacity: 1;
  transform: translateY(-2px);
}

.left {
  left: -80px;
}

.right {
  right: -80px;
}

.pagination {
  margin-top: 20px;
}
</style>