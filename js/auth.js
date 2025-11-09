// js/auth.js

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registrado com sucesso:', registration);
      })
      .catch(error => {
        console.log('Falha ao registrar Service Worker:', error);
      });
  });
}

document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // --- LÓGICA DE LOGIN ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Entrando...';

            try {
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const data = await api.login(email, password);

                if (data.error) {
                    // --- ALTERADO ---
                    showToast(`Erro no login: ${data.error}`, 'error');
                } else {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.location.href = 'diary.html';
                }
            } catch (error) {
                console.error('Falha no login:', error);
                // --- ALTERADO ---
                showToast('Não foi possível conectar ao servidor.', 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }

    // --- LÓGICA DE REGISTRO ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const submitButton = registerForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Registrando...';

            try {
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const data = await api.register(name, email, password);

                if (data.error) {
                    // --- ALTERADO ---
                    showToast(`Erro no registro: ${data.error}`, 'error');
                } else {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.location.href = 'diary.html';
                }
            } catch (error) {
                console.error('Falha no registro:', error);
                // --- ALTERADO ---
                showToast('Não foi possível conectar ao servidor.', 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }
});