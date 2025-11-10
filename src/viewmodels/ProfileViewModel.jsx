// src/viewmodels/ProfileViewModel.js
export class ProfileViewModel {
  async getProfile() {
    // Simuler profil
    return {
      nom: 'Anaïs',
      prenom: 'Bahloul',
      nas: '123-456-789',
      dob: '2004-03-15',
      email: 'anais.bahloul2022@gmail.com',
      adresse: '123 rue Alphonses Desjardins',
      telephone: '589-555-1234'
    };
  }
}
