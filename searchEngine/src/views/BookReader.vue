<template>
  <div class="book-container mt-15">
    <h1 class="book-title">{{ book?.titre || 'Titre Inconnu' }}</h1>

    <div class="book" @click="handlePageClick" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
      <!-- Responsive Page Display -->
      <div v-if="isMobile" class="page single" :class="{ flipping: isFlipping, 'swiping-left': isSwipingLeft, 'swiping-right': isSwipingRight }">
        <div class="page-content">
          <p>{{ currentText }}</p>
        </div>
      </div>

      <template v-else>
        <!-- Desktop: Left Page (Only Display if Not First Page) -->
        <div v-if="leftPageText" class="page left" :class="{ flipping: isFlippingLeft }">
          <div class="page-content">
            <p>{{ leftPageText }}</p>
          </div>
        </div>

        <!-- Desktop: Right Page -->
        <div v-if="rightPageText" class="page right" :class="{ flipping: isFlippingRight }">
          <div class="page-content">
            <p>{{ rightPageText }}</p>
          </div>
        </div>
      </template>
    </div>

    <div v-if="isMobile">
      <div class="controls mt-5">
        <button @click="flipPrevPage" v-if="currentPage > 1" class="nav-button left">
          <Icon icon="akar-icons:chevron-left" />
        </button>
        <p class="pagination"> {{ currentPage }} sur {{ totalPages }} </p>
        <button @click="flipNextPage" v-if="currentPage < totalPages" class="nav-button right ml-5">
          <Icon icon="akar-icons:chevron-right" />
        </button>
      </div>
    </div>
    <div v-else>
      <div class="controls mt-5">
        <button @click="flipPrevPage" v-if="currentPage > 1" class="nav-button left mr-5">
          <Icon icon="akar-icons:chevron-left" />
        </button>
        <p class="pagination"> {{ currentPage }}-{{ currentPage + 1 }} sur {{ totalPages }} </p>
        <button @click="flipNextPage" v-if="currentPage < totalPages" class="nav-button right">
          <Icon icon="akar-icons:chevron-right" />
        </button>
      </div>
    </div>
     <!-- Audio Narration Button -->
     <div class="audio-controls mt-5">
      <button @click="startAudioNarration" class="nav-button audio">
        <Icon icon="akar-icons:play" />
        Lecture Audio
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useBooksStore } from '@/stores/books'
import { Icon } from '@iconify/vue'
import pageFlipSound from '@/assets/sounds/page-flip.mp3'
// import pageFlipSound from '@/assets/sounds/turnpage.mp3'

const booksStore = useBooksStore()
const book = ref(booksStore.selectedBook || JSON.parse(localStorage.getItem('selectedBook') || 'null'))
const content = ref('')
const currentPage = ref(1)
const isFlippingLeft = ref(false)
const isFlippingRight = ref(false)
const isFlipping = ref(false)
const isSwipingLeft = ref(false)
const isSwipingRight = ref(false)
const isMobile = ref(window.innerWidth <= 768)
const pages = ref([])
let charsPerPage = ref(isMobile.value ? 500 : 600) // Make it reactive

const audio = new Audio(pageFlipSound)

// Function to update layout when screen resizes
const updateLayout = () => {
  const previousPage = currentPage.value // Store the current page
  isMobile.value = window.innerWidth <= 768
  charsPerPage.value = isMobile.value ? 500 : 700 // Adjust character limit dynamically
  splitContentIntoPages() // Recalculate pages
  currentPage.value = previousPage // Restore the current page
}

// **Initialize Component**
onMounted(() => {
  if (!book.value) return
  content.value = book.value.content?.replace(/<[^>]*>/g, '').trim() || 'No content available'

  updateLayout()
  window.addEventListener('resize', updateLayout)
})

// **Cleanup**
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateLayout)
})

// Watch content change & update pages dynamically
watch([content, isMobile], () => splitContentIntoPages())

// **Split Content Into Pages**
function splitContentIntoPages() {
  pages.value = []
  let sentences = content.value.match(/[^.!?]+[.!?]+/g) || [content.value]
  let pageContent = ''

  for (let sentence of sentences) {
    if ((pageContent + sentence).length > charsPerPage.value) {
      pages.value.push(pageContent.trim())
      pageContent = sentence
    } else {
      pageContent += ' ' + sentence
    }
  }

  if (pageContent.trim()) pages.value.push(pageContent.trim()) // Push the last page

  // Ensure even number of pages for desktop
  if (!isMobile.value && pages.value.length % 2 !== 0) {
    pages.value.push('')
  }
}

// **Computed Properties**
const totalPages = computed(() => isMobile.value ? pages.value.length : Math.ceil(pages.value.length / 2))
const leftPageText = computed(() => !isMobile.value && ((currentPage.value - 1) * 2) < pages.value.length ? pages.value[(currentPage.value - 1) * 2] : '')
const rightPageText = computed(() => !isMobile.value && ((currentPage.value - 1) * 2 + 1) < pages.value.length ? pages.value[(currentPage.value - 1) * 2 + 1] : '')
const currentText = computed(() => pages.value[currentPage.value - 1] || '')

// **Handle Page Click**
function handlePageClick(event) {
  const bookRect = event.currentTarget.getBoundingClientRect()
  const clickX = event.clientX - bookRect.left

  if (clickX > bookRect.width / 2) {
    flipNextPage()
  } else {
    flipPrevPage()
  }
}

// **Touch Event Handlers for Swipe Gesture**
let touchStartX = 0

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX
}

function handleTouchEnd(event) {
  const touchEndX = event.changedTouches[0].clientX
  const touchDiff = touchStartX - touchEndX

  if (touchDiff > 50) {
    // Swipe left to go to the next page
    isSwipingLeft.value = true
    audio.play() // Play the sound
    setTimeout(() => {
      flipNextPage()
      isSwipingLeft.value = false
    }, 600)
  } else if (touchDiff < -50) {
    // Swipe right to go to the previous page
    isSwipingRight.value = true
    audio.play() // Play the sound
    setTimeout(() => {
      flipPrevPage()
      isSwipingRight.value = false
    }, 600)
  }
}

// **Page Navigation**
function flipNextPage() {
  if (isMobile.value) {
    if (currentPage.value < totalPages.value && !isFlipping.value) {
      isFlipping.value = true
      setTimeout(() => {
        currentPage.value++
        isFlipping.value = false
      }, 600)
    }
  } else {
    if ((currentPage.value - 1) * 2 + 2 < pages.value.length && !isFlippingRight.value) {
      isFlippingRight.value = true
      setTimeout(() => {
        currentPage.value++
        isFlippingRight.value = false
      }, 600)
    }
  }
}

function flipPrevPage() {
  if (isMobile.value) {
    if (currentPage.value > 1 && !isFlipping.value) {
      isFlipping.value = true
      setTimeout(() => {
        currentPage.value--
        isFlipping.value = false
      }, 600)
    }
  } else {
    if (currentPage.value > 1 && !isFlippingLeft.value) {
      isFlippingLeft.value = true
      setTimeout(() => {
        currentPage.value--
        isFlippingLeft.value = false
      }, 600)
    }
  }
}
// **Audio Narration**
function startAudioNarration() {
  const utterance = new SpeechSynthesisUtterance(currentText.value)
  utterance.lang = 'fr-FR' // Set the language to French
  speechSynthesis.speak(utterance)
}
</script>
<style scoped>
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

.book-title {
  margin-bottom: 20px;
  font-size: 32px;
  font-weight: bold;
}

.book {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 900px;
  height: 600px;
  perspective: 1500px;
}

.page {
  width: 440px;
  height: 100%;
  background: #fff;
  border: 2px solid #ddd;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  transition: transform 0.6s ease-in-out;
  transform-style: preserve-3d;
}

.page.flipping {
  transition: transform 0.6s ease-in-out;
}

.page.left.flipping {
  transform-origin: right center;
  animation: flipLeft 0.6s forwards;
}

.page.right.flipping {
  transform-origin: left center;
  animation: flipRight 0.6s forwards;
}

.page.single {
  width: 90%;
  max-width: 500px;
  height: 100%;
  border-radius: 8px;
}

.page-content {
  padding: 25px;
  font-size: 20px;
  text-align: justify;
  width: 100%;
  height: 100%;
}

.pagination {
  font-size: 20px;
}

.controls {
  display: flex;
  align-items: center;

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

.nav-button.left {
  margin-right: auto 15px auto 0;
}

.nav-button.right {
  margin-left: auto 0 auto 15px;
}

/* **Responsive Styles** */
@media screen and (max-width: 768px) {
  .book {
    width: 100%;
    height: 80%;
  }

  .page {
    width: 90%;
    max-width: 500px;
  }
  /* Swipe Animations */
@keyframes swipeLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

@keyframes swipeRight {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
}
.page.swiping-left {
  animation: swipeLeft 0.6s forwards;
}

.page.swiping-right {
  animation: swipeRight 0.6s forwards;
}

}
/* Page-Turning Animations */
@keyframes flipLeft {
  0% {
    transform: rotateY(0);
  }
  100% {
    transform: rotateY(180deg);
  }
}

@keyframes flipRight {
  0% {
    transform: rotateY(0);
  }
  100% {
    transform: rotateY(-180deg);
  }
}

</style>
