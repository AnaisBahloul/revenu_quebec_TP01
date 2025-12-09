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

      const token = localStorage.getItem("token"); // peut être null si pas nécessaire
      const headers = token ? { "Authorization": `Bearer ${token}` } : {};

      const response = await fetch(`${this.baseURL}/declarations/user/${userId}`, {
        headers
      });

      if (!response.ok) {
        console.error("❌ Erreur API :", response.status);
        return [];
      }

      const declarations = await response.json();

      // Transformer les données backend en format frontend
      return declarations.map(d => ({
        declarationId: d.id,
        avisId: d.avis?.id || null,
        year: d.dateSoumission ? new Date(d.dateSoumission).getFullYear() : "—",
        status: this.mapStatus(d.etat),
        amount: d.avis?.amountPayable || d.avis?.amount || "—",
        title: d.avis?.title || '',
        incomeSummary: this.transformRevenus(d),
        fichiers: d.fichiers || []
      }));

    } catch (err) {
      console.error("💥 Erreur récupération déclarations:", err);
      return [];
    }
  }

  // Mapper le statut de l'API vers un texte lisible
  mapStatus(etatBackend) {
    const map = {
      0: "Reçue",
      1: "En validation automatique",
      2: "En révision par un agent",
      3: "Clôturée"
    };
    return map[etatBackend] || "En traitement";
  }

  // Transformer les revenus pour l'affichage
  transformRevenus(declaration) {
    if (!declaration) return [];

    const revenus = [];

    declaration.revenusEmploi?.forEach(r => {
      revenus.push({
        type: "Revenus d'emploi",
        description: r.employeur,
        amount: `${r.montant} $`
      });
    });

    declaration.autresRevenus?.forEach(r => {
      const typeMap = {
        1: "Revenus d'emploi",
        2: "Intérêts",
        3: "Placement",
        99: "Autre"
      };
      revenus.push({
        type: typeMap[r.type] || "Autre revenu",
        description: "",
        amount: `${r.montant} $`
      });
    });

    return revenus;
  }

  // Télécharger le PDF associé à l'avis
  async downloadPDF(avisId) {
    try {
      const token = localStorage.getItem("token"); // peut être null
      const headers = token ? { "Authorization": `Bearer ${token}` } : {};

      const response = await fetch(`${this.baseURL}/avis/${avisId}/pdf`, { headers });

      if (!response.ok) throw new Error('PDF non disponible');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `avis-${avisId}.pdf`;
      a.click();

    } catch (err) {
      console.error("Erreur téléchargement PDF:", err);
      alert("PDF non disponible pour cet avis");
    }
  }

  viewAvis(avisId) {
    window.location.href = `/avis/${avisId}`;
  }

  viewDeclaration(declarationId) {
    window.location.href = `/declaration/${declarationId}`;
  }
}
