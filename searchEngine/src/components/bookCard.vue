<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-[450px]">
    <!-- Book Cover -->
    <img v-if="book.image" :src="BACK_URL + '/' + book.image.replace(/\\/g, '/')" :alt="book.titre"
      class="w-full h-48 object-cover" />


    <!-- Book Info -->
    <div class="p-4 flex-1 flex flex-col">
      <h2 class="text-lg font-bold text-gray-900 line-clamp-2">{{ book.titre }}</h2>
      <h3 class="text-gray-600 text-sm">
        {{ book.authors.map(author => author.name).join(', ') }}
      </h3>
      <p class="text-gray-700 mt-2 text-sm line-clamp-3">
        {{ book.summary || "No summary available." }}
      </p>
    </div>

    <!-- Button (Aligned to Bottom) -->
    <div class="p-4 text-center">
      <button class="bg-gray-500 text-white px-4 py-2 rounded-lg w-full" @click="goToBook(book)">Consulter</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBooksStore } from '@/stores/books';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const BACK_URL = import.meta.env.VITE_BACK_URL;
const booksStore = useBooksStore();
const router = useRouter();
const searchQuery = ref("");

const props = defineProps<{
  book: {
    id: number;
    titre: string;
    authors: { name: string }[];
    summary: string;
    image: string;
    content: string;

  };
}>();
// console.log(props.book.image);
const goToBook = (book: any) => {
  booksStore.setSelectedBook(book);
  localStorage.setItem("selectedBook", JSON.stringify(book)); // Store in localStorage
  router.push({ name: 'book', params: { id: book.id } });
};

</script>
