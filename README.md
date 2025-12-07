# D2B Dictionary

German ⇄ English & Bangla dictionary with a clean, responsive UI, autocomplete, and a Laravel-powered API.

> **Powered by [Noor Islam Salman](https://nisalman.com)**

---

## ✨ Features

- 🔎 **Smart search**
  - Search German → English/Bangla or English/Bangla → German
  - Instant autocomplete suggestions as you type
  - Enter key or button click to search

- 📖 **Rich word details**
  - German word, phonetics, translations
  - Bangla + English example sentences
  - Synonyms and antonyms (when available)

- ⭐ **Favorites**
  - Mark/unmark words as favorites
  - Favorites stored in `localStorage` per browser

- 🌙 **Dark / Light theme**
  - Smooth theme toggle
  - Theme preference saved in `localStorage`

- 📱 **Responsive layout**
  - Desktop: search + results + detail view
  - Mobile: search & results on top, details below
  - Fixed mobile bottom navigation

- 🔔 **Nice UX touches**
  - Loading spinner on search
  - Toast popup when a word isn’t in the database  
    > “Word isn’t available in the database. It will be updated soon.”

---

## 🖼 Screenshots

Create a `screenshots/` folder in the project root and drop your images there, then update these filenames if needed.

### Dark theme – Home & Search

![Home Dark](screenshots/home-dark.png)

### Word Details View

![Word Details](screenshots/details-dark.png)

### Mobile Layout

![Mobile View](screenshots/mobile-view.png)

---

## 🛠 Tech Stack

**Frontend**

- [Vue 3](https://vuejs.org/) (Options API)
- [Vue Router](https://router.vuejs.org/) (if used in project)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/) for API calls

**Backend**

- [Laravel](https://laravel.com/) API  
  (Example production URL: `https://apid2b.nisalman.com/api`)

---

## 📁 Project Structure (frontend)

```txt
d2bdict/
├─ public/
├─ src/
│  ├─ assets/
│  ├─ components/
│  │  └─ TranslationList.vue   # Main dictionary UI
│  │  └─ AddTranslation.vue    # Admin / add word form (optional)
│  ├─ router/
│  │  └─ index.js
│  ├─ services/
│  │  └─ api.js                # Axios configuration + API helpers
│  ├─ App.vue
│  ├─ main.js
│  ├─ tailwind.css
│  └─ global.css
├─ screenshots/
│  ├─ home-dark.png
│  ├─ details-dark.png
│  └─ mobile-view.png
├─ package.json
├─ vue.config.js
└─ README.md
