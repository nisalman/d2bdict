<template>
  <div
      class="min-h-screen flex flex-col items-center justify-center p-4 transition-all"
      :style="{ backgroundColor: theme === 'light' ? '#ffffff' : '#121212', color: theme === 'light' ? '#000000' : '#ffffff' }"
  >
    <link href="https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <div class="flex-1 w-full max-w-3xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-primary mb-4 sm:mb-0">D2B Dictionary</h1>
        <div id="userSectionDesktop" class="hidden sm:flex items-center space-x-4">
          <span id="userNameDesktop" class="text-secondary font-medium" :class="{ hidden: !isLoggedIn }">{{ `Hi, ${currentUser}` }}</span>
          <button v-if="!isLoggedIn" @click="handleLogin" class="text-accent hover:text-purple-400 transition flex items-center button-icon">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14"></path></svg>
            Login
          </button>
          <button v-if="isLoggedIn" @click="handleLogout" class="text-red-500 hover:text-red-600 transition flex items-center button-icon">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7"></path></svg>
            Logout
          </button>
          <button @click="toggleTheme" class="p-2 rounded-full hover:bg-gray-700 light:hover:bg-gray-200 transition button-icon" aria-label="Toggle theme">
            <svg id="themeIcon" class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path v-if="theme === 'light'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
        </div>
      </div>
      <!-- User Info for Mobile -->
      <div id="userSectionMobile" class="sm:hidden mb-4">
        <span id="userNameMobile" class="text-secondary font-medium" :class="{ hidden: !isLoggedIn }">{{ `Hi, ${currentUser}` }}</span>
      </div>

      <!-- Search Bar and Translation Direction -->
      <div class="mb-6 sm:mb-8">
        <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <input
              type="text"
              v-model="searchInput"
              placeholder="Search for any word..."
              class="flex-1 p-3 sm:p-4 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 input-dark text-sm sm:text-base"
              aria-label="Search word"
          />
          <select
              v-model="translationDirection"
              class="p-3 sm:p-4 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 input-dark text-sm sm:text-base"
              aria-label="Translation direction"
          >
            <option value="german-to-english-bengali">German to English/Bengali</option>
            <option value="english-bengali-to-german">English/Bengali to German</option>
          </select>
        </div>
        <button
            @click="handleSearch"
            class="mt-3 w-full search-button text-white p-3 sm:p-4 rounded-lg transition flex items-center justify-center button-icon"
            aria-label="Search"
        >
          <span id="searchButtonText">{{ searchButtonText }}</span>
          <span id="spinner" class="spinner ml-2" :class="{ hidden: !isSearching }"></span>
        </button>
      </div>

      <!-- Now Showing Section -->
      <div class="mb-6 sm:mb-8">
        <h3 class="text-base sm:text-lg font-semibold text-primary flex items-center">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Now Showing:
        </h3>
        <p id="nowShowing" class="text-sm sm:text-base" :class="{ 'text-secondary italic': !result && !results.length, 'text-primary': result || results.length }">{{ nowShowing }}</p>
      </div>

      <!-- Error Message -->
      <p id="errorMessage" class="text-red-500 text-center font-medium mb-6 text-sm sm:text-base" :class="{ hidden: !errorMessage }" role="alert">{{ errorMessage }}</p>

      <!-- Search Results List -->
      <div v-if="results.length && !result" class="mb-6">
        <h3 class="text-lg font-semibold text-primary mb-4">Search Results</h3>
        <ul class="space-y-3">
          <li
              v-for="item in results"
              :key="item.german_word"
              @click="selectResult(item)"
              class="p-4 bg-section rounded-lg cursor-pointer hover:bg-gray-600 light:hover:bg-gray-200 transition"
          >
            <div class="flex justify-between items-center">
              <div>
                <p class="text-lg font-medium text-primary">{{ item.german_word }}</p>
                <p class="text-sm text-secondary">{{ item.english_meaning || item.bangla_meaning }}</p>
              </div>
              <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </div>
          </li>
        </ul>
      </div>

      <!-- Result Display -->
      <div v-if="result" id="resultDisplay" class="mt-6 fade-in">
        <button @click="backToResults" class="mb-4 text-accent hover:text-purple-400 flex items-center button-icon" aria-label="Back to results">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          Back to Results
        </button>
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 sm:mb-6">
          <div>
            <h2 id="resultWord" class="text-3xl sm:text-4xl font-bold text-primary mb-2">{{ result?.word }}</h2>
            <div class="flex items-center space-x-2">
              <span id="phoneticDisplay" class="text-secondary italic text-sm sm:text-base">{{ result?.phonetic || 'Not available' }}</span>
              <button id="phoneticButton" @click="playPhonetic" class="audio-button phonetic-button text-accent hover:text-purple-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7V5z"></path></svg>
              </button>
            </div>
          </div>
          <button v-if="isLoggedIn" id="favoriteButtonDesktop" @click="toggleFavorite" class="sm:block hidden text-yellow-400 hover:text-yellow-500 transition star mt-2 sm:mt-0" aria-label="Toggle favorite">
            <svg class="w-6 h-6 sm:w-8 sm:h-8" :class="{ 'fill-current': favorites.includes(result?.word) }" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3 .922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"></path></svg>
          </button>
        </div>
        <div class="space-y-6">
          <div>
            <p class="text-base sm:text-lg font-semibold text-primary">Translations</p>
            <ul id="translations" class="list-disc pl-5 mt-2 text-secondary text-sm sm:text-base">
              <li v-for="(translation, index) in result?.translations" :key="index" class="mt-1" v-html="translation"></li>
            </ul>
          </div>

          <!-- Synonyms Section (Hidden if empty or null) -->
          <div v-if="result?.synonyms?.length && result?.synonyms[0] !== 'null' && result?.synonyms[0] !== ''">
            <p class="text-base sm:text-lg font-semibold text-primary">Synonyms</p>
            <ul id="synonyms" class="list-disc pl-5 mt-2 text-accent text-sm sm:text-base">
              <li v-for="(synonym, index) in result?.synonyms" :key="index" class="mt-1" v-html="synonym"></li>
            </ul>
          </div>

          <!-- Antonyms Section (Hidden if empty or null) -->
          <div v-if="result?.antonyms?.length && result?.antonyms[0] !== 'null' && result?.antonyms[0] !== ''">
            <p class="text-base sm:text-lg font-semibold text-primary">Antonyms</p>
            <ul id="antonyms" class="list-disc pl-5 mt-2 text-secondary text-sm sm:text-base">
              <li v-for="(antonym, index) in result?.antonyms" :key="index" class="mt-1" v-html="antonym"></li>
            </ul>
          </div>

          <div>
            <p class="text-base sm:text-lg font-semibold text-primary">Example Sentences</p>
            <ul id="examples" class="list-disc pl-5 mt-2 text-secondary text-sm sm:text-base">
              <li v-for="(example, index) in result?.examples" :key="index" class="mt-1" v-html="example"></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation for Mobile -->
    <nav class="sm:hidden fixed bottom-0 left-0 right-0 bottom-nav flex justify-around items-center p-3 transition-all">
      <button v-if="isLoggedIn" @click="handleUserAction" class="text-accent hover:text-purple-400 transition button-icon" aria-label="User action">
        <svg id="userIconMobile" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      </button>
      <button v-if="!isLoggedIn" @click="handleLogin" class="text-accent hover:text-purple-400 transition button-icon" aria-label="Login">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14"></path></svg>
      </button>
      <button v-if="isLoggedIn" @click="handleLogout" class="text-red-500 hover:text-red-600 transition button-icon" aria-label="Logout">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7"></path></svg>
      </button>
      <button v-if="isLoggedIn && result" @click="toggleFavorite" class="text-yellow-400 hover:text-yellow-500 transition button-icon" aria-label="Toggle favorite">
        <svg id="favoriteIconMobile" class="w-6 h-6" :class="{ 'fill-current': favorites.includes(result?.word) }" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3 .922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"></path></svg>
      </button>
      <button @click="toggleTheme" class="text-accent hover:text-purple-400 transition button-icon" aria-label="Toggle theme">
        <svg id="themeIconMobile" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path v-if="theme === 'light'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </button>
    </nav>
  </div>
</template>

<script>
import { getTranslations } from '../services/api'; // Import the API service

export default {
  name: 'TranslationList',
  data() {
    return {
      theme: localStorage.getItem('theme') || 'dark',
      isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
      currentUser: localStorage.getItem('currentUser') || '',
      favorites: JSON.parse(localStorage.getItem('favorites')) || [],
      searchInput: '',
      translationDirection: 'german-to-english-bengali',
      isSearching: false,
      searchButtonText: 'Search',
      nowShowing: 'No word currently displayed',
      errorMessage: '',
      result: null,
      results: []
    };
  },
  mounted() {
    console.log('Component mounted, applying theme:', this.theme);
    this.updateTheme();
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', this.theme);
      console.log('Theme toggled to:', this.theme);
      this.updateTheme();
    },
    updateTheme() {
      const body = document.body;
      console.log('Updating theme on body:', this.theme);
      if (this.theme === 'light') {
        body.classList.add('light');
      } else {
        body.classList.remove('light');
      }
      console.log('Body classes after update:', body.classList.toString());
    },
    handleLogin() {
      this.currentUser = prompt('Enter your username:') || 'User';
      if (this.currentUser) {
        this.isLoggedIn = true;
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', this.currentUser);
      }
    },
    handleLogout() {
      this.isLoggedIn = false;
      this.currentUser = '';
      this.favorites = [];
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('favorites');
    },
    handleUserAction() {
      if (this.isLoggedIn) {
        alert(`Logged in as: ${this.currentUser}`);
      } else {
        this.handleLogin();
      }
    },
    toggleFavorite() {
      if (!this.isLoggedIn) return;
      const currentWord = this.result?.word;
      if (this.favorites.includes(currentWord)) {
        this.favorites = this.favorites.filter(word => word !== currentWord);
      } else {
        this.favorites.push(currentWord);
      }
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    },
    playPhonetic() {
      const phonetic = this.result?.phonetic || 'Not available';
      alert(`Playing phonetic: ${phonetic}`);
    },
    async handleSearch() {
      const searchInput = this.searchInput.trim();
      const direction = this.translationDirection === 'german-to-english-bengali' ? 'german' : 'english';

      // Reset previous states
      this.errorMessage = '';
      this.result = null;
      this.results = [];
      this.nowShowing = 'No word currently displayed';

      if (!searchInput) {
        this.errorMessage = 'Please enter a word to search';
        return;
      }

      // Show loading spinner
      this.isSearching = true;
      this.searchButtonText = 'Searching...';

      try {
        const response = await getTranslations(searchInput, direction);
        if (response.success && response.data.length > 0) {
          this.results = response.data; // Store all results
          this.nowShowing = `${response.data.length} result(s) found for "${searchInput}"`;
        } else {
          this.errorMessage = 'No words found in the dictionary';
        }
      } catch (error) {
        this.errorMessage = 'Failed to fetch translations. Please try again later.';
        console.error('Search error:', error);
      } finally {
        // Reset button
        this.isSearching = false;
        this.searchButtonText = 'Search';
      }
    },
    selectResult(item) {
      const direction = this.translationDirection === 'german-to-english-bengali' ? 'german' : 'english';
      // Map API response to the component's expected structure
      this.result = {
        word: item.german_word,
        phonetic: [
          item.bangla_phonetics,
          item.english_phonetics
        ],
        translations: [
          direction === 'german'
              ? `<span class="font-medium">English:</span> ${item.english_meaning}`
              : `<span class="font-medium">German:</span> ${item.german_word}`,
          direction === 'german'
              ? `<span class="font-medium bangla">Bengali:</span> ${item.bangla_meaning}`
              : `<span class="font-medium bangla">Bengali:</span> ${item.bangla_meaning}`
        ],
        synonyms: item.synonyms ? [item.synonyms] : [],
        antonyms: item.antonyms ? [item.antonyms] : [],
        examples: [
          `<span class="font-medium">German:</span> ${item.example_german}`,
          `<span class="font-medium">English:</span> ${item.example_english}`,
          `<span class="font-medium bangla">Bengali:</span> ${item.example_bangla}`
        ]
      };
      this.nowShowing = direction === 'german'
          ? `${item.german_word} - ${item.english_meaning}`
          : `${item.english_meaning || item.bangla_meaning} - ${item.german_word}`;
    },
    backToResults() {
      this.result = null;
      this.nowShowing = `${this.results.length} result(s) found for "${this.searchInput}"`;
    }
  }
};
</script>

<style scoped>
/* Component-specific styles */
.fade-in {
  animation: fadeIn 0.6s ease-in;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.spinner {
  border: 4px solid #4b5563;
  border-top: 4px solid #8b5cf6;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}
.light .spinner {
  border: 4px solid #d1d5db;
  border-top: 4px solid #8b5cf6;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.text-primary {
  color: #ffffff;
}
.light .text-primary {
  color: #000000;
}
.text-secondary {
  color: #d1d5db;
}
.light .text-secondary {
  color: #4b5563;
}
.text-accent {
  color: #8b5cf6;
}
.light .text-accent {
  color: #8b5cf6;
}
.border-accent {
  border-color: #8b5cf6;
}
.light .border-accent {
  border-color: #8b5cf6;
}
.bg-section {
  background-color: #1f2937;
}
.light .bg-section {
  background-color: #f3f4f6;
}
.button-icon {
  transition: transform 0.2s ease;
}
.button-icon:hover {
  transform: scale(1.1);
}
.bottom-nav {
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.3);
  background-color: #1f2937;
}
.light .bottom-nav {
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}
.audio-button:hover {
  color: #a78bfa;
}
.light .audio-button:hover {
  color: #a78bfa;
}
.star:hover {
  transform: scale(1.2);
}
.transition-all {
  transition: all 0.3s ease;
}
.phonetic-button svg {
  width: 24px;
  height: 24px;
}
.input-dark {
  background-color: #1f2937;
  color: #ffffff;
  border-color: #4b5563;
}
.light .input-dark {
  background-color: #ffffff;
  color: #000000;
  border-color: #d1d5db;
}
.search-button {
  border: 1px solid #4b5563;
  background-color: #1f2937;
  color: #ffffff;
}
.light .search-button {
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  color: #000000;
}
.search-button:hover {
  background-color: #a78bfa;
  color: #ffffff;
}
.light .search-button:hover {
  background-color: #a78bfa;
  color: #ffffff;
}
.bangla {
  font-family: 'Solaimalipi', 'Kalpurush', 'Siyam Rupali', sans-serif;
  font-size: 1.1rem;
}
</style>