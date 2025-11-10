export class DashboardViewModel {
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
}
