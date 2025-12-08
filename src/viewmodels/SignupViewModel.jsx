// src/viewmodels/SignupViewModel.js
export class SignupViewModel {
  constructor(baseURL = 'http://localhost:5100/api') {
    this.baseURL = baseURL;
  }

  async signup(form) {
    try {
      const utilisateurDTO = {
        courriel: form.email,
        motDePasse: form.password,
        nom: form.nom,
        prenom: form.prenom,
        nas: form.nas,
        dateNaissance: form.dob,
        adresse: "",
        telephone: ""
      };

      const response = await fetch(`${this.baseURL}/authentification/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(utilisateurDTO)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création du compte');
      }

      return true;
    } catch (err) {
      console.error("Erreur signup :", err);
      return false;
    }
  }
}
