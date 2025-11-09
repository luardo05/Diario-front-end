/**
 * Exibe uma notificação toast na tela.
 * @param {string} message - A mensagem a ser exibida.
 * @param {string} [type='success'] - O tipo de notificação ('success' ou 'error').
 * @param {number} [duration=4000] - A duração em milissegundos que a notificação fica na tela.
 */
function showToast(message, type = 'success', duration = 4000) {
    // Cria o elemento da notificação
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`; // Ex: 'toast-notification success'
    toast.textContent = message;

    // Adiciona a notificação ao corpo do documento
    document.body.appendChild(toast);

    // Força um "reflow" para que a transição de entrada funcione
    setTimeout(() => {
        toast.classList.add('show');
    }, 10); // Um pequeno delay é suficiente

    // Define um timer para remover a notificação após a duração especificada
    setTimeout(() => {
        toast.classList.remove('show');

        // Adiciona um listener para remover o elemento do DOM após a transição de saída
        toast.addEventListener('transitionend', () => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, { once: true }); // O listener só executa uma vez

    }, duration);
}