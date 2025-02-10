<template>
  <div v-if="book" class="book-container min-h-screen bg-gray-100 text-gray-900 mt-5">
    <h1 class="book-title">{{ book?.titre || 'Titre Inconnu' }}</h1>

    <div class="book">
      <transition :name="swipeDirection" mode="out-in">
        <div :key="currentPage" class="page">
          <div class="page-content">
            {{ currentText }}
          </div>
        </div>
      </transition>
    </div>

    <div class="controls">
      <button @click="previousPage" v-if="showLeftButton && currentPage > 1" class="nav-button left">
        <Icon icon="akar-icons:chevron-left" />
      </button>
      <p class="pagination">Page {{ currentPage }} / {{ totalPages }}</p>
      <button @click="nextPage" v-if="showRightButton && currentPage != totalPages" class="nav-button right">
        <Icon icon="akar-icons:chevron-right" />
      </button>
    </div>

  </div>
  <div v-else class="book-not-found">
    <p>Ce livre n'existe pas ou son contenu est indisponible.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBooksStore } from '@/stores/books';
import { Icon } from '@iconify/vue';

const route = useRoute();
const router = useRouter();
const booksStore = useBooksStore();
const book = ref(booksStore.selectedBook || JSON.parse(localStorage.getItem('selectedBook') || 'null'));

const content = ref('');
const currentPage = ref(1);
const charsPerPage = 1200; // Ajuste la longueur d'une page
const swipeDirection = ref(''); // Gestion de la direction de l'animation
const showLeftButton = ref(true);
const showRightButton = ref(true);

const pageTurnSound = new Audio('@/assets/sounds/page-flip.mp3');

onMounted(() => {
  if (!book.value) {
    router.push({ name: 'home' });
    return;
  }
  content.value = book.value.content?.replace(/<[^>]*>/g, '').trim() || 'No content available';
});

const totalPages = computed(() => Math.ceil(content.value.length / charsPerPage));

const currentText = computed(() => {
  let start = (currentPage.value - 1) * charsPerPage;
  let end = start + charsPerPage;
  return content.value.slice(start, end);
});

function nextPage() {
  if (currentPage.value < totalPages.value) {
    swipeDirection.value = 'swipe-left'; // Ajout effet swipe gauche
    pageTurnSound.play();
    currentPage.value++;
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    swipeDirection.value = 'swipe-right'; // Ajout effet swipe droite
    pageTurnSound.play();
    currentPage.value--;
  }
}
</script>

<style scoped>
.book-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh;
  background-color: #f3f3f3;
}

.book-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.book {
  position: relative;
  width: 600px;
  height: 400px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.page {
  width: 100%;
  height: 100%;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: absolute;
}

/* Effet SWIPE LEFT (Next Page) */
.swipe-left-enter-active {
  animation: swipeLeft 0.6s ease-in-out;
}
.swipe-left-leave-active {
  animation: swipeLeftExit 0.6s ease-in-out;
}

/* Effet SWIPE RIGHT (Previous Page) */
.swipe-right-enter-active {
  animation: swipeRight 0.6s ease-in-out;
}
.swipe-right-leave-active {
  animation: swipeRightExit 0.6s ease-in-out;
}

@keyframes swipeLeft {
  0% { transform: translateX(100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}

@keyframes swipeLeftExit {
  0% { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(-100%); opacity: 0; }
}

@keyframes swipeRight {
  0% { transform: translateX(-100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}

@keyframes swipeRightExit {
  0% { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
}

.controls {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.nav-button {
  width: 40px;
  height: 40px;
  border: none;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 15px;
}

.pagination {
  font-size: 16px;
  font-weight: bold;
}
</style>
