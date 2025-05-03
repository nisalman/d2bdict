import { createRouter, createWebHistory } from 'vue-router';
import TranslationList from '../components/TranslationList.vue';
import AddTranslation from '../components/AddTranslation.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: TranslationList, // The main dictionary page (Translation List)
    },
    {
        path: '/add-translation',
        name: 'add-translation',
        component: AddTranslation, // The page for adding new translations
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes, // Register all the routes
});

export default router;
