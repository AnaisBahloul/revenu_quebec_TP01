// src/viewmodels/HistoryViewModel.js
export class HistoryViewModel {
  async fetchDeclarations() {
    // Simuler historique
    return [
      { year: 2024, status: 'Validée', amount: 1500, avisId: 1 },
      { year: 2023, status: 'En révision', amount: 1200, avisId: 2 }
    ];
  }

  downloadPDF(avisId) {
    alert('Téléchargement PDF pour avis ' + avisId);
  }

  viewAvis(avisId) {
    alert('Voir avis ' + avisId);
  }
}
