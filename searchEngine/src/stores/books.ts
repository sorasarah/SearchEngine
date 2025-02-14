import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useBooksStore = defineStore('books', () => {
  const books = ref<any[]>([]);
  const recommendations = ref<any[]>([]);
  const selectedBook = ref<any | null>(null);
  const suggestion = ref<string>('');

  function fetchBooks() {
    axios.get(import.meta.env.VITE_API_URL + '/books/')
      .then((response) => {
        books.value = response.data
        console.log('Books fetched:', books.value);

      })
      .catch((error) => {
        console.error('Error fetching books:', error);
      });
  }

  async function get (id: number) {
    await axios.get(import.meta.env.VITE_API_URL + '/books/' + id)
      .then((response) => {
        selectedBook.value = response.data
        console.log('Book fetched:', selectedBook.value);
      })
      .catch((error) => {
        console.error('Error fetching book:', error);
      });
  }

  async function search(term: string) {
    if (!term) {
      return;
    }
    await axios.get(import.meta.env.VITE_API_URL + '/books/search?search=' + term)
      .then((response) => {
        books.value = response.data.books
        recommendations.value = response.data.recommendations
        suggestion.value = response.data.suggestion
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
      });
  }

  function setSelectedBook(book: any) {
    selectedBook.value = book;
  }

  return { 
    books, 
    selectedBook,
    recommendations,
    suggestion,
    fetchBooks, 
    setSelectedBook,
    search,
    get
  };
});
