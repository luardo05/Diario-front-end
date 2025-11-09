// js/auth.js

// O evento 'DOMContentLoaded' garante que o script só será executado
// depois que todo o conteúdo da página HTML for carregado.
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona os formulários de login e registro pelos seus IDs
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // --- LÓGICA DE LOGIN ---
    // Verifica se o formulário de login existe na página atual
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            // Previne o comportamento padrão do formulário, que é recarregar a página
            event.preventDefault();

            // Pega os valores dos campos de email e senha
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Usa a função 'login' do nosso api.js
            const data = await api.login(email, password);

            // Verifica se a API retornou um erro
            if (data.error) {
                alert(`Erro no login: ${data.error}`);
            } else {
                // Se o login for bem-sucedido, salva o token no localStorage
                localStorage.setItem('token', data.token);
                // Salva também os dados do usuário para fácil acesso (opcional)
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Redireciona o usuário para a página principal do diário
                window.location.href = 'diary.html';
            }
        });
    }

    // --- LÓGICA DE REGISTRO ---
    // Verifica se o formulário de registro existe na página atual
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Pega os valores dos campos de nome, email e senha
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Usa a função 'register' do nosso api.js
            const data = await api.register(name, email, password);

            if (data.error) {
                alert(`Erro no registro: ${data.error}`);
            } else {
                // Se o registro for bem-sucedido, já autentica o usuário
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // E redireciona para a página principal do diário
                window.location.href = 'diary.html';
            }
        });
    }
});