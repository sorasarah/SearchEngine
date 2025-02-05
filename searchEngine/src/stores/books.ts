import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useBooksStore = defineStore('books', () => {
  const books = ref("")

  function fetchBooks() {
    axios.get('https://gutendex.com/books/')
      .then((response) => {
        books.value = response.data.results.filter((item: any) => item.languages.includes('en'))
      })
      .catch((error) => {
        console.error('Error fetching books:', error)
      })
  }

  return { books, fetchBooks }
})
