<template>
  <div class="container mx-auto p-6">
    <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">Add New Translation</h1>

    <!-- Translation Form -->
    <form @submit.prevent="submitTranslation">
      <div class="mb-4">
        <label for="german_word" class="block text-xl font-semibold text-gray-700">German Word:</label>
        <input
            v-model="newTranslation.german_word"
            id="german_word"
            type="text"
            class="p-2 w-full border rounded-md"
            required
        />
      </div>

      <div class="mb-4">
        <label for="english_meaning" class="block text-xl font-semibold text-gray-700">English Meaning:</label>
        <input
            v-model="newTranslation.english_meaning"
            id="english_meaning"
            type="text"
            class="p-2 w-full border rounded-md"
            required
        />
      </div>

      <div class="mb-4">
        <label for="bangla_meaning" class="block text-xl font-semibold text-gray-700">Bangla Meaning:</label>
        <input
            v-model="newTranslation.bangla_meaning"
            id="bangla_meaning"
            type="text"
            class="p-2 w-full border rounded-md"
            required
        />
      </div>

      <div class="mb-4">
        <label for="example_german" class="block text-xl font-semibold text-gray-700">Example (German):</label>
        <textarea
            v-model="newTranslation.example_german"
            id="example_german"
            class="p-2 w-full border rounded-md"
        ></textarea>
      </div>

      <div class="mb-4">
        <label for="example_english" class="block text-xl font-semibold text-gray-700">Example (English):</label>
        <textarea
            v-model="newTranslation.example_english"
            id="example_english"
            class="p-2 w-full border rounded-md"
        ></textarea>
      </div>

      <div class="mb-4">
        <label for="example_bangla" class="block text-xl font-semibold text-gray-700">Example (Bangla):</label>
        <textarea
            v-model="newTranslation.example_bangla"
            id="example_bangla"
            class="p-2 w-full border rounded-md"
        ></textarea>
      </div>

      <button
          type="submit"
          class="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Add Translation
      </button>
    </form>
  </div>
</template>

<script>
import { postTranslation } from '../services/api';

export default {
  data() {
    return {
      newTranslation: {
        german_word: '',
        english_meaning: '',
        bangla_meaning: '',
        example_german: '',
        example_english: '',
        example_bangla: '',
      }
    };
  },
  methods: {
    // Method to submit the form and post the new translation
    async submitTranslation() {
      try {
        // Send the POST request with the new translation data
        const response = await postTranslation(this.newTranslation);

        // Handle the successful response
        console.log('Translation Added:', response);  // Log the response for debugging
        alert('Translation added successfully!');

        // Reset the form fields
        this.newTranslation = {};

        // Optionally, redirect to the main page after submission
        this.$router.push('/');  // Redirect to the home page
      } catch (error) {
        console.error('Error posting translation', error);
        alert('Error adding translation');
      }
    }
  }
};
</script>

<style scoped>
/* Apply Solaimalipi font to Bangla text */
.bangla {
  font-family: 'Solaimalipi', sans-serif;
  font-size: 1.1rem;
  color: #333;
}
</style>
