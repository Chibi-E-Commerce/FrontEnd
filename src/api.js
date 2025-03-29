import axios from 'axios';

const API_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_URL
});

export const getProducts = async () => {
    try {
        const response = await api.get('/produto/list');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados', error);
        return null;
    }
};

export const getUsers = async () => {
    try {
        const response = await api.get('/cliente/list');
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

export const getDataFilteredRestricted = async (filter) => {
    try {
        const response = await api.post('/produto/search/restricted', filter);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados', error);
        return null;
    }
}

export const getClientFiltered = async (filter) => {
    try {
        const response = await api.post('/cliente/search', filter);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados', error);
        return null;
    }
}

export const getDataSorted = async () => {
    try {
        const response = await api.get('/produto/sort');
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados', error);
        return null;
    }
}

export const getClientSorted = async () => {
    try {
        const response = await api.get('/cliente/sort');
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

export const deleteProduct = async (nome) => {
    try {
        const response = await api.delete('/produto', {params: {nome: nome}});
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar produto', error);
        return null;
    }
}

export const deleteClient = async (email) => {
    try {
        const response = await api.delete('/cliente',{params: {email: email}});
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar cliente', error);
        return null;
    }
}

export default api;
