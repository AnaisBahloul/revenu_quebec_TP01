// src/viewmodels/LoginViewModel.js - 
export class LoginViewModel {
  constructor(baseURL = 'http://localhost:5100/api') {
    this.baseURL = baseURL;
  }

  async login(email, password) {
    try {
      const response = await fetch(`${this.baseURL}/authentification/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courriel: email,
          motDePasse: password
        })
      });

      if (!response.ok) return false;

      const data = await response.json();
      console.log('Réponse login:', data); // DEBUG

      localStorage.setItem("sessionId", data.sessionId);
      
      // Stocke TOUTE la réponse utilisateur
      localStorage.setItem("user", JSON.stringify(data.utilisateur));

      console.log('User stocké dans localStorage:', data.utilisateur); // DEBUG

      return true;
    } catch (err) {
      console.error("Erreur login :", err);
      return false;
    }
  }
}