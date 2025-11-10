// src/viewmodels/LoginViewModel.js
export class LoginViewModel {
  async login(email, password) {
    // Simuler authentification
    if (email === 'test@test.com' && password === '123456') {
      // Stocker toutes les infos nécessaires pour les pages suivantes
      localStorage.setItem('user', JSON.stringify({
        email,
        nom: 'Anaïs',
        prenom: 'Bahloul',
        nas: '123-456-789',
        dob: '2004-03-15',
        adresse: '123 rue Alphonses Desjardins',
        telephone: '589-555-1234'
      }));
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('user');
  }
}
