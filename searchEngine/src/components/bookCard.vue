<template>
    <div class="max-w-sm rounded overflow-hidden shadow-lg">
        <img :src="book.formats['image/jpeg']" :alt="book.title" class="w-full">
        <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2">
                <h2>{{ book.title }}</h2>
                <h3> {{ book.authors.map(author => author.name).join(', ') }}</h3>
            </div>
            <p class="text-gray-700 text-base">
                {{  book.summaries.map(summary => summary.content).join(', ') }}
            </p>
        </div>
        <div class="px-6 pt-4 pb-2">
            <span
                class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#photography</span>
            <span
                class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>
            <span
                class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { Icon } from "@iconify/vue";
    import { ref } from 'vue';
    import { defineProps } from '@/stores/books';

    const props = defineProps<{
  book: {
    title: string;
    authors: { name: string }[];
    summaries: string;
    formats: string;
  };
}>()

</script>