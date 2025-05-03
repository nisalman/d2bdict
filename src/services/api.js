import axios from 'axios';

// Configure Axios for your backend API
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Adjust the URL as per your backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// Fetch translations or search translations with direction
export const getTranslations = async (searchQuery = '', direction = 'german') => {
    try {
        let url = '/translations';  // Default URL for fetching all translations

        // If there's a search query, we add the search direction and query to the URL
        if (searchQuery.trim() !== '') {
            url = `/translations/search/${direction}/${searchQuery}`;
        }

        const response = await api.get(url);
        return response.data; // Return the data from the API
    } catch (error) {
        console.error('Error fetching translations', error);
        throw error;
    }
};
// Post a new translation
export const postTranslation = async (translationData) => {
    try {
        const response = await api.post('/translations', translationData); // Send POST request to backend
        return response.data; // Return the data from the API
    } catch (error) {
        console.error('Error posting translation', error);
        throw error;  // Re-throw the error to be caught in the component
    }
};