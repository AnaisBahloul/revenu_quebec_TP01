export class AvisViewModel {
  async getAvisDetails(id) {
    return {
      nom: 'Utilisateur Test',
      prenom: 'Camille',
      nas: '123-456-789',
      year: 2024,
      amount: '1 500 $',
      refNumber: 'RQ-2024-000' + id,
      generationDate: '2025-01-12',
      incomeSummary: [
        { type: 'Revenus d’emploi', description: 'Société ABC', amount: '45 000 $' },
        { type: 'Revenus d’intérêts', description: 'Institution XYZ', amount: '800 $' }
      ],
      taxCalculation: {
        taxableIncome: '45 800 $',
        deductions: '3 500 $',
        netTax: '6 150 $',
        amountPayable: '1 200 $'
      },
      requiresAgentReview: true,
      adjustmentNotes: [
        'Revenus d’intérêts initialement manquants',
        'Pièce justificative T5 à fournir'
      ]
    };
  }

  async getAllAvis() {
    // Simuler une liste d'avis
    return [
      { id: 1, title: 'Avis 2024', date: '12/01/2025', type: 'automatique' },
      { id: 2, title: 'Avis 2023', date: '15/02/2024', type: 'personnalisé' },
      { id: 3, title: 'Avis 2022', date: '20/03/2023', type: 'automatique' }
    ];
  }

  downloadPDF(id) {
    alert('Téléchargement PDF pour avis ' + id);
  }
}
