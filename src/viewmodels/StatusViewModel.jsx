export class StatusViewModel {
  constructor(baseURL = 'http://localhost:5100/api') {
    this.baseURL = baseURL;
  }

  async fetchCurrentStatus() {
    try {
      // 1. Récupérer TOUTES les déclarations de l'utilisateur
      const userId = this.getUserId();
      if (!userId) throw new Error('Utilisateur non connecté');

      const response = await fetch(`${this.baseURL}/declarations/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) throw new Error('Aucune déclaration trouvée');
      
      const declarations = await response.json();
      
      // DEBUG: Afficher toutes les déclarations
      console.log('=== TOUTES LES DÉCLARATIONS ===');
      declarations.forEach(d => {
        console.log(`ID: ${d.id}, Date: "${d.dateSoumission}", État: "${d.etat}", Brouillon: ${d.estBrouillon}`);
      });
      
      // 2. Filtrer uniquement les déclarations SOUMISES (pas brouillons)
      const declarationsSoumises = declarations.filter(d => !d.estBrouillon);
      
      console.log('=== DÉCLARATIONS SOUMISES ===');
      declarationsSoumises.forEach(d => {
        console.log(`ID: ${d.id}, Date: "${d.dateSoumission}", État: "${d.etat}"`);
      });
      
      if (declarationsSoumises.length === 0) {
        console.log('Aucune déclaration soumise trouvée');
        return this.getEmptyStatus();
      }
      
      // 3. TROUVER LA DERNIÈRE DÉCLARATION - VERSION ROBUSTE
      // Tri: d'abord par date (la plus récente), puis par ID (le plus élevé)
      const lastDeclaration = declarationsSoumises.sort((a, b) => {
        // Convertir les dates en timestamps
        const timestampA = this.convertToTimestamp(a.dateSoumission);
        const timestampB = this.convertToTimestamp(b.dateSoumission);
        
        // Si dates différentes, prendre la plus récente
        if (timestampA !== timestampB) {
          return timestampB - timestampA; // Décroissant
        }
        
        // Si dates identiques, prendre l'ID le plus élevé (le plus récent)
        return b.id - a.id;
      })[0];
      
      console.log('=== DERNIÈRE DÉCLARATION SÉLECTIONNÉE ===');
      console.log(`ID: ${lastDeclaration.id}`);
      console.log(`Date: ${lastDeclaration.dateSoumission}`);
      console.log(`État: ${lastDeclaration.etat}`);
      
      // 4. Récupérer l'historique des statuts
      console.log(`=== RÉCUPÉRATION HISTORIQUE POUR ID ${lastDeclaration.id} ===`);
      const historiqueResponse = await fetch(`${this.baseURL}/declarations/${lastDeclaration.id}/historique`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!historiqueResponse.ok) {
        console.log('Pas d\'historique disponible');
        const etatNum = this.convertEtatToNumber(lastDeclaration.etat);
        const messagePrincipal = this.getMessagePrincipal(etatNum);
        
        return {
          etat: lastDeclaration.etat || 'En traitement',
          dateSoumission: lastDeclaration.dateSoumission || '',
          messages: messagePrincipal, // Message principal selon l'état
          statuts: [],
          dernierMessage: '',
          hasHistorique: false,
          declarationEtat: lastDeclaration.etat,
          etatActuelCode: etatNum
        };
      }
      
      const historiqueData = await historiqueResponse.json();
      console.log('=== HISTORIQUE REÇU ===');
      console.log('État actuel:', historiqueData.etatActuel);
      console.log('Nombre de statuts:', historiqueData.statuts?.length);
      console.log('Statuts:', historiqueData.statuts);
      
      // 5. CORRECTION : Calculer le message principal selon l'état
      const etatActuel = historiqueData.etatActuel || lastDeclaration.etat;
      const etatNum = this.convertEtatToNumber(etatActuel);
      const messagePrincipal = this.getMessagePrincipal(etatNum);
      
      // 6. CORRECTION : Ajouter les couleurs spécifiques à chaque statut
      const statutsAvecCouleurs = (historiqueData.statuts || []).map(statut => {
        const couleur = this.getColorForStatusFromEtat(statut.etat || statut.etatAffichage);
        const etatAffichage = this.getEtatAffichageFromCode(statut.etat);
        
        return {
          ...statut,
          couleur: couleur,
          etatAffichage: etatAffichage,
          // Message spécifique pour chaque étape
          messageSpecifique: this.getMessageSpecifiqueForStatut(statut)
        };
      });
      
      // 7. Formater la réponse avec les corrections
      return {
        etat: etatActuel || 'En traitement',
        dateSoumission: historiqueData.dateSoumission || lastDeclaration.dateSoumission || '',
        messages: messagePrincipal, // Message principal calculé
        statuts: statutsAvecCouleurs,
        hasHistorique: true,
        declarationEtat: etatActuel || 'En traitement',
        etatActuelCode: etatNum,
        // Pour debug
        _debug: {
          declarationId: lastDeclaration.id,
          declarationDate: lastDeclaration.dateSoumission,
          totalDeclarations: declarations.length,
          soumisesCount: declarationsSoumises.length,
          etatNum: etatNum,
          messagePrincipal: messagePrincipal
        }
      };
      
    } catch (error) {
      console.error('Erreur fetchCurrentStatus:', error);
      return this.getEmptyStatus();
    }
  }

  // Helper: Convertir une date string en timestamp
  convertToTimestamp(dateString) {
    if (!dateString) return 0;
    
    try {
      // Essaye de parser la date
      const date = new Date(dateString);
      
      // Si la date est invalide, essaie un format YYYY-MM-DD
      if (isNaN(date.getTime())) {
        const parts = dateString.split('-');
        if (parts.length === 3) {
          const year = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1;
          const day = parseInt(parts[2]);
          return new Date(year, month, day).getTime();
        }
        return 0;
      }
      
      return date.getTime();
    } catch (e) {
      console.warn('Erreur conversion date:', dateString, e);
      return 0;
    }
  }

  // Helper pour obtenir l'ID utilisateur
  getUserId() {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      return user.id || user.utilisateurId || user.Id || null;
    } catch (e) {
      console.error('Erreur getUserId:', e);
      return null;
    }
  }

  // Retourner un statut vide
  getEmptyStatus() {
    return {
      etat: 'Aucune déclaration soumise',
      dateSoumission: '',
      messages: 'Commencer une nouvelle déclaration',
      statuts: [],
      hasHistorique: false,
      declarationEtat: '',
      etatActuelCode: 0,
      _debug: { message: 'Aucune déclaration trouvée' }
    };
  }

  
  convertEtatToNumber(etat) {
    if (!etat) return 0;
    
    const etatStr = etat.toString().toLowerCase();
    
    if (etatStr.includes('reçu') || etatStr.includes('recu') || etatStr === 'déclaration reçue') return 1;
    if (etatStr.includes('validée automatiquement') || etatStr.includes('valideeautomatiquement') || etatStr === 'validation automatisée') return 2;
    if (etatStr.includes('en révision') || etatStr.includes('enrevision') || etatStr.includes('révision par un agent')) return 3;
    if (etatStr.includes('traitée') || etatStr.includes('traitee') || etatStr === 'traitée') return 4;
    
    return 0;
  }


  getMessagePrincipal(etatNum) {
    // États 1, 2, 3 : "Votre dossier est en analyse"
    // État 4 : "Déclaration traitée et clôturée"
    if ([1, 2, 3].includes(etatNum)) {
      return 'Votre dossier est en analyse';
    } else if (etatNum === 4) {
      return 'Votre déclaration a été traitée';
    }
    
    return 'Aucun message disponible';
  }

 
  getColorForStatusFromEtat(etat) {
    if (!etat) return 'secondary';
    
    const etatStr = etat.toString().toLowerCase();
    
    // Couleurs selon l'image fournie
    if (etatStr.includes('reçu') || etatStr.includes('recu')) return 'green';
    if (etatStr.includes('validée automatiquement') || etatStr.includes('valideeautomatiquement')) return 'orange';
    if (etatStr.includes('en révision') || etatStr.includes('enrevision')) return 'blue';
    if (etatStr.includes('traitée') || etatStr.includes('traitee')) return 'gray';
    
    return 'secondary';
  }

  
  getEtatAffichageFromCode(etatCode) {
    if (!etatCode) return 'État inconnu';
    
    const etatStr = etatCode.toString().toLowerCase();
    
    if (etatStr.includes('recu')) return 'Reçue';
    if (etatStr.includes('valideeautomatiquement')) return 'Validée automatiquement';
    if (etatStr.includes('enrevisionparagent')) return 'En révision par un agent';
    if (etatStr.includes('traitee')) return 'Traitée';
    
    // Si c'est déjà en français, le retourner tel quel
    if (etatStr.includes('reçu') || etatStr.includes('validée') || etatStr.includes('révision') || etatStr.includes('traitée')) {
      // Extraire juste le nom de l'état
      if (etatStr.includes('reçu')) return 'Reçue';
      if (etatStr.includes('validée automatiquement')) return 'Validée automatiquement';
      if (etatStr.includes('en révision par un agent')) return 'En révision par un agent';
      if (etatStr.includes('traitée')) return 'Traitée';
      return etatCode;
    }
    
    return 'État inconnu';
  }


  getMessageSpecifiqueForStatut(statut) {
    if (!statut) return '';
    
    const etat = statut.etat || '';
    const message = statut.message || '';
    
    // Si le message est déjà spécifique, le garder
    if (message && !message.includes('Déclaration') && !message.includes('Validation') && !message.includes('Examen') && !message.includes('traitée')) {
      return message;
    }
    
    // Sinon, utiliser les messages par défaut de l'image
    if (etat.includes('Recu') || etat.includes('Reçu')) {
      return 'Déclaration soumise';
    } else if (etat.includes('ValideeAutomatiquement') || etat.includes('Validée automatiquement')) {
      return 'Validation automatique terminée';
    } else if (etat.includes('EnRevisionParAgent') || etat.includes('En révision')) {
      return 'Examen par un agent en cours';
    } else if (etat.includes('Traitee') || etat.includes('Traitée')) {
      return 'Déclaration traitée et clôturée';
    }
    
    return message || '';
  }

  // Mapper les états pour les couleurs (version simplifiée)
  getStatusColor(etat) {
    return this.getColorForStatusFromEtat(etat);
  }

  // Mapper les badges avec les nouvelles couleurs
  getBadgeClass(statut, etatActuel) {
    if (!statut || !statut.etat) return 'text-bg-secondary';
    
    // Utiliser la couleur spécifique du statut
    const couleur = this.getColorForStatusFromEtat(statut.etat);
    
    // Mapper les couleurs aux classes Bootstrap
    const map = {
      'green': 'text-bg-success',
      'orange': 'text-bg-warning',
      'blue': 'text-bg-primary',
      'gray': 'text-bg-secondary',
      'success': 'text-bg-success',
      'warning': 'text-bg-warning',
      'primary': 'text-bg-primary',
      'secondary': 'text-bg-secondary'
    };
    
    return map[couleur] || 'text-bg-secondary';
  }

  // Obtenir l'icône pour un statut (comme dans l'image)
  getIconForStatut(statut) {
    if (!statut || !statut.etat) return '○';
    
    const etatStr = statut.etat.toString().toLowerCase();
    
    // Icônes selon l'image : ✓ pour "Reçue" et "Traitée", … pour "Validée", • pour "En révision"
    if (etatStr.includes('reçu') || etatStr.includes('recu') || etatStr.includes('traitee') || etatStr.includes('traitée')) {
      return '✓';
    } else if (etatStr.includes('valideeautomatiquement') || etatStr.includes('validée automatiquement')) {
      return '…';
    } else if (etatStr.includes('enrevision') || etatStr.includes('en révision')) {
      return '•';
    }
    
    return statut.icon || '○';
  }

  // NOUVEAU : Obtenir la classe Bootstrap pour une couleur
  getBootstrapColorClass(color) {
    const map = {
      'green': 'text-bg-success',
      'orange': 'text-bg-warning',
      'blue': 'text-bg-primary',
      'gray': 'text-bg-secondary',
      'success': 'text-bg-success',
      'warning': 'text-bg-warning',
      'primary': 'text-bg-primary',
      'secondary': 'text-bg-secondary'
    };
    return map[color] || 'text-bg-secondary';
  }

  // NOUVEAU : Vérifier si c'est l'état actuel
  isCurrentStatus(statutEtat, etatActuel) {
    if (!statutEtat || !etatActuel) return false;
    
    const statutNum = this.convertEtatToNumber(statutEtat);
    const actuelNum = this.convertEtatToNumber(etatActuel);
    
    return statutNum === actuelNum;
  }
}