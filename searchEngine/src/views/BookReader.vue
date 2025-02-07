<template>
  <div class="book-container">
    <h1 class="book-title">{{ book?.titre || 'Titre Inconnu' }}</h1>

    <div
      class="book"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="endDrag"
      @touchstart="startDrag"
      @touchmove="onDrag"
      @touchend="endDrag"
    >
      <!-- Left Page -->
      <div class="page left" :class="{ flipping: isFlippingLeft }">
        <div class="page-content">
          <p>{{ leftPageText }}</p>
        </div>
      </div>

      <!-- Right Page -->
      <div class="page right" :class="{ flipping: isFlippingRight }">
        <div class="page-content">
          <p>{{ rightPageText }}</p>
        </div>
      </div>
    </div>

    <p class="pagination">Page {{ currentPage }} - {{ currentPage + 1 }} / {{ totalPages }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useBooksStore } from '@/stores/books';

const booksStore = useBooksStore();
const book = ref(booksStore.selectedBook || JSON.parse(localStorage.getItem('selectedBook') || 'null'));
const content = ref('');
const currentPage = ref(1);
const charsPerPage = 700;
const isFlippingLeft = ref(false);
const isFlippingRight = ref(false);
const startX = ref(0);
const isDragging = ref(false);

onMounted(() => {
  if (!book.value) return;
  content.value = book.value.content?.replace(/<[^>]*>/g, '').trim() || 'No content available';
});

// Total number of two-page spreads
const totalPages = computed(() => Math.ceil(content.value.length / (charsPerPage * 2)));

// Left page text
const leftPageText = computed(() =>
  content.value.slice((currentPage.value - 1) * charsPerPage, currentPage.value * charsPerPage)
);

// Right page text
const rightPageText = computed(() =>
  content.value.slice(currentPage.value * charsPerPage, (currentPage.value + 1) * charsPerPage)
);

// Detect drag start
function startDrag(event) {
  isDragging.value = true;
  startX.value = event.touches ? event.touches[0].clientX : event.clientX;
}

// Detect drag move
function onDrag(event) {
  if (!isDragging.value) return;
  const currentX = event.touches ? event.touches[0].clientX : event.clientX;
  const deltaX = currentX - startX.value;

  if (deltaX < -50) {
    flipNextPage();
    isDragging.value = false;
  } else if (deltaX > 50) {
    flipPrevPage();
    isDragging.value = false;
  }
}

// Detect drag end
function endDrag() {
  isDragging.value = false;
}

// Flip to next pages
function flipNextPage() {
  if (currentPage.value < totalPages.value) {
    isFlippingRight.value = true;
    setTimeout(() => {
      currentPage.value += 2;
      isFlippingRight.value = false;
    }, 600);
  }
}

// Flip to previous pages
function flipPrevPage() {
  if (currentPage.value > 1) {
    isFlippingLeft.value = true;
    setTimeout(() => {
      currentPage.value -= 2;
      isFlippingLeft.value = false;
    }, 600);
  }
}
</script>

<style scoped>
/* Center book container */
.book-container {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: white;
  color: black;
  padding: 20px;
}

/* Book Title */
.book-title {
  margin-bottom: 20px;
  font-size: 32px;
  font-weight: bold;
}

/* Book Layout */
.book {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 900px;
  height: 600px;
  perspective: 1500px;
}

/* Pages */
.page {
  width: 440px;
  height: 100%;
  background: #fff;
  border: 2px solid #ddd;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.6s ease-in-out;
}

/* Left Page */
.page.left {
  transform-origin: right;
}

/* Right Page */
.page.right {
  transform-origin: left;
}

/* Page Content */
.page-content {
  padding: 25px;
  font-size: 20px;
  text-align: justify;
  width: 100%;
  height: 100%;
}

/* Flipping Effect */
.flipping {
  animation: flipEffect 0.6s ease-in-out;
}

@keyframes flipEffect {
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(-15deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}

/* Pagination */
.pagination {
  margin-top: 20px;
  font-size: 20px;
}
</style>
