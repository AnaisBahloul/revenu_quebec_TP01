// src/viewmodels/DashboardViewModel.js
export class DashboardViewModel {
  getUserSummary() {
    // Récupérer les infos utilisateur depuis localStorage
    const storedUser = JSON.parse(localStorage.getItem('user')) || {};

    return {
      nom: storedUser.nom || 'Utilisateur',
      declarationStatus: storedUser.declarationStatus || 'En cours',
      alerts: [], // exemple d’alertes
      avis: storedUser.avis || [
        { title: 'Avis 2022', date: '15/04/2023' },
        { title: 'Avis 2021', date: '10/03/2022' }
      ] // exemple d’avis
    };
  }

  logout() {
    localStorage.removeItem('user');
  }
}
