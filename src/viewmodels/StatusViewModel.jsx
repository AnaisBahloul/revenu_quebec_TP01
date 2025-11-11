export class StatusViewModel {
  async fetchCurrentStatus() {
    return {
      etat: "En révision par un agent",
      dateSoumission: "2025-11-10",
      messages: "Votre dossier est en analyse.",
      
      // NOUVELLES DATES PAR ÉTAPE
      dateRecu: "2025-11-09",
      dateValidationAuto: "2025-11-09 14:32",
      dateRevisionAgent: "2025-11-10 08:10"
    };
  }
}
