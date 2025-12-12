// src/viewmodels/HistoryViewModel.js
export class HistoryViewModel {
  constructor(baseURL = 'http://localhost:5100/api') {
    this.baseURL = baseURL;
  }

  // Récupérer toutes les déclarations pour l'utilisateur connecté
  async getAllDeclarations() {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user")) || {};
      const userId = storedUser.id;

      if (!userId) {
        console.warn("⚠️ Aucun utilisateur trouvé dans localStorage");
        return [];
      }

      const response = await fetch(`${this.baseURL}/declarations/user/${userId}`);

      if (!response.ok) {
        console.error("❌ Erreur API :", response.status);
        return [];
      }

      const declarations = await response.json();

      // Transformer les données
      return declarations.map(d => {
        // Déterminer l'année fiscale
        let year = "—";
        if (d.dateSoumission) {
          year = new Date(d.dateSoumission).getFullYear();
        } else if (d.avis?.year) {
          year = d.avis.year;
        }

        // Déterminer le montant
        let amount = "—";
        if (d.avis) {
          // Priorité à amountPayable, sinon amount
          amount = d.avis.amountPayable || d.avis.amount || "—";
        }

        // Déterminer le statut
        let status = d.etat || "En traitement";
        
        return {
          declarationId: d.id,
          avisId: d.avisId,
          avis: d.avis,
          year: year,
          status: status,
          statusCode: d.etatCode,
          amount: amount,
          estBrouillon: d.estBrouillon,
        };
      });

    } catch (err) {
      console.error("💥 Erreur récupération déclarations:", err);
      return [];
    }
  }

  viewAvis(avisId) {
    window.location.href = `/avis/${avisId}`;
  }

  viewDeclaration(declarationId) {
    window.location.href = `/declaration/${declarationId}`;
  }
}