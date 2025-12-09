
export class AvisViewModel {
  constructor(baseURL = 'http://localhost:5100/api') {
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

  year: avis.year,
  amount: avis.amount,
  refNumber: avis.refNumber,
  generationDate: avis.generationDate,
  type: avis.type === 0 ? "automatique" : "personnalisé",
  requiresAgentReview: avis.requiresAgentReview,

  incomeSummary: this.transformRevenus(avis.declaration),

  taxCalculation: {
    taxableIncome: avis.taxableIncome,
    deductions: avis.deductions,
    netTax: avis.netTax,
    amountPayable: avis.amountPayable
  },

  adjustmentNotes: avis.adjustmentNotes || []
};

    } catch (error) {
      console.error('Erreur lors de la récupération de l\'avis:', error);
      return null;
    }
  }

  // Lister tous les avis de l'utilisateur
  async getAllAvis() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) throw new Error("Utilisateur non connecté");

  const response = await fetch(`${this.baseURL}/avis/user/${user.id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) throw new Error("Erreur serveur");

  const avisList = await response.json();

  return avisList.map(avis => ({
    id: avis.id,
    title: avis.title,
    date: new Date(avis.generationDate).toLocaleDateString("fr-CA"),
    type: avis.type === 0 ? "automatique" : "personnalisé",
  }));
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
}
