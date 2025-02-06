import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useBooksStore = defineStore('books', () => {
  const books = ref<any[]>([]);
  const selectedBook = ref<any | null>(null);

  function fetchBooks() {
    axios.get('https://gutendex.com/books/')
      .then((response) => {
        books.value = response.data.results.filter((item: any) => item.languages.includes('en'));
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
      });
  }

  function setSelectedBook(book: any) {
    selectedBook.value = book;
  }

  return { books, fetchBooks, selectedBook, setSelectedBook };
});