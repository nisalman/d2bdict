<template>
  <div
      class="min-h-screen flex flex-col items-center p-4 transition-all"
      :style="{
      background: theme === 'light'
        ? '#f4f4f5'
        : 'radial-gradient(circle at top, #1e293b 0, #020617 55%, #000 100%)',
      color: theme === 'light' ? '#020617' : '#e5e7eb'
    }"
  >
    <!-- PAGE WRAPPER -->
    <div
        class="w-full max-w-5xl flex-1 flex flex-col space-y-6 sm:space-y-8 pb-16 sm:pb-0"
    >
      <!-- NAVBAR -->
      <header
          class="w-full flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 rounded-2xl bg-black/10 backdrop-blur-md border border-white/5 shadow-lg"
          :class="{ 'bg-white/80 border-gray-200 shadow-md': theme === 'light' }"
      >
        <div class="flex items-center space-x-3">
          <div
              class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-500 shadow-md"
          >
            <span class="text-xs sm:text-sm font-bold text-white">D2B</span>
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight">
              D2B Dictionary
            </h1>
            <p class="text-xs sm:text-sm text-secondary">
              German ⇄ English &amp; Bangla, made easier.
            </p>
          </div>
        </div>

        <div class="hidden sm:flex items-center space-x-3">
          <span
              v-if="isLoggedIn"
              class="px-3 py-1 rounded-full text-xs sm:text-sm bg-purple-500/10 text-purple-300 border border-purple-500/40"
              :class="{
              'bg-purple-100 text-purple-700 border-purple-200': theme === 'light'
            }"
          >
            Hi, {{ currentUser }}
          </span>

          <button
              v-if="!isLoggedIn"
              @click="handleLogin"
              class="px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium flex items-center space-x-1
                   bg-purple-500 hover:bg-purple-600 text-white shadow-md transition button-icon"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14" />
            </svg>
            <span>Login</span>
          </button>

          <button
              v-else
              @click="handleLogout"
              class="px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium flex items-center space-x-1
                   bg-red-500/10 text-red-400 border border-red-500/40 hover:bg-red-500/20 transition button-icon"
              :class="{
              'bg-red-100 text-red-700 border-red-200 hover:bg-red-200': theme === 'light'
            }"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7" />
            </svg>
            <span>Logout</span>
          </button>

          <button
              @click="toggleTheme"
              class="p-2 rounded-full hover:bg-white/10 transition button-icon flex items-center justify-center"
              :class="{ 'hover:bg-gray-100 text-gray-700': theme === 'light' }"
              aria-label="Toggle theme"
          >
            <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                  v-if="theme === 'light'"
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
              <path
                  v-else
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </button>
        </div>
      </header>

      <!-- MOBILE USER LINE -->
      <div class="sm:hidden flex items-center justify-between text-xs mb-1">
        <span v-if="isLoggedIn" class="text-secondary">
          Hi, {{ currentUser }}
        </span>
        <span class="text-secondary">
          Favourites: <span class="font-semibold">{{ favorites.length }}</span>
        </span>
      </div>

      <!-- MAIN CONTENT GRID -->
      <main class="flex-1 flex flex-col gap-4 sm:gap-6">
        <!-- SEARCH + STATUS + RESULTS -->
        <section class="space-y-4 sm:space-y-6">
          <!-- SEARCH CARD -->
          <div
              class="rounded-2xl p-4 sm:p-5 bg-black/30 border border-white/10 shadow-xl backdrop-blur-md"
              :class="{ 'bg-white shadow-md border-gray-200': theme === 'light' }"
          >
            <div class="flex items-center justify-between mb-3">
              <div>
                <h2 class="text-sm font-semibold uppercase tracking-wide text-secondary">
                  Search
                </h2>
                <p class="text-xs text-secondary">
                  Start typing to get instant suggestions.
                </p>
              </div>
              <span
                  class="text-[10px] px-2 py-1 rounded-full bg-black/40 text-secondary"
                  :class="{ 'bg-gray-100 text-gray-600': theme === 'light' }"
              >
          Favorites: {{ favorites.length }}
        </span>
            </div>

            <div class="flex flex-col space-y-3">
              <div class="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                <div class="relative flex-1">
                  <input
                      type="text"
                      v-model="searchInput"
                      @input="handleInput"
                      @keyup.enter="handleSearch"
                      placeholder="Search for any word..."
                      class="w-full pl-9 pr-3 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base
                     border border-accent/40 input-dark focus:outline-none focus:ring-2
                     focus:ring-purple-500/70 focus:border-purple-500/70"
                      aria-label="Search word"
                  />
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-accent">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0 6 6 0 01-12 0z"
                />
              </svg>
            </span>

                  <!-- AUTOCOMPLETE -->
                  <ul
                      v-if="suggestions.length"
                      class="absolute z-20 mt-2 w-full rounded-xl bg-section border border-white/10 shadow-lg max-h-60 overflow-auto"
                      :class="{ 'bg-white border-gray-200': theme === 'light' }"
                  >
                    <li
                        v-for="item in suggestions"
                        :key="item.id || item.german_word || item.english_meaning"
                        @click="useSuggestion(item)"
                        class="px-3 py-2 text-sm cursor-pointer flex justify-between items-center
                       hover:bg-white/10 light:hover:bg-gray-100 transition"
                    >
                      <div>
                        <p class="font-medium text-primary">{{ item.german_word }}</p>
                        <p class="text-xs text-secondary">
                          {{ item.english_meaning || item.bangla_meaning }}
                        </p>
                      </div>
                      <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </li>
                  </ul>
                </div>

                <select
                    v-model="translationDirection"
                    class="w-full sm:w-56 px-3 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium
                   border border-accent/40 input-dark focus:outline-none focus:ring-2
                   focus:ring-purple-500/70 focus:border-purple-500/70"
                    aria-label="Translation direction"
                >
                  <option value="german-to-english-bengali">German → English/Bengali</option>
                  <option value="english-bengali-to-german">English/Bengali → German</option>
                </select>
              </div>

              <button
                  @click="handleSearch"
                  class="w-full mt-1 search-button text-white py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold
                 flex items-center justify-center space-x-2 button-icon"
                  aria-label="Search"
              >
                <span>{{ searchButtonText }}</span>
                <span v-if="isSearching" class="spinner ml-2"></span>
              </button>
            </div>
          </div>

          <!-- STATUS / ERROR -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z"
                  />
                </svg>
                <h3 class="text-sm font-semibold text-primary">Now Showing</h3>
              </div>
              <span class="text-xs text-secondary">
          {{ results.length }} result(s)
        </span>
            </div>
            <p
                class="text-sm sm:text-base"
                :class="{
          'text-secondary italic': !result && !results.length,
          'text-primary': result || results.length
        }"
            >
              {{ nowShowing }}
            </p>

            <p
                v-if="errorMessage"
                class="text-xs sm:text-sm text-red-400 font-medium mt-1"
                role="alert"
            >
              {{ errorMessage }}
            </p>
          </div>

          <!-- SEARCH RESULTS LIST -->
          <div v-if="results.length && !result" class="space-y-3">
            <h3 class="text-sm sm:text-base font-semibold text-primary">
              Tap a word to see full details
            </h3>
            <ul class="space-y-3">
              <li
                  v-for="item in results"
                  :key="item.id || item.german_word || item.english_meaning"
                  @click="selectResult(item)"
                  class="p-3 sm:p-4 rounded-2xl bg-section border border-white/5 cursor-pointer
                 hover:bg-white/5 transition flex justify-between items-center"
                  :class="{ 'bg-white border-gray-200 hover:bg-gray-50': theme === 'light' }"
              >
                <div>
                  <p class="text-base sm:text-lg font-semibold text-primary">
                    {{ item.german_word }}
                  </p>
                  <p class="text-xs sm:text-sm text-secondary">
                    {{ item.english_meaning || item.bangla_meaning }}
                  </p>
                </div>
                <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </li>
            </ul>
          </div>
        </section>

        <!-- DETAILS OR PLACEHOLDER, ALWAYS BELOW SEARCH/RESULTS -->
        <section v-if="result">
          <div
              id="resultDisplay"
              class="fade-in rounded-2xl p-4 sm:p-5 bg-black/30 border border-white/10 shadow-xl backdrop-blur-md flex flex-col"
              :class="{ 'bg-white shadow-md border-gray-200': theme === 'light' }"
          >
            <div class="flex items-start justify-between mb-4">
              <div>
                <h2 id="resultWord" class="text-2xl sm:text-3xl font-bold text-primary mb-1">
                  {{ result?.word }}
                </h2>
                <div class="flex items-center space-x-2 text-xs sm:text-sm text-secondary">
            <span id="phoneticDisplay" class="italic">
              {{ result?.phonetic || 'Phonetic not available' }}
            </span>
                  <button
                      id="phoneticButton"
                      @click="playPhonetic"
                      class="audio-button phonetic-button text-accent hover:text-purple-400"
                      aria-label="Play phonetic"
                  >
                    <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 5l7 7-7 7V5z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <button
                    v-if="isLoggedIn"
                    id="favoriteButtonDesktop"
                    @click="toggleFavorite"
                    class="hidden sm:inline-flex text-yellow-400 hover:text-yellow-500 transition star"
                    aria-label="Toggle favorite"
                >
                  <svg
                      class="w-7 h-7"
                      :class="{ 'fill-current': favorites.includes(result?.word) }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" />
                  </svg>
                </button>

                <button
                    @click="backToResults"
                    class="px-2.5 py-1.5 rounded-full border border-white/20 text-xs sm:text-sm text-secondary
                   hover:bg-white/10 button-icon"
                    :class="{
              'border-gray-200 hover:bg-gray-100 hover:text-gray-800': theme === 'light'
            }"
                >
                  Back
                </button>
              </div>
            </div>

            <div class="space-y-4 text-sm sm:text-base overflow-auto">
              <div>
                <p class="font-semibold text-primary mb-1">Translations</p>
                <ul id="translations" class="list-disc pl-5 text-secondary space-y-1">
                  <li
                      v-for="(translation, index) in result?.translations"
                      :key="index"
                      v-html="translation"
                  />
                </ul>
              </div>

              <div
                  v-if="result?.synonyms?.length && result?.synonyms[0] !== 'null' && result?.synonyms[0] !== ''"
              >
                <p class="font-semibold text-primary mb-1">Synonyms</p>
                <ul id="synonyms" class="flex flex-wrap gap-1.5 text-xs sm:text-sm">
                  <li
                      v-for="(synonym, index) in result?.synonyms"
                      :key="index"
                      class="px-2 py-1 rounded-full bg-purple-500/10 text-accent"
                      v-html="synonym"
                  />
                </ul>
              </div>

              <div
                  v-if="result?.antonyms?.length && result?.antonyms[0] !== 'null' && result?.antonyms[0] !== ''"
              >
                <p class="font-semibold text-primary mb-1">Antonyms</p>
                <ul id="antonyms" class="flex flex-wrap gap-1.5 text-xs sm:text-sm">
                  <li
                      v-for="(antonym, index) in result?.antonyms"
                      :key="index"
                      class="px-2 py-1 rounded-full bg-slate-500/10 text-secondary"
                      v-html="antonym"
                  />
                </ul>
              </div>

              <div>
                <p class="font-semibold text-primary mb-1">Example Sentences</p>
                <ul id="examples" class="list-disc pl-5 text-secondary space-y-1">
                  <li
                      v-for="(example, index) in result?.examples"
                      :key="index"
                      v-html="example"
                  />
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- PLACEHOLDER WHEN NO RESULT SELECTED -->
        <section v-else>
          <div
              class="w-full text-center text-secondary text-xs sm:text-sm px-4 py-6 rounded-2xl border border-dashed border-white/10 bg-black/20"
              :class="{ 'border-gray-300 bg-white/60': theme === 'light' }"
          >
            <p class="font-medium mb-1">No word selected yet</p>
            <p>Search and pick a result above to see full details here.</p>
          </div>
        </section>
      </main>


      <!-- TOAST POPUP -->
      <transition name="toast">
        <div
            v-if="toastMessage"
            class="fixed left-1/2 -translate-x-1/2 bottom-20 z-50 max-w-xs w-[90%] px-4 py-3 rounded-xl text-xs sm:text-sm text-white shadow-lg bg-black/80 backdrop-blur"
            :class="{ 'bg-gray-900/90': theme !== 'light', 'bg-gray-800': theme === 'light' }"
        >
          {{ toastMessage }}
        </div>
      </transition>

      <!-- MOBILE BOTTOM NAV -->
      <nav
          class="sm:hidden fixed bottom-0 left-0 right-0 bottom-nav flex justify-around items-center p-3 transition-all"
      >
        <button
            v-if="isLoggedIn"
            @click="handleUserAction"
            class="text-accent hover:text-purple-400 transition button-icon"
            aria-label="User action"
        >
          <svg id="userIconMobile" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
        <button
            v-if="!isLoggedIn"
            @click="handleLogin"
            class="text-accent hover:text-purple-400 transition button-icon"
            aria-label="Login"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14" />
          </svg>
        </button>
        <button
            v-if="isLoggedIn"
            @click="handleLogout"
            class="text-red-500 hover:text-red-600 transition button-icon"
            aria-label="Logout"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7"></path>
          </svg>
        </button>
        <button
            v-if="isLoggedIn && result"
            @click="toggleFavorite"
            class="text-yellow-400 hover:text-yellow-500 transition button-icon"
            aria-label="Toggle favorite"
        >
          <svg
              id="favoriteIconMobile"
              class="w-6 h-6"
              :class="{ 'fill-current': favorites.includes(result?.word) }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" />
          </svg>
        </button>
        <button
            @click="toggleTheme"
            class="text-accent hover:text-purple-400 transition button-icon"
            aria-label="Toggle theme"
        >
          <svg id="themeIconMobile" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                v-if="theme === 'light'"
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
            <path
                v-else
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </button>
      </nav>
    </div>
    <!-- Desktop copyright footer -->
    <footer
        class="hidden sm:flex fixed bottom-3 left-0 right-0 justify-center z-40 pointer-events-none"
    >
      <div
          class="px-4 py-1.5 rounded-full text-[11px] sm:text-xs text-secondary bg-black/40 border border-white/10 backdrop-blur pointer-events-auto"
          :class="{
          'bg-white/90 border-gray-200 text-gray-600': theme === 'light'
        }"
      >
        Powered by
        <span class="font-medium">© 2025 D2B Dictionary. All rights reserved. <strong>Noor Islam Salman</strong> </span>
        <span class="mx-1">·</span>
        <a
            href="https://nisalman.com"
            target="_blank"
            rel="noopener"
            class="underline underline-offset-2"
        >
          nisalman.com
        </a>
      </div>
    </footer>


</div>
</template>

<script>
import { getTranslations } from '../services/api';

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
      results: [],
      suggestions: [],
      toastMessage: '' // for small popup
    };
  },
  mounted() {
    this.updateTheme();
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', this.theme);
      this.updateTheme();
    },
    updateTheme() {
      const body = document.body;
      if (this.theme === 'light') {
        body.classList.add('light');
      } else {
        body.classList.remove('light');
      }
    },
    showToast(message) {
      this.toastMessage = message;
      setTimeout(() => {
        this.toastMessage = '';
      }, 2500);
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
      if (!this.isLoggedIn || !this.result) return;
      const currentWord = this.result.word;
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
      const direction =
          this.translationDirection === 'german-to-english-bengali'
              ? 'german'
              : 'english';

      this.errorMessage = '';
      this.result = null;
      this.results = [];
      this.nowShowing = 'No word currently displayed';

      if (!searchInput) {
        this.errorMessage = 'Please enter a word to search';
        return;
      }

      this.isSearching = true;
      this.searchButtonText = 'Searching...';

      try {
        const raw = await getTranslations(searchInput, direction);
        const results = Array.isArray(raw) ? raw : raw.data || [];

        if (results.length > 0) {
          this.results = results;
          this.nowShowing = `${results.length} result(s) found for "${searchInput}"`;
        } else {
          this.nowShowing = 'No word currently displayed';
          this.errorMessage = '';
          this.showToast(
              "Word isn't available in the database. It will be updated soon."
          );
        }
      } catch (error) {
        this.errorMessage = '';
        this.showToast('Unable to reach the server. Please try again.');
        console.error('Search error:', error);
      } finally {
        this.isSearching = false;
        this.searchButtonText = 'Search';
      }
    },

    async handleInput() {
      const term = this.searchInput.trim();
      const direction =
          this.translationDirection === 'german-to-english-bengali'
              ? 'german'
              : 'english';

      if (term.length < 2) {
        this.suggestions = [];
        return;
      }

      try {
        const raw = await getTranslations(term, direction);
        const results = Array.isArray(raw) ? raw : raw.data || [];
        this.suggestions = results.slice(0, 5);
      } catch (error) {
        console.error('Autocomplete error:', error);
        this.suggestions = [];
      }
    },
    useSuggestion(item) {
      this.searchInput = item.german_word || item.english_meaning || '';
      this.suggestions = [];
      this.handleSearch();
    },

    selectResult(item) {
      const direction =
          this.translationDirection === 'german-to-english-bengali'
              ? 'german'
              : 'english';
      const isGerman = direction === 'german';

      this.result = {
        word: isGerman
            ? item.german_word
            : item.english_meaning || item.bangla_meaning,
        phonetic:
            item.english_phonetics ||
            item.bangla_phonetics ||
            '',
        translations: [
          isGerman
              ? `<span class="font-medium">English:</span> ${item.english_meaning}`
              : `<span class="font-medium">German:</span> ${item.german_word}`,
          `<span class="font-medium bangla">Bengali:</span> ${item.bangla_meaning}`
        ],
        synonyms: item.synonyms ? [item.synonyms] : [],
        antonyms: item.antonyms ? [item.antonyms] : [],
        examples: [
          `<span class="font-medium">German:</span> ${item.example_german}`,
          `<span class="font-medium">English:</span> ${item.example_english}`,
          `<span class="font-medium bangla">Bengali:</span> ${item.example_bangla}`
        ]
      };

      this.nowShowing = isGerman
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
.fade-in {
  animation: fadeIn 0.6s ease-in;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.spinner {
  border: 3px solid #4b5563;
  border-top: 3px solid #8b5cf6;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}
.light .spinner {
  border: 3px solid #d1d5db;
  border-top: 3px solid #8b5cf6;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.text-primary {
  color: #f9fafb;
}
.light .text-primary {
  color: #020617;
}
.text-secondary {
  color: #9ca3af;
}
.light .text-secondary {
  color: #4b5563;
}
.text-accent {
  color: #a855f7;
}
.light .text-accent {
  color: #7c3aed;
}
.border-accent {
  border-color: #8b5cf6;
}
.bg-section {
  background-color: #111827;
}
.light .bg-section {
  background-color: #f9fafb;
}
.button-icon {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.button-icon:hover {
  transform: translateY(-1px) scale(1.03);
}
.bottom-nav {
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
  background-color: #020617;
}
.light .bottom-nav {
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}
.search-button {
  border: 1px solid #4b5563;
  background: linear-gradient(to right, #7c3aed, #4f46e5);
  color: #ffffff;
}
.light .search-button {
  border: 1px solid #c4b5fd;
}
.search-button:hover {
  filter: brightness(1.08);
}
.bangla {
  font-family: 'Solaimalipi', 'Kalpurush', 'Siyam Rupali', sans-serif;
}
.input-dark {
  background-color: #020617;
  color: #e5e7eb;
  border-color: #374151;
}
.light .input-dark {
  background-color: #ffffff;
  color: #111827;
  border-color: #d1d5db;
}
</style>
