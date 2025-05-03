import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/css/tailwind.css';
import './assets/css/global.css'; // Ensure this line is present

createApp(App)
    .use(router)
    .mount('#app');
