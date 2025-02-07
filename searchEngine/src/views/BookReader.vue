<!-- filepath: /Users/sarahsarah/Desktop/CFA-INSTA/MoteurDeRecherche/M2R/searchEngine/src/views/BookReader.vue -->
<template>
  <div class="min-h-screen bg-gray-100 text-gray-900 mt-10">
    <div class="pt-20 book-reader">
      <h1 class="book-title text-3xl font-bold text-center my-6">{{ book?.titre || 'Titre Inconnu' }}</h1>
      <div class="book-content-container relative flex items-center justify-center mx-auto p-4 border border-gray-300 bg-white shadow-lg rounded-lg">
        <div class="hover-zone left" @mouseover="showLeftButton = true" @mouseleave="showLeftButton = false"></div>
        <div class="hover-zone right" @mouseover="showRightButton = true" @mouseleave="showRightButton = false"></div>
        <div class="nav-button left" v-if="showLeftButton" @click="previousPage">
          <Icon icon="akar-icons:chevron-left" />
        </div>
        <div class="book-content text-lg leading-relaxed">{{ currentText }}</div>
        <div class="nav-button right" v-if="showRightButton" @click="nextPage">
          <Icon icon="akar-icons:chevron-right" />
        </div>
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
import { Icon } from '@iconify/vue';

const route = useRoute();
const booksStore = useBooksStore();

// Fetch the selected book or get from localStorage
const book = ref(booksStore.selectedBook || JSON.parse(localStorage.getItem('selectedBook') || 'null'));
const content = ref('');
const currentPage = ref(1);
const charsPerPage = 1500;
const showLeftButton = ref(false);
const showRightButton = ref(false);

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
  width: 50px;
  height: 50px;
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

.book-content-container:hover .nav-button {
  opacity: 0.5;
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

.hover-zone {
  position: absolute;
  top: 0;
  height: 100%;
  width: 15%;
}

.hover-zone.left {
  left: 0;
}

.hover-zone.right {
  right: 0;
}
</style>
