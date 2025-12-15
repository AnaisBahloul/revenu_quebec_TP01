// src/viewmodels/DashboardViewModel.js
export class DashboardViewModel {
  constructor(baseURL = 'http://localhost:5100/api') {
    this.baseURL = baseURL;
  }

  async getUserSummary() {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user')) || {};
      const userId = storedUser.id || storedUser.utilisateurId || storedUser.userId || 1;
      
      let hasBrouillon = false;
      let lastStep = null;
      
      // 1. Vérifier brouillon serveur
      if (userId) {
        try {
          const response = await fetch(`${this.baseURL}/declarations/brouillon/${userId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
          });
          
          if (response.ok) {
            const brouillon = await response.json();
            hasBrouillon = true;
            lastStep = brouillon.currentStep || storedUser.lastDeclarationStep;
            
            localStorage.setItem('draftDeclaration', JSON.stringify({
              form: {
                adresse: brouillon.adresse || '',
                email: brouillon.email || '',
                telephone: brouillon.telephone || '',
                citoyennete: brouillon.citoyennete || '',
                revenusEmploi: brouillon.revenusEmploi?.map(r => ({
                  employeur: r.employeur || '',
                  montant: r.montant?.toString() || ''
                })) || [{ employeur: '', montant: '' }],
                autresRevenus: brouillon.autresRevenus?.map(r => ({
                  type: r.type?.toString() || '',
                  montant: r.montant?.toString() || ''
                })) || [{ type: '', montant: '' }],
                fichiers: brouillon.fichiers || [],
                confirmationExactitude: brouillon.confirmationExactitude || false
              },
              step: brouillon.currentStep || 1,
              timestamp: new Date().toISOString()
            }));
          }
        } catch (error) {
          // Silencieux
        }
      }
      
      // 2. Vérifier brouillon localStorage
      if (!hasBrouillon) {
        const localDraft = localStorage.getItem('draftDeclaration');
        if (localDraft) {
          hasBrouillon = true;
          const draft = JSON.parse(localDraft);
          lastStep = draft.step;
        }
      }
      
      let declarationStatus = hasBrouillon ? 'Brouillon en cours' : 'Aucune déclaration';
      let lastDeclarationState = null;
      
      // 3. Si pas de brouillon, chercher dernière déclaration soumise
      if (!hasBrouillon && userId) {
        try {
          const declarationsResponse = await fetch(`${this.baseURL}/declarations/user/${userId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
          });
          
          if (declarationsResponse.ok) {
            const declarations = await declarationsResponse.json();
            
            if (declarations && declarations.length > 0) {
              // Filtrer seulement les déclarations SOUMISES
              const declarationsSoumises = declarations.filter(d => !d.estBrouillon);
              
              if (declarationsSoumises.length > 0) {
                // Trouver la déclaration la plus récente
                const derniereDeclaration = declarationsSoumises.sort((a, b) => {
                  // D'abord par date (la plus récente)
                  const dateA = this.convertToTimestamp(a.dateSoumission);
                  const dateB = this.convertToTimestamp(b.dateSoumission);
                  
                  // Si dates différentes
                  if (dateA !== dateB) {
                    return dateB - dateA; // Décroissant
                  }
                  
                  // Si dates identiques, par ID (le plus élevé = le plus récent)
                  return b.id - a.id;
                })[0];
                
                // CORRECTION ICI : Prendre DIRECTEMENT l'état de la déclaration
                // Selon vos logs, derniereDeclaration.etat devrait être "Traitée"
                declarationStatus = derniereDeclaration.etat || 'Aucune déclaration';
                lastDeclarationState = declarationStatus;
              }
            }
          }
        } catch (error) {
          // Silencieux
        }
      }
      
      return {
        nom: storedUser.nom || storedUser.prenom || 'Utilisateur',
        prenom: storedUser.prenom || '',
        hasBrouillon: hasBrouillon,
        lastDeclarationStep: lastStep,
        declarationStatus: declarationStatus,
        lastDeclarationState: lastDeclarationState,
        alerts: [],
        avis: []
      };
      
    } catch (error) {
      return this.getFallbackSummary();
    }
  }
  
  convertToTimestamp(dateString) {
    if (!dateString) return 0;
    
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 0 : date.getTime();
    } catch (e) {
      return 0;
    }
  }
  
  getFallbackSummary() {
    const storedUser = JSON.parse(localStorage.getItem('user')) || {};
    const localDraft = localStorage.getItem('draftDeclaration');
    const hasBrouillon = !!localDraft;
    
    return {
      nom: storedUser.nom || storedUser.prenom || 'Utilisateur',
      prenom: storedUser.prenom || '',
      hasBrouillon: hasBrouillon,
      lastDeclarationStep: hasBrouillon ? JSON.parse(localDraft).step : null,
      declarationStatus: hasBrouillon ? 'Brouillon en cours' : 'Aucune déclaration',
      alerts: [],
      avis: []
    };
  }

  async logout() {
    try {
      const sessionId = localStorage.getItem('sessionId');
      
      if (sessionId) {
        await fetch(`${this.baseURL}/authentification/logout`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            sessionId: parseInt(sessionId)
          })
        });
      }
      
      localStorage.removeItem('user');
      localStorage.removeItem('sessionId');
      localStorage.removeItem('token');
      
    } catch (error) {
      localStorage.removeItem('user');
      localStorage.removeItem('sessionId');
      localStorage.removeItem('token');
    }
  }
}