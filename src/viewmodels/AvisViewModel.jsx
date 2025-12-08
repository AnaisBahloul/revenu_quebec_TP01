export class AvisViewModel {
  // Détails d'un avis
  async getAvisDetails(id) {
    // Exemple : id pair = automatique / impair = personnalisé
    const isAuto = id % 2 === 1;

    return {
      // Infos utilisateur récupérées via la déclaration
      nom: 'Test',
      prenom: 'Camille',
      nas: '123-456-789',

      // Infos de l'avis
      year: 2024,
      amount: '1 500 $',
      refNumber: 'RQ-2024-000' + id,
      generationDate: '2025-01-12',

      type: isAuto ? 'automatique' : 'personnalisé',
      requiresAgentReview: !isAuto,

      // Résumé des revenus (extrait de la déclaration)
      incomeSummary: [
        { type: 'Revenus d’emploi', description: 'Société ABC', amount: '45 000 $' },
        { type: 'Revenus d’intérêts', description: 'Institution XYZ', amount: '800 $' }
      ],

      // Calcul de l'impôt
      taxCalculation: {
        taxableIncome: '45 800 $',
        deductions: '3 500 $',
        netTax: '6 150 $',
        amountPayable: '1 200 $'
      },
 
      // Notes d'ajustement si avis personnalisé
      adjustmentNotes: isAuto ? [] : [
        'Revenus d’intérêts initialement manquants',
        'Données incohérentes'
      ]
    };
  }

  // Liste de tous les avis
  async getAllAvis() {
    return [
      {
        id: 1,
        title: 'Avis 2024',
        date: '12/01/2025',
        type: 'automatique',
        requiresAgentReview: false
      },
      {
        id: 2,
        title: 'Avis 2023',
        date: '15/02/2024',
        type: 'personnalisé',
        requiresAgentReview: true
      },
      {
        id: 3,
        title: 'Avis 2022',
        date: '20/03/2023',
        type: 'automatique',
        requiresAgentReview: false
      }
    ];
  }

  // Téléchargement du PDF
  downloadPDF(id) {
    alert('Téléchargement PDF pour avis ' + id);
  }
}
/*export class AvisViewModel {
  constructor(baseURL = 'http://localhost:5000/api') {
    this.baseURL = baseURL;
  }

  // Récupérer les détails d'un avis
  async getAvisDetails(id) {
    try {
      const response = await fetch(`${this.baseURL}/avis/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Avis non trouvé');
      
      const avis = await response.json();
      
      // Transformer les données du backend en format frontend
      return {
        nom: avis.declaration?.utilisateur?.nom || '',
        prenom: avis.declaration?.utilisateur?.prenom || '',
        nas: avis.declaration?.utilisateur?.nas || '',
        year: avis.anneeFiscale || 2024,
        amount: `${avis.montantTotal} $`,
        refNumber: avis.numeroReference || `RQ-${avis.anneeFiscale}-${avis.id}`,
        generationDate: avis.dateGeneration,
        type: avis.estAutomatique ? 'automatique' : 'personnalisé',
        requiresAgentReview: !avis.estAutomatique,
        
        incomeSummary: this.transformRevenus(avis.declaration),
        
        taxCalculation: {
          taxableIncome: `${avis.revenuImposable} $`,
          deductions: `${avis.totalDeductions} $`,
          netTax: `${avis.impotNet} $`,
          amountPayable: `${avis.montantAPayer} $`
        },
        
        adjustmentNotes: avis.notesAjustement || []
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'avis:', error);
      return null;
    }
  }

  // Lister tous les avis de l'utilisateur
  async getAllAvis() {
    try {
      const response = await fetch(`${this.baseURL}/avis`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Erreur serveur');
      
      const avisList = await response.json();
      
      return avisList.map(avis => ({
        id: avis.id,
        title: `Avis ${avis.anneeFiscale}`,
        date: new Date(avis.dateGeneration).toLocaleDateString('fr-CA'),
        type: avis.estAutomatique ? 'automatique' : 'personnalisé',
        requiresAgentReview: !avis.estAutomatique
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des avis:', error);
      return [];
    }
  }

  // Transformer les revenus pour l'affichage
  transformRevenus(declaration) {
    if (!declaration) return [];
    
    const revenus = [];
    
    // Revenus d'emploi
    declaration.revenusEmploi?.forEach(r => {
      revenus.push({
        type: 'Revenus d\'emploi',
        description: r.employeur,
        amount: `${r.montant} $`
      });
    });
    
    // Autres revenus
    declaration.autresRevenus?.forEach(r => {
      const typeMap = {
        1: 'Revenus d\'emploi',
        2: 'Intérêts',
        3: 'Placement',
        99: 'Autre'
      };
      
      revenus.push({
        type: typeMap[r.type] || 'Autre revenu',
        description: '',
        amount: `${r.montant} $`
      });
    });
    
    return revenus;
  }

  // Télécharger le PDF
  async downloadPDF(id) {
    try {
      const response = await fetch(`${this.baseURL}/avis/${id}/pdf`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('PDF non disponible');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `avis-${id}.pdf`;
      a.click();
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('PDF non disponible pour cet avis');
    }
  }
}*/
