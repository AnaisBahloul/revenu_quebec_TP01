// src/viewmodels/HistoryViewModel.js
export class HistoryViewModel {
  async fetchDeclarations() {
    // Simuler historique
    return [
  { avisId: 1, year: 2024, status: 'En traitement', amount: '—' },
  { avisId: 2, year: 2023, status: 'Traitée', amount: '1200 $' },
  { avisId: 3, year: 2022, status: 'Traitée', amount: '-800 $' },
];

  }

  downloadPDF(avisId) {
    alert('Téléchargement PDF pour avis ' + avisId);
  }

  viewAvis(avisId) {
    alert('Voir avis ' + avisId);
  }

  viewRevue(avisId) {
  alert('Voir récapitulatif de la déclaration ' + avisId);
}

}
