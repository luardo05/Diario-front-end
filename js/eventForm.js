// js/eventForm.js

document.addEventListener('DOMContentLoaded', () => {

    const eventForm = document.getElementById('event-form');
    const pageTitle = document.querySelector('h1');
    const token = localStorage.getItem('token');
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    const isEditMode = Boolean(eventId);

    if (eventForm) {
        eventForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const submitButton = eventForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Salvando...';
            
            if (!token) {
                // --- CÓDIGO ALTERADO ---
                showToast('Sua sessão expirou. Por favor, faça login novamente.', 'error');
                // --- FIM DA ALTERAÇÃO ---
                window.location.href = 'index.html';
                return;
            }

            try {
                if (isEditMode) {
                    // MODO DE EDIÇÃO
                    const updatedData = {
                        title: document.getElementById('title').value,
                        date: document.getElementById('date').value,
                        description: document.getElementById('description').value,
                    };
                    const data = await api.updateEvent(eventId, updatedData, token);
                    if (data.error) {
                        // --- CÓDIGO ALTERADO ---
                        showToast(`Erro ao atualizar evento: ${data.error}`, 'error');
                        // --- FIM DA ALTERAÇÃO ---
                    } else {
                        // --- CÓDIGO ALTERADO ---
                        // Armazena a mensagem de sucesso para exibir na próxima página
                        localStorage.setItem('toastMessage', 'Evento atualizado com sucesso!');
                        // --- FIM DA ALTERAÇÃO ---
                        window.location.href = 'diary.html';
                    }
                } else {
                    // MODO DE CRIAÇÃO
                    const formData = new FormData(eventForm);
                    const data = await api.createEvent(formData, token);
                    if (data.error) {
                        // --- CÓDIGO ALTERADO ---
                        showToast(`Erro ao criar evento: ${data.error}`, 'error');
                        // --- FIM DA ALTERAÇÃO ---
                    } else {
                        // --- CÓDIGO ALTERADO ---
                        // Armazena a mensagem de sucesso para exibir na próxima página
                        localStorage.setItem('toastMessage', 'Evento registrado com sucesso!');
                        // --- FIM DA ALTERAÇÃO ---
                        window.location.href = 'diary.html';
                    }
                }
            } catch (error) {
                console.error('Falha na requisição:', error);
                // --- CÓDIGO ALTERADO ---
                showToast('Ocorreu uma falha ao tentar se comunicar com o servidor.', 'error');
                // --- FIM DA ALTERAÇÃO ---
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }

    // O código para preencher o formulário no modo de edição precisa estar aqui também
    if (isEditMode) {
        pageTitle.textContent = 'Editar Registro';
        const photoInputGroup = document.getElementById('photo').parentElement;
        if (photoInputGroup) { photoInputGroup.style.display = 'none'; }
        document.getElementById('photo').required = false;

        const populateForm = async () => {
            if (!token) return;
            const events = await api.getEvents(token);
            const eventToEdit = events.find(event => event._id === eventId);
            if (eventToEdit) {
                document.getElementById('title').value = eventToEdit.title;
                document.getElementById('date').value = new Date(eventToEdit.date).toISOString().split('T')[0];
                document.getElementById('description').value = eventToEdit.description;
            } else {
                // --- CÓDIGO ALTERADO ---
                showToast('Erro: Evento não encontrado!', 'error');
                // --- FIM DA ALTERAÇÃO ---
                window.location.href = 'diary.html';
            }
        };
        populateForm();
    }
});