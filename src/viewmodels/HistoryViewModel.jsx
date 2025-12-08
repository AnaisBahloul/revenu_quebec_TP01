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
/*export class HistoryViewModel {
  constructor(baseURL = 'http://localhost:5000/api') {
    this.baseURL = baseURL;
  }

  async fetchDeclarations() {
    try {
      const response = await fetch(`${this.baseURL}/declarations/historique`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Erreur serveur');
      
      const declarations = await response.json();
      
      return declarations.map(d => ({
        avisId: d.avis?.id || 0,
        year: d.anneeFiscale,
        status: this.getStatusLabel(d.statutId),
        amount: d.avis ? `${d.avis.montantAPayer} $` : '—'
      }));
      
    } catch (error) {
      console.error('Erreur historique:', error);
      return [];
    }
  }

  getStatusLabel(statutId) {
    const statusMap = {
      1: 'En traitement',
      2: 'En validation automatique',
      3: 'En révision par un agent',
      4: 'Traitée automatiquement',
      5: 'Traitée avec révision',
      6: 'Clôturée'
    };
    return statusMap[statutId] || 'Inconnu';
  }
}*/
