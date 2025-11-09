// js/diary.js

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

    const eventsContainer = document.getElementById('events-container');
    const logoutButton = document.getElementById('logout-button');

    // Listener de eventos no container pai para lidar com cliques nos botões de ação
    eventsContainer.addEventListener('click', async (event) => {
        const target = event.target; // O elemento exato que foi clicado

        // --- LÓGICA DE EXCLUSÃO ---
        if (target.classList.contains('btn-delete')) {
            const eventId = target.dataset.id;

            // Pede confirmação ao usuário antes de excluir (confirm é mantido)
            const isConfirmed = confirm('Tem certeza de que deseja excluir este registro? Esta ação não pode ser desfeita.');

            if (isConfirmed) {
                const token = localStorage.getItem('token');
                if (!token) {
                    // --- ALTERADO ---
                    showToast('Sua sessão expirou. Faça login novamente.', 'error');
                    return;
                }
                const result = await api.deleteEvent(eventId, token);

                if (result.error) {
                    // --- ALTERADO ---
                    showToast(`Erro ao excluir: ${result.error}`, 'error');
                } else {
                    // --- ALTERADO ---
                    showToast(result.message || 'Evento excluído com sucesso!'); // 'success' é o padrão
                    loadEvents(); // Recarrega a lista de eventos para refletir a exclusão
                }
            }
        }

        // --- LÓGICA DE EDIÇÃO (Navegação) ---
        if (target.classList.contains('btn-edit')) {
            const eventId = target.dataset.id;
            // Redireciona para a página do formulário, passando o ID do evento na URL como um parâmetro
            window.location.href = `event-form.html?id=${eventId}`;
        }
    });


    // --- LÓGICA DE LOGOUT (código existente) ---
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('token');

            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
    }

    // --- FUNÇÃO PARA BUSCAR E EXIBIR OS EVENTOS (código existente) ---
    const loadEvents = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Nenhum token encontrado.');
            return;
        }

        eventsContainer.innerHTML = '<p class="loading-message">Carregando memórias...</p>';

        const events = await api.getEvents(token);
        eventsContainer.innerHTML = '';

        if (!events || events.length === 0) {
            eventsContainer.innerHTML = '<p>Você ainda não tem nenhum registro no seu diário. Que tal adicionar o primeiro?</p>';
            return;
        }

        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';

            const eventDate = new Date(event.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            
            const apiUrlWithoutApi = BASE_URL.endsWith('/api') ? BASE_URL.slice(0, -4) : BASE_URL;
            const imageUrl = `${apiUrlWithoutApi}/files/${event.photo}`;

            eventCard.innerHTML = `
                <img src="${imageUrl}" alt="Foto do evento: ${event.title}">
                <div class="event-info">
                    <h2>${event.title}</h2>
                    <p class="event-date">${eventDate}</p>
                    <p class="event-description">${event.description}</p>
                    <div class="event-actions">
                        <button class="btn-edit" data-id="${event._id}">Editar</button>
                        <button class="btn-delete" data-id="${event._id}">Excluir</button>
                    </div>
                </div>
            `;
            
            eventsContainer.appendChild(eventCard);
        });
    };

    // --- INICIALIZAÇÃO (código existente) ---
    loadEvents();
});