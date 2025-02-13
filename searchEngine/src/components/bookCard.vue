<template>
  <div class="w-min min-w-40 flex flex-col hover:bg-orange-100/50 rounded-md cursor-pointer space-y-2" @click="goToBook(book)">
    <img v-if="book.image" :src="BACK_URL + '/' + book.image.replace(/\\/g, '/')" :alt="book.titre" class="w-full h-60 object-cover rounded-md" />
    <div class="flex-1 flex flex-col">
      <p class="text-sm font-bold text-gray-900 font-k2d break-word leading-5">{{ book.titre }}</p>
      <p class="text-neutral-500 text-xs"> {{ book.authors.map(author => author.name).join(', ') }}</p>
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

const goToBook = (book: any) => {
  booksStore.setSelectedBook(book);
  localStorage.setItem("selectedBook", JSON.stringify(book)); // Store in localStorage
  router.push({ name: 'book', params: { id: book.id } });
};

</script>