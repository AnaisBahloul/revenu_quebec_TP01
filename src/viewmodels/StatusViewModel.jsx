// src/viewmodels/StatusViewModel.js
export class StatusViewModel {
  async fetchCurrentStatus() {
    // Simuler l’état de traitement
    return {
      etat: 'En cours',
      dateSoumission: '2025-11-06',
      messages: 'Traitement en cours par Revenu Québec.'
    };
  }
}
