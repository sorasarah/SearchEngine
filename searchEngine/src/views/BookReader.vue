<!-- filepath: /Users/sarahsarah/Desktop/CFA-INSTA/MoteurDeRecherche/M2R/searchEngine/src/views/BookReader.vue -->
<template>
  <div >

    <div v-if="book" class="book-reader">
      <h1 class="book-title">{{ book?.titre || 'Titre Inconnu' }}</h1>

      <div class="book-content-container">
        <div v-if="totalPages > 1" class="nav-button left" @click="previousPage">&#60;</div>
        <div class="book-content">{{ currentText }}</div>
        <div v-if="totalPages > 1" class="nav-button right" @click="nextPage">&#62;</div>
      </div>

      <p v-if="totalPages > 1" class="pagination text-center mt-4">Page {{ currentPage }} / {{ totalPages }}</p>
    </div>

    <div v-else class="book-not-found">
      <p>Ce livre n'existe pas ou son contenu est indisponible.</p>
      <button @click="goHome" class="back-home">Retour à l'accueil</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useBooksStore } from '@/stores/books';

const route = useRoute();
const booksStore = useBooksStore();

// Fetch the selected book or get from localStorage
const book = ref(booksStore.selectedBook || JSON.parse(localStorage.getItem('selectedBook') || 'null'));
const content = ref('');
const currentPage = ref(1);
const charsPerPage = 1500;

onMounted(() => {
  if (!book.value) {
    router.push({ name: 'home' }); // Redirect if no book found
    return;
  }

  content.value = book.value.content?.replace(/<[^>]*>/g, '').trim() || 'No content available';
});

const totalPages = computed(() => Math.ceil(content.value.length / charsPerPage));
const currentText = computed(() => content.value.slice((currentPage.value - 1) * charsPerPage, currentPage.value * charsPerPage));

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
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

.book-not-found {
  text-align: center;
  font-size: 20px;
  color: red;
  margin-top: 50px;
}

.back-home {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: blue;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
