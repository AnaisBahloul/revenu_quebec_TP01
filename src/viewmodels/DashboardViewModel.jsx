/*export class DashboardViewModel {
  getUserSummary() {
    const storedUser = JSON.parse(localStorage.getItem('user')) || {};

    return {
      nom: storedUser.nom || 'Utilisateur',
      declarationStatus: storedUser.declarationStatus || 'En cours',
      lastDeclarationStep: storedUser.lastDeclarationStep || null, // ← Ajouté
      alerts: [],
      avis: storedUser.avis || [
        { title: 'Avis 2022', date: '15/04/2023' },
        { title: 'Avis 2021', date: '10/03/2022' }
      ]
    };
  }

  logout() {
    localStorage.removeItem('user');
  }
}*/

// src/viewmodels/DashboardViewModel.js
export class DashboardViewModel {
  constructor(baseURL = 'http://localhost:5100/api') {
    this.baseURL = baseURL;
  }

  // Version SIMPLE
  getUserSummary() {
    const storedUser = JSON.parse(localStorage.getItem('user')) || {};

    return {
      nom: storedUser.nom || storedUser.prenom || 'Utilisateur',
      prenom: storedUser.prenom || '',
      declarationStatus: 'Aucune déclaration',
      lastDeclarationStep: null,
      alerts: [],
      avis: []
    };
  }

  // MÉTHODE LOGOUT - TRÈS IMPORTANT !
  async logout() {
    try {
      console.log('Début déconnexion...');
      
      const sessionId = localStorage.getItem('sessionId');
      console.log('Session ID à déconnecter:', sessionId);
      
      if (sessionId) {
        console.log('Appel API logout...');
        
        const response = await fetch(`${this.baseURL}/authentification/logout`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            sessionId: parseInt(sessionId)
          })
        });

        console.log('Réponse logout:', response.status, response.statusText);
        
        if (response.ok) {
          const result = await response.json();
          console.log('✅ Logout API réussi:', result);
        } else {
          console.warn('Logout API échoué');
        }
      }
      
      // TOUJOURS NETTOYER LE LOCALSTORAGE
      console.log('Nettoyage localStorage...');
      localStorage.removeItem('user');
      localStorage.removeItem('sessionId');
      localStorage.removeItem('token');
      
      console.log('Déconnexion terminée');
      
    } catch (error) {
      console.error('Erreur logout:', error);
      // NETTOYE QUAND MÊME !
      localStorage.removeItem('user');
      localStorage.removeItem('sessionId');
      localStorage.removeItem('token');
    }
  }
}