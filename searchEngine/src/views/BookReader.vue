<template>
  <div class="min-h-screen bg-gray-100 text-gray-900 mt-10">
    <div v-if="book" class="pt-20 book-reader">
      <h1 class="book-title text-3xl font-bold text-center my-6">{{ book?.titre || 'Titre Inconnu' }}</h1>
      
      <div 
        class="book-content-container relative flex items-center justify-center mx-auto p-4 border border-gray-300 bg-white shadow-lg rounded-lg"
        @mousemove="handleMouseMove"
      >
        <div class="hover-zone left" @mouseover="showLeftButton = true" @mouseleave="hideButtons"></div>
        <div class="hover-zone right" @mouseover="showRightButton = true" @mouseleave="hideButtons"></div>

        <div class="nav-button left" v-if="showLeftButton" @click="previousPage">
          <Icon icon="akar-icons:chevron-left" />
        </div>

        <div class="book-content text-lg leading-relaxed" :class="{ 'flip-left': flippingLeft, 'flip-right': flippingRight }">
          {{ currentText }}
        </div>

        <div class="nav-button right" v-if="showRightButton" @click="nextPage">
          <Icon icon="akar-icons:chevron-right" />
        </div>
      </div>

      <p v-if="totalPages > 1" class="pagination text-center mt-4">Page {{ currentPage }} / {{ totalPages }}</p>
    </div>
    <div v-else class="book-not-found">
      <p>Ce livre n'existe pas ou son contenu est indisponible.</p>
    </div>
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
const charsPerPage = 1500;
const showLeftButton = ref(false);
const showRightButton = ref(false);
const flippingLeft = ref(false);
const flippingRight = ref(false);

const pageTurnSound = new Audio('/sounds/page-flip.mp3');

onMounted(() => {
  if (!book.value) {
    router.push({ name: 'home' }); // Redirection si aucun livre trouvé
    return;
  }

  content.value = book.value.content?.replace(/<[^>]*>/g, '').trim() || 'No content available';
});

const totalPages = computed(() => Math.ceil(content.value.length / charsPerPage));

const currentText = computed(() => {
  let start = (currentPage.value - 1) * charsPerPage;
  let end = start + charsPerPage;

  // Éviter de couper un mot en plein milieu
  while (end < content.value.length && content.value[end] !== ' ') {
    end++;
  }

  return content.value.slice(start, end);
});

function handleMouseMove() {
  showLeftButton.value = true;
  showRightButton.value = true;

  setTimeout(() => {
    showLeftButton.value = false;
    showRightButton.value = false;
  }, 2000);
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    flippingRight.value = true;
    pageTurnSound.play();
    setTimeout(() => {
      flippingRight.value = false;
      currentPage.value++;
    }, 500);
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    flippingLeft.value = true;
    pageTurnSound.play();
    setTimeout(() => {
      flippingLeft.value = false;
      currentPage.value--;
    }, 500);
  }
}
</script>

<style scoped>
.book-content-container {
  position: relative;
  width: 80%;
  height: 80vh;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  background-color: white;
  color: black;
}

.book-content {
  font-size: 18px;
  text-align: justify;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  transition: transform 0.5s ease-in-out;
}

/* Animation de flip */
.flip-left {
  animation: flip-left 0.5s ease-in-out forwards;
}

.flip-right {
  animation: flip-right 0.5s ease-in-out forwards;
}

@keyframes flip-left {
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(-90deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}

@keyframes flip-right {
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(90deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}

.nav-button {
  position: absolute;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s, transform 0.3s;
  background-color: white;
  color: black;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.nav-button:hover {
  opacity: 1;
  transform: scale(1.1);
}

.left {
  left: 10px;
}

.right {
  right: 10px;
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
