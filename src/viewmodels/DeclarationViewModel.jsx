// src/viewmodels/DeclarationViewModel.jsz
export class DeclarationViewModel {

  constructor() {
    this.user = JSON.parse(localStorage.getItem("user")) || {
      nom: "",
      prenom: "",
      nas: "",
      dob: "",
      adresse: "",
      email: "",
      telephone: "",
      citoyennete: "",
      lastDeclarationStep: null
    };
  }

  /**
   * Convertit le formulaire brut (inputs) en objet API compatible
   */
  mapToDeclarationDTO(form) {
    return {
      adresse: form.adresse,
      email: form.email,
      telephone: form.telephone,
      citoyennete: form.citoyennete,

      revenusEmploi: form.revenusEmploi.map(r => ({
        employeur: r.employeur,
        montant: Number(r.montant)
      })),

      autresRevenus: form.autresRevenus.map(r => ({
        type: Number(r.type),       
        montant: Number(r.montant)
      })),

      fichiers: form.fichiers.map(f => ({
        nom: f.nom,
        url: f.url
      })),

      confirmationExactitude: form.confirmation,
      estBrouillon: false,
      userId: this.user.id ?? null
    };
  }

  // ---------- BROUILLON ----------

  saveDraft(form, step) {
    const draftDTO = this.mapToDeclarationDTO(form);
    draftDTO.estBrouillon = true;

    localStorage.setItem("draftDeclaration", JSON.stringify(draftDTO));

    // garder progression
    const newUser = { ...this.user, lastDeclarationStep: step };
    localStorage.setItem("user", JSON.stringify(newUser));
    this.user = newUser;

    alert("Brouillon enregistré !");
  }

  // ---------- SUBMISSION ----------

  async submitDeclaration(form) {
    const dto = this.mapToDeclarationDTO(form);

    console.log("PAYLOAD envoyé à l’API:", dto);

    // ici en vrai appel HTTP
    // await fetch("/api/declaration", { ... })

    localStorage.removeItem("draftDeclaration");

    const resetUser = { ...this.user, lastDeclarationStep: null };
    localStorage.setItem("user", JSON.stringify(resetUser));
    this.user = resetUser;

    alert("Déclaration soumise !");
  }
}

/*export class DeclarationViewModel {
  constructor(baseURL = 'http://localhost:5000/api') {
    this.baseURL = baseURL;
    this.user = JSON.parse(localStorage.getItem('user')) || {};
  }

  // Mapper le formulaire vers le DTO
  mapToDeclarationDTO(form) {
    const userId = this.user.id || 1; // À remplacer par l'ID réel
    
    return {
      anneeFiscale: new Date().getFullYear(),
      dateSoumission: new Date().toISOString(),
      adresse: form.adresse,
      email: form.email,
      telephone: form.telephone,
      citoyennete: form.citoyennete,
      estBrouillon: false,
      utilisateurId: userId,
      
      revenusEmploi: form.revenusEmploi.map(r => ({
        employeur: r.employeur,
        montant: parseFloat(r.montant) || 0
      })),
      
      autresRevenus: form.autresRevenus.map(r => ({
        type: parseInt(r.type) || 99,
        montant: parseFloat(r.montant) || 0,
        description: ''
      })),
      
      fichiers: form.fichiers.map((f, index) => ({
        nom: f.name || `fichier-${index}`,
        url: f.url || '',
        type: f.type || 'application/pdf'
      })),
      
      statutId: 1 // En cours
    };
  }

  // Soumettre une déclaration
  async submitDeclaration(form) {
    try {
      const dto = this.mapToDeclarationDTO(form);
      
      const response = await fetch(`${this.baseURL}/declarations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(dto)
      });
      
      if (!response.ok) throw new Error('Erreur lors de la soumission');
      
      const result = await response.json();
      
      // Nettoyer le localStorage
      localStorage.removeItem('draftDeclaration');
      localStorage.setItem('user', JSON.stringify({
        ...this.user,
        lastDeclarationStep: null,
        declarationStatus: 'En traitement'
      }));
      
      alert('Déclaration soumise avec succès !');
      return result;
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('Échec de la soumission. Veuillez réessayer.');
      throw error;
    }
  }

  // Sauvegarder un brouillon
  async saveDraft(form, step) {
    try {
      const draftDTO = this.mapToDeclarationDTO(form);
      draftDTO.estBrouillon = true;
      
      // Sauvegarde locale en attendant l'API
      localStorage.setItem('draftDeclaration', JSON.stringify(draftDTO));
      
      // Mettre à jour la progression
      const updatedUser = { 
        ...this.user, 
        lastDeclarationStep: step 
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      this.user = updatedUser;
      
      // Optionnel : sauvegarde serveur
      const response = await fetch(`${this.baseURL}/declarations/draft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(draftDTO)
      });
      
      if (response.ok) {
        console.log('Brouillon sauvegardé sur le serveur');
      }
      
      alert('Brouillon enregistré !');
      
    } catch (error) {
      console.error('Erreur sauvegarde brouillon:', error);
      alert('Brouillon sauvegardé localement');
    }
  }

  // Charger un brouillon existant
  async loadDraft() {
    const draft = localStorage.getItem('draftDeclaration');
    if (draft) {
      return JSON.parse(draft);
    }
    
    // Optionnel : charger depuis le serveur
    try {
      const response = await fetch(`${this.baseURL}/declarations/draft`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Erreur chargement brouillon:', error);
    }
    
    return null;
  }
}*/