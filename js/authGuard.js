// js/authGuard.js

// Pega o token de autenticação que salvamos no localStorage
const token = localStorage.getItem('token');

// Verifica se o token NÃO existe
if (!token) {
    // Se não houver token, o usuário não está logado.
    // Redirecionamos ele imediatamente para a página de login.
    window.location.href = 'index.html';
}