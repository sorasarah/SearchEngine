<template>
  <div class="flex flex-col items-center lg:justify-center h-screen space-y-4">
    <div class="flex flex-col sm:flex-row items-center space-x-2">
      <h1 class="text-3xl font-bold font-k2d">{{ book?.titre || 'Titre Inconnu' }}</h1>
      <div @click="toggleSpeech" class="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full cursor-pointer">
        <Icon :icon="isSpeaking ? 'akar-icons:pause' : 'akar-icons:play'" />
      </div>
    </div>

    <div class="w-full sm:max-w-240 book mx-2" @click="handlePageClick" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
      <!-- Responsive Page Display -->
      <div v-if="isMobile" class="h-140 page single rounded-md sm:p-4" :class="{ flipping: isFlipping, 'swiping-left': isSwipingLeft, 'swiping-right': isSwipingRight }">
        <p>{{ currentText }}</p>
      </div>

      <div v-else class="max-w-full w-full h-140 flex border border-neutral-300 rounded-md shadow-xl">
        <!-- Desktop: Left Page (Only Display if Not First Page) -->
        <div v-if="leftPageText" class="page left flex-1 rounded-l-md p-4" :class="{ flipping: isFlippingLeft }">
          <p>{{ leftPageText }}</p>
        </div>

        <div class="w-10 bg-linear-to-r from-neutral-100/20 via-neutral-300 to-neutral-100/20"></div>

        <!-- Desktop: Right Page -->
        <div v-if="rightPageText" class="page right flex-1 rounded-r-md p-4" :class="{ flipping: isFlippingRight }">
          <p>{{ rightPageText }}</p>
        </div>
      </div>
    </div>

    <div class="flex flex-col items-center justify-center">
      <div v-if="isMobile" class="grid grid-cols-3 items-center space-x-4">
        <div class="justify-self-end flex items-center space-x-4">
          <button @click="flipPrevPage" v-if="currentPage > 1" class="nav-button left">
            <Icon icon="akar-icons:chevron-left" />
          </button>
        </div>
        <p class="text-lg"><span class="font-bold">{{ currentPage }}</span> sur {{ totalPages }} </p>
        <div class="justify-self-start flex items-center space-x-4">
          <button @click="flipNextPage" v-if="currentPage < totalPages" class="nav-button right ml-5">
            <Icon icon="akar-icons:chevron-right" />
          </button>
        </div>
      </div>
      <div v-else class="grid grid-cols-3 items-center space-x-4">
        <div class="justify-self-end flex items-center space-x-4">
          <button @click="flipPrevPage" v-if="currentPage > 1" class="text-xl rounded-full shadow-md p-2">
            <Icon icon="akar-icons:chevron-left" />
          </button>
        </div>
        <p class="text-lg"><span class="font-bold">{{ currentPage }} - {{ currentPage + 1 }}</span> sur {{ totalPages }} </p>
        <div class="justify-self-start flex items-center space-x-4">
          <button @click="flipNextPage" v-if="currentPage < totalPages" class="text-xl rounded-full shadow-md p-2">
            <Icon icon="akar-icons:chevron-right" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useBooksStore } from '@/stores/books'
import { Icon } from '@iconify/vue'
import pageFlipSound from '@/assets/sounds/turnpage.mp3'

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
var speech = new SpeechSynthesisUtterance();
var voices = window.speechSynthesis.getVoices();
const isSpeaking = ref(false);
let currentCharIndex = 0;

const audio = new Audio(pageFlipSound)

const speak = (text, startIndex = 0) => {
  speech.voice = voices[0];
  speech.volume = 1;
  speech.rate = .8;
  speech.pitch = 2;
  speech.text = text.slice(startIndex);
  speech.lang = 'en-US';
  speech.onboundary = (event) => {
    if (event.name === 'word') {
      currentCharIndex = event.charIndex + startIndex;
    }
  };
  speechSynthesis.speak(speech);
  // console.log("je lis le texte", speech.text);
}

const toggleSpeech = () => {
  if (isSpeaking.value) {
    window.speechSynthesis.cancel();
    isSpeaking.value = false;
  } else {
    const textToRead = isMobile.value ? currentText.value : `${leftPageText.value} ${rightPageText.value}`;
    speak(textToRead, currentCharIndex);
    isSpeaking.value = true;
  }
}

speech.onend = () => {
  isSpeaking.value = false;
}

// Function to update layout when screen resizes
const updateLayout = () => {
  const previousPage = currentPage.value // Store the current page
  isMobile.value = window.innerWidth <= 768
  charsPerPage.value = isMobile.value ? 1200 : 1000 // Adjust character limit dynamically
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
    // from \r\n to break line
    // sentence = sentence.replace(/(\r\n|\n|\r)/gm, "<br>");
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
      audio.play() // Play the sound
      setTimeout(() => {
        currentPage.value++
        isFlipping.value = false
        if (isSpeaking.value) {
          speak(currentText.value);
        }
      }, 600)
    }
  } else {
    if ((currentPage.value - 1) * 2 + 2 < pages.value.length && !isFlippingRight.value) {
      isFlippingRight.value = true
      audio.play() // Play the sound
      setTimeout(() => {
        currentPage.value++
        isFlippingRight.value = false
        if (isSpeaking.value) {
          speak(`${leftPageText.value} ${rightPageText.value}`);
        }
      }, 600)
    }
  }
}

function flipPrevPage() {
  if (isMobile.value) {
    if (currentPage.value > 1 && !isFlipping.value) {
      isFlipping.value = true
      audio.play() // Play the sound
      setTimeout(() => {
        currentPage.value--
        isFlipping.value = false
        if (isSpeaking.value) {
          speak(currentText.value);
        }
      }, 600)
    }
  } else {
    if (currentPage.value > 1 && !isFlippingLeft.value) {
      isFlippingLeft.value = true
      audio.play() // Play the sound
      setTimeout(() => {
        currentPage.value--
        isFlippingLeft.value = false
        if (isSpeaking.value) {
          speak(`${leftPageText.value} ${rightPageText.value}`);
        }
      }, 600)
    }
  }
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
  perspective: 1500px;
}

.page {
  background: #fff;
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

.page-content {
  padding: 25px;
  font-size: 20px;
  text-align: justify;
  width: 100%;
  height: 100%;
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
