<template>
    <div class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-[450px]">
      <!-- Book Cover -->
      <img
        v-if="book.formats && book.formats['image/jpeg']"
        :src="book.formats['image/jpeg']"
        :alt="book.title"
        class="w-full h-48 object-cover"
      >

      <!-- Book Info -->
      <div class="p-4 flex-1 flex flex-col">
        <h2 class="text-lg font-bold text-gray-900 line-clamp-2">{{ book.title }}</h2>
        <h3 class="text-gray-600 text-sm">
          {{ book.authors.map(author => author.name).join(', ') }}
        </h3>
        <p class="text-gray-700 mt-2 text-sm line-clamp-3">
          {{ book.summaries.length ? book.summaries[0] : "No summary available." }}
        </p>
      </div>

      <!-- Button (Aligned to Bottom) -->
      <div class="p-4 text-center">
        <button class="bg-gray-500 text-white px-4 py-2 rounded-lg w-full">Consulter</button>
      </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  book: {
    title: string;
    authors: { name: string }[];
    summaries: string[];
    formats: { 'image/jpeg'?: string };
  };
}>();
</script>
