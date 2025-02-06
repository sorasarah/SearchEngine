<template>
  <div :class="{ 'dark-mode': isDarkMode }">
    <div>
      <button @click="goBack" class="back-button">Retour</button>
      <button @click="toggleDarkMode" class="mode-toggle">
        <Icon :icon="isDarkMode ? 'mdi:weather-sunny' : 'mdi:weather-night'" class="text-2xl" />
      </button>
      <button @click="goHome" class="home-button">Accueil</button>
    </div>
    <div class="book-reader">
      <h1 class="book-title">{{ book?.title || 'Titre Inconnu' }}</h1>
      <div class="book-content-container">
        <div class="nav-button left" @click="previousPage">&#60;</div>
        <div class="book-content">{{ currentText }}</div>
        <div class="nav-button right" @click="nextPage">&#62;</div>
      </div>
      <p class="pagination">Page {{ currentPage }} / {{ totalPages }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useBooksStore } from '@/stores/books';
import { Icon } from '@iconify/vue';

const router = useRouter();
const route = useRoute();
const booksStore = useBooksStore();
const book = ref(booksStore.selectedBook || JSON.parse(localStorage.getItem('selectedBook') || 'null'));
const content = ref('');
const currentPage = ref(1);
const charsPerPage = 500;
const isDarkMode = ref(localStorage.getItem('darkMode') === 'true');

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

function goBack() {
  router.push({ name: 'book', params: { id: route.params.id } });
}

function goHome() {
  router.push({ name: 'home' });
}

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('darkMode', isDarkMode.value);
}
</script>

<style scoped>
:root {
  --bg-color: white;
  --text-color: black;
}

.dark-mode {
  --bg-color: black;
  --text-color: white;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
}

.book-reader {
  text-align: center;
  padding: 20px;
}

.mode-toggle {
  position: absolute;
  top: 20px;
  right: 50%;
  transform: translateX(50%);
  padding: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
}

.back-button, .home-button {
  position: absolute;
  top: 20px;
  padding: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
}

.back-button { left: 20px; }
.home-button { right: 20px; }

.book-title {
  margin-top: 40px;
  font-size: 24px;
  font-weight: bold;
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
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s;
  background-color: var(--text-color);
  color: var(--bg-color);
}

.nav-button:hover {
  opacity: 1;
}

.left {
  left: -60px;
}

.right {
  right: -60px;
}

.pagination {
  margin-top: 20px;
}
</style>