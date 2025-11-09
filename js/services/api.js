// js/services/api.js

// --- Configuração da URL da API ---
// Esta lógica detecta se você está no ambiente local ou em produção (Netlify)
// e escolhe a URL correta da API.

const localApiUrl = 'http://localhost:3001/api';

// IMPORTANTE: Quando você publicar seu back-end no Render,
// você receberá uma URL. Você DEVE substituir o valor abaixo por essa URL.

// Antes (Incorreto)
//const productionApiUrl = 'https://diario-a.onrender.com'; // <<-- TROCAR DEPOIS

// Depois (Correto)
const productionApiUrl = 'https://diario-a.onrender.com/api';

// Seleciona a URL base com base no ambiente (local vs. produção)
const BASE_URL = window.location.hostname.includes('localhost')
  ? localApiUrl
  : productionApiUrl;


// --- Objeto da API com todas as funções de comunicação ---

const api = {
    /**
     * Registra um novo usuário.
     * @param {string} name - Nome do usuário.
     * @param {string} email - Email do usuário.
     * @param {string} password - Senha do usuário.
     * @returns {Promise<object>} - A resposta da API (usuário e token).
     */
    register: async (name, email, password) => {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        return response.json();
    },

    /**
     * Autentica um usuário existente.
     * @param {string} email - Email do usuário.
     * @param {string} password - Senha do usuário.
     * @returns {Promise<object>} - A resposta da API (usuário e token).
     */
    login: async (email, password) => {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return response.json();
    },

    /**
     * Busca todos os eventos do usuário autenticado.
     * @param {string} token - O token JWT do usuário.
     * @returns {Promise<Array>} - Um array com os eventos do usuário.
     */
    getEvents: async (token) => {
        const response = await fetch(`${BASE_URL}/events`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    /**
     * Cria um novo evento.
     * @param {FormData} formData - Os dados do formulário, incluindo a imagem.
     * @param {string} token - O token JWT do usuário.
     * @returns {Promise<object>} - O novo evento criado.
     */
    createEvent: async (formData, token) => {
        const response = await fetch(`${BASE_URL}/events`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            // NOTA: Não definimos 'Content-Type' aqui. O navegador faz isso
            // automaticamente quando o corpo da requisição é um FormData.
            body: formData
        });
        return response.json();
    },

    /**
     * Atualiza um evento existente.
     * @param {string} eventId - O ID do evento a ser atualizado.
     * @param {object} data - Os dados a serem atualizados (ex: { title, description }).
     * @param {string} token - O token JWT do usuário.
     * @returns {Promise<object>} - A mensagem de sucesso da API.
     */
    updateEvent: async (eventId, data, token) => {
        const response = await fetch(`${BASE_URL}/events/${eventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        return response.json();
    },

    /**
     * Deleta um evento existente.
     * @param {string} eventId - O ID do evento a ser deletado.
     * @param {string} token - O token JWT do usuário.
     * @returns {Promise<object>} - A mensagem de sucesso da API.
     */
    deleteEvent: async (eventId, token) => {
        const response = await fetch(`${BASE_URL}/events/${eventId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    }
};