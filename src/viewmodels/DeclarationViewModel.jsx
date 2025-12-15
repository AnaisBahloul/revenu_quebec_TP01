// src/viewmodels/DeclarationViewModel.js 
export class DeclarationViewModel {
  constructor(baseURL = 'http://localhost:5100/api') {
    this.baseURL = baseURL;
    this.user = JSON.parse(localStorage.getItem('user')) || {};
     this.currentDraftId = null;
    console.log('User chargé dans ViewModel:', this.user);
  }

  // Méthode helper pour obtenir l'ID utilisateur
  getUserId() {
    // Essaie plusieurs clés possibles pour l'ID
    return this.user.id || this.user.utilisateurId || this.user.Id || 1;
  }

   async checkExistingDraft() {
    try {
      const userId = this.getUserId();
      if (!userId) return null;
      
      const response = await fetch(`${this.baseURL}/declarations/brouillon/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (response.ok) {
        const brouillon = await response.json();
        this.currentDraftId = brouillon.id;
        return brouillon;
      }
      return null;
    } catch (error) {
      console.error('Erreur vérification brouillon:', error);
      return null;
    }
  }

  // Mapper le formulaire vers le DTO - VERSION POUR BROUILLONS
  mapToDeclarationDTO(form, step, isDraft = false) {
    const userId = this.getUserId();
    console.log('Mapping DTO - UserID:', userId, 'User object:', this.user);
    
    if (isDraft) {
      // POUR LES BROUILLONS : garde tous les champs même vides
      return {
        adresse: form.adresse || '',
        email: form.email || '',
        telephone: form.telephone || '',
        citoyennete: form.citoyennete || '',
        
        revenusEmploi: form.revenusEmploi.map(r => ({
          employeur: r.employeur || '',
          montant: parseFloat(r.montant) || 0
        })),
        
        autresRevenus: form.autresRevenus.map(r => ({
          type: r.type ? parseInt(r.type) : null,
          montant: parseFloat(r.montant) || 0
        })),
        
        fichiers: form.fichiers.map((f, index) => ({
          nom: f.name || f.originalName || `fichier-${index}`,
          url: f.url || ''
        })),
        
        confirmationExactitude: form.confirmationExactitude || false,
        estBrouillon: true,
        utilisateurId: userId,
        currentStep: step
      };
    } else {
      // POUR SOUMISSION FINALE : valide et filtre
      return {
        adresse: form.adresse,
        email: form.email,
        telephone: form.telephone,
        citoyennete: form.citoyennete,
        
        revenusEmploi: form.revenusEmploi
          .filter(r => r.employeur && r.employeur.trim() && r.montant)
          .map(r => ({
            employeur: r.employeur,
            montant: parseFloat(r.montant) || 0
          })),
        
        autresRevenus: form.autresRevenus
          .filter(r => r.type && r.montant)
          .map(r => ({
            type: parseInt(r.type) || 99,
            montant: parseFloat(r.montant) || 0
          })),
        
        fichiers: form.fichiers.map((f, index) => ({
          nom: f.name || `fichier-${index}`,
          url: f.url || ''
        })),
        
        confirmationExactitude: form.confirmationExactitude,
        estBrouillon: false,
        utilisateurId: userId,
        currentStep: null
      };
    }
  }

  async saveDraft(form, step) {
    try {
      console.log('=== SAUVEGARDE BROUILLON ===');
      
      // Vérifier si on a déjà un brouillon
      const existingDraft = await this.checkExistingDraft();
      
      let result;
      
      if (existingDraft && this.currentDraftId) {
        // METTRE À JOUR un brouillon existant
        console.log('Mise à jour brouillon existant ID:', this.currentDraftId);
        result = await this.updateDraft(this.currentDraftId, form, step);
      } else {
        // CRÉER un nouveau brouillon
        console.log('Création nouveau brouillon');
        result = await this.createDraft(form, step);
      }
      
      // Sauvegarde locale
      this.saveLocalDraft(form, step);
      
      alert('Brouillon enregistré !');
      return result;
      
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      // Sauvegarde locale en cas d'erreur
      this.saveLocalDraft(form, step);
      alert('Brouillon sauvegardé localement (erreur serveur)');
      return null;
    }
  }

  // CRÉER un nouveau brouillon
  async createDraft(form, step) {
    const draftDTO = this.mapToDeclarationDTO(form, step, true);
    
    const response = await fetch(`${this.baseURL}/declarations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify(draftDTO)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur création brouillon');
    }
    
    const result = await response.json();
    this.currentDraftId = result.id;
    return result;
  }


async updateDraft(id, form, step) {
    const draftDTO = this.mapToDeclarationDTO(form, step, true);
    
    const response = await fetch(`${this.baseURL}/declarations/brouillon/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify(draftDTO)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur mise à jour brouillon');
    }
    
    return await response.json();
  }


 // Sauvegarde locale
  saveLocalDraft(form, step) {
    localStorage.setItem('draftDeclaration', JSON.stringify({
      form,
      step,
      timestamp: new Date().toISOString()
    }));
    
    // Mettre à jour la progression
    const updatedUser = { 
      ...this.user, 
      lastDeclarationStep: step 
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    this.user = updatedUser;
  }

  // Mapper avec support pour champs vides
  mapToDeclarationDTO(form, step, isDraft = false) {
    return {
      adresse: form.adresse || '',
      email: form.email || '',
      telephone: form.telephone || '',
      citoyennete: form.citoyennete || '',
      
      // Pour les brouillons, garde TOUS les champs même vides
      revenusEmploi: form.revenusEmploi.map(r => ({
        employeur: r.employeur || '',
        montant: parseFloat(r.montant) || 0
      })),
      
      autresRevenus: form.autresRevenus.map(r => ({
        type: r.type ? parseInt(r.type) : null,
        montant: parseFloat(r.montant) || 0
      })),
      
      fichiers: form.fichiers.map((f, index) => ({
  nom: f.name || `fichier-${index}`, // Prend .name ou .originalName
  url: f.url || ''
})),
      
      confirmationExactitude: form.confirmationExactitude || false,
      estBrouillon: isDraft,
      utilisateurId: this.getUserId(),
      currentStep: step
    };
  }

  // Soumettre une déclaration finale
  // Soumettre une déclaration finale - VERSION SIMPLE
async submitDeclaration(form) {
  try {
    console.log('=== SOUMISSION DÉCLARATION ===');
    
    // 1. Vérifier s'il y a un brouillon existant
    const existingDraft = await this.checkExistingDraft();
    
    if (existingDraft && this.currentDraftId) {
      // ⚠️ D'ABORD mettre à jour les données du brouillon avec les dernières valeurs
      console.log('Mise à jour finale du brouillon avant soumission ID:', this.currentDraftId);
      
      // Créer un DTO pour la MISE À JOUR FINALE (avec validation)
      const finalUpdateDTO = {
        adresse: form.adresse,
        email: form.email,
        telephone: form.telephone,
        citoyennete: form.citoyennete,
        
        // Filtrer les lignes vides pour la soumission
        revenusEmploi: form.revenusEmploi
          .filter(r => r.employeur && r.employeur.trim() && r.montant)
          .map(r => ({
            employeur: r.employeur,
            montant: parseFloat(r.montant) || 0
          })),
        
        autresRevenus: form.autresRevenus
          .filter(r => r.type && r.montant)
          .map(r => ({
            type: parseInt(r.type) || 99,
            montant: parseFloat(r.montant) || 0
          })),
        
        fichiers: form.fichiers.map((f, index) => ({
          nom: f.name || f.originalName || `fichier-${index}`,
          url: f.url || ''
        })),
        
        confirmationExactitude: form.confirmationExactitude,
        currentStep: null // Pas d'étape pour la soumission
      };
      
      // 1. Mettre à jour le brouillon une dernière fois
      const updateResponse = await fetch(`${this.baseURL}/declarations/brouillon/${this.currentDraftId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(finalUpdateDTO)
      });
      
      if (!updateResponse.ok) {
        const error = await updateResponse.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour finale');
      }
      
      // 2. ENSUITE soumettre le brouillon
      console.log('Soumission du brouillon ID:', this.currentDraftId);
      const submitResponse = await fetch(`${this.baseURL}/declarations/${this.currentDraftId}/soumettre`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!submitResponse.ok) {
        const error = await submitResponse.json();
        throw new Error(error.message || 'Erreur lors de la soumission');
      }
      
      const result = await submitResponse.json();
      
      // Nettoyer le localStorage
      localStorage.removeItem('draftDeclaration');
      this.currentDraftId = null;
      
      const resetUser = { 
        ...this.user, 
        lastDeclarationStep: null 
      };
      localStorage.setItem('user', JSON.stringify(resetUser));
      this.user = resetUser;
      
      alert('Déclaration soumise avec succès !');
      return result;
      
    } else {
      // 2. Si pas de brouillon existant, créer une nouvelle déclaration soumise
      console.log('Création d\'une nouvelle déclaration soumise');
      const declarationDTO = this.mapToDeclarationDTO(form, null, false);
      
      const response = await fetch(`${this.baseURL}/declarations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(declarationDTO)
      });
      
      console.log('Réponse soumission:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la soumission');
      }
      
      const result = await response.json();
      
      // Nettoyer le localStorage
      localStorage.removeItem('draftDeclaration');
      
      const resetUser = { 
        ...this.user, 
        lastDeclarationStep: null 
      };
      localStorage.setItem('user', JSON.stringify(resetUser));
      this.user = resetUser;
      
      alert('Déclaration soumise avec succès !');
      return result;
    }
    
  } catch (error) {
    console.error('Erreur soumission:', error);
    alert(`Échec de la soumission: ${error.message}`);
    throw error;
  }
}
 
  async uploadFiles(files) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    const response = await fetch(`${this.baseURL}/declarations/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    
    const uploadedFiles = await response.json();
    return uploadedFiles;
  }

  // Charger un brouillon existant - VERSION AMÉLIORÉE
  async loadDraft() {
    try {
      const userId = this.getUserId();
      console.log('=== CHARGEMENT BROUILLON ===');
      console.log('User ID pour chargement:', userId);
      
      if (!userId) {
        console.log('Aucun user ID trouvé');
        const localDraft = localStorage.getItem('draftDeclaration');
        return localDraft ? JSON.parse(localDraft) : null;
      }
      
      const response = await fetch(`${this.baseURL}/declarations/brouillon/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      console.log('Réponse chargement brouillon:', response.status);
      
      if (response.status === 404) {
        console.log('Aucun brouillon trouvé sur le serveur (404)');
        const localDraft = localStorage.getItem('draftDeclaration');
        return localDraft ? JSON.parse(localDraft) : null;
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur API chargement:', errorText);
        throw new Error('Erreur lors du chargement du brouillon');
      }
      
      const brouillon = await response.json();
      console.log('Brouillon récupéré:', brouillon);
      
      // VÉRIFIER SI C'EST BIEN UN BROUILLON
      if (!brouillon.estBrouillon && brouillon.etatCode !== 0) {
        console.warn('Ce n\'est pas un brouillon, état:', brouillon.etat);
        return null;
      }
      
      // Convertir le brouillon API en format formulaire
      const formattedDraft = this.mapBrouillonToForm(brouillon);
      console.log('Brouillon formaté:', formattedDraft);
      return formattedDraft;
      
    } catch (error) {
      console.error('Erreur chargement brouillon:', error);
      const localDraft = localStorage.getItem('draftDeclaration');
      return localDraft ? JSON.parse(localDraft) : null;
    }
  }

// Convertir le brouillon API en format formulaire - VERSION EXACTE
mapBrouillonToForm(apiBrouillon) {
  // Récupère EXACTEMENT ce qui est en base, rien de plus, rien de moins
  const revenusEmploi = apiBrouillon.revenusEmploi?.map(r => ({
    employeur: r.employeur || '',
    montant: r.montant?.toString() || ''
  })) || []; // Si null/undefined, retourne array vide
  
  const autresRevenus = apiBrouillon.autresRevenus?.map(r => ({
    type: r.type?.toString() || '',
    montant: r.montant?.toString() || ''
  })) || []; // Si null/undefined, retourne array vide

   // CORRECTION : Convertir les fichiers du backend en objets compatibles
  const fichiers = apiBrouillon.fichiers?.map(f => {
    // Créer un objet qui ressemble à un File pour le frontend
    return {
      name: f.nom || '',        // Le frontend utilise .name, pas .nom
      url: f.url || '',
      // Optionnel : ajouter un flag pour indiquer que c'est un fichier déjà uploadé
      isUploaded: true,
      originalName: f.nom       // Garder le nom original
    };
  }) || [];
  return {
    form: {
      adresse: apiBrouillon.adresse || '',
      email: apiBrouillon.email || '',
      telephone: apiBrouillon.telephone || '',
      citoyennete: apiBrouillon.citoyennete || '',
      revenusEmploi: revenusEmploi, // ← EXACTEMENT ce qui est en base
      autresRevenus: autresRevenus, // ← EXACTEMENT ce qui est en base
      fichiers: fichiers,
      confirmationExactitude: apiBrouillon.confirmationExactitude || false
    },
    step: apiBrouillon.currentStep || 1,
    timestamp: new Date().toISOString()
  };
}
}