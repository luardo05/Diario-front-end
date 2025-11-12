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
  
      // O listener para 'click' em 'eventsContainer' permanece o mesmo.
      eventsContainer.addEventListener('click', async (event) => {
          const target = event.target; 
  
          if (target.classList.contains('btn-delete')) {
              const eventId = target.dataset.id;
              const isConfirmed = confirm('Tem certeza de que deseja excluir este registro? Esta ação não pode ser desfeita.');
  
              if (isConfirmed) {
                  const token = localStorage.getItem('token');
                  if (!token) {
                      showToast('Sua sessão expirou. Faça login novamente.', 'error');
                      return;
                  }
                  const result = await api.deleteEvent(eventId, token);
  
                  if (result.error) {
                      showToast(`Erro ao excluir: ${result.error}`, 'error');
                  } else {
                      showToast(result.message || 'Evento excluído com sucesso!');
                      loadEvents();
                  }
              }
          }
  
          if (target.classList.contains('btn-edit')) {
              const eventId = target.dataset.id;
              window.location.href = `event-form.html?id=${eventId}`;
          }
      });
  
  
      // A lógica de 'logout' permanece a mesma.
      if (logoutButton) {
          logoutButton.addEventListener('click', () => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = 'index.html';
          });
      }

      
      // --- FUNÇÃO PARA BUSCAR E EXIBIR OS EVENTOS ---
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
  

              let imageHtml = ''; 
  
              if (event.photo) {
                  const imageUrl = event.photo;
                  imageHtml = `<img src="${imageUrl}" alt="Foto do evento: ${event.title}">`;
              }
              
              eventCard.innerHTML = `
                  ${imageHtml}
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
  
      loadEvents();
  });