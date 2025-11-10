// src/viewmodels/DeclarationViewModel.js
export class DeclarationViewModel {
  constructor() {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    this.user = storedUser || {
      nom: 'Anaïs',
      prenom: 'Bahloul',
      nas: '123-456-789',
      dob: '2004-03-15',
      adresse: '',
      email: '',
      telephone: '',
      citoyennete: '',
      lastDeclarationStep: null // on ajoute ça
    };
  }

  saveDraft(form, step) {
    console.log('Draft saved:', form);
    alert('Brouillon enregistré');

    // 1️⃣ Sauvegarder le brouillon
    localStorage.setItem('draftDeclaration', JSON.stringify(form));

    // 2️⃣ Mettre à jour l'avancement dans l'utilisateur
    const updatedUser = { ...this.user, lastDeclarationStep: step };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    this.user = updatedUser; // mettre à jour l'objet courant
  }

  submitDeclaration(form) {
    console.log('Déclaration soumise:', form);
    alert('Déclaration soumise !');

    // On peut aussi réinitialiser le draft et la dernière étape
    localStorage.removeItem('draftDeclaration');
    const updatedUser = { ...this.user, lastDeclarationStep: null };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    this.user = updatedUser;
  }
}
