import axios from 'axios';

const API_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_URL
});

export const getDados = async () => {
    try {
        const response = await api.get('/produto/list');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados', error);
        return null;
    }
};

export const getDataFiltered = async (filter) => {
    try {
        const response = await api.post('/produto/search', filter);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados', error);
        return null;
    }
}

export default api;
