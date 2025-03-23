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

export const getUser = async (email) => {
    try {
        const response = await api.get('/cliente/get-user', {
            params: {
                email: email
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar cliente', error);
        return null;
    }
}

export const updateUser = async (user) => {
    try {
        const response = await api.put('/cliente',user);
        localStorage.setItem("user", JSON.stringify(response.data))
        return response.data;
    } catch (error) {
        console.error('Erro ao Atualizar cliente', error);
        return null;
    }
}

export const createOrder = async (order) => {
    try {
        const response = await api.post('/pedido',order);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar pedido', error);
        return null;
    }
}


export default api;
