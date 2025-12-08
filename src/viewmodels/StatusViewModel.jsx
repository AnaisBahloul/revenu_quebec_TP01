export class StatusViewModel {
  async fetchCurrentStatus() {
    return {
      etat: "En révision par un agent",
      dateSoumission: "2025-11-10",
      messages: "Votre dossier est en analyse.",
      
      // NOUVELLES DATES PAR ÉTAPE
      dateRecu: "2025-11-09",
      dateValidationAuto: "2025-11-09 14:32",
      dateRevisionAgent: "2025-11-10 08:10"
    };
  }
}
/*export class StatusViewModel {
  constructor(baseURL = 'http://localhost:5000/api') {
    this.baseURL = baseURL;
  }

  async fetchCurrentStatus() {
    try {
      const response = await fetch(`${this.baseURL}/declarations/status/current`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Aucune déclaration en cours');
      
      const declaration = await response.json();
      
      return {
        etat: this.getStatusLabel(declaration.statutId),
        dateSoumission: new Date(declaration.dateSoumission).toLocaleDateString('fr-CA'),
        messages: this.getStatusMessage(declaration.statutId),
        dateRecu: new Date(declaration.dateSoumission).toLocaleDateString('fr-CA'),
        dateValidationAuto: declaration.historiqueStatuts?.find(h => h.statutId === 2)?.date || '',
        dateRevisionAgent: declaration.historiqueStatuts?.find(h => h.statutId === 3)?.date || ''
      };
      
    } catch (error) {
      console.error('Erreur statut:', error);
      return {
        etat: 'Aucune déclaration en cours',
        dateSoumission: '',
        messages: 'Commencer une nouvelle déclaration',
        dateRecu: '',
        dateValidationAuto: '',
        dateRevisionAgent: ''
      };
    }
  }

  getStatusLabel(statutId) {
    const map = {
      1: 'En cours', 2: 'En validation automatique', 
      3: 'En révision par un agent', 4: 'Validée automatiquement',
      5: 'Traitée avec révision', 6: 'Clôturée'
    };
    return map[statutId] || 'Inconnu';
  }

  getStatusMessage(statutId) {
    const messages = {
      1: 'Votre déclaration a été reçue.',
      2: 'Votre déclaration est en cours de validation automatique.',
      3: 'Un agent examine votre déclaration.',
      4: 'Votre déclaration a été validée automatiquement.',
      5: 'Votre déclaration a été traitée avec révision.',
      6: 'Votre déclaration est clôturée.'
    };
    return messages[statutId] || '';
  }
}*/
