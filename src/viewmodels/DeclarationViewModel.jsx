// src/viewmodels/DeclarationViewModel.js
export class DeclarationViewModel {
  constructor() {
    // Récupérer tout l'objet user depuis localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));

    // Si rien n'est trouvé, fournir des valeurs par défaut
    this.user = storedUser || {
      nom: 'Anaïs',
      prenom: 'Bahloul',
      nas: '123-456-789',
      dob: '2004-03-15',
      adresse: '',
      email: '',
      telephone: '',
      citoyennete: ''
    };
  }

  saveDraft(form) {
    console.log('Draft saved:', form);
    alert('Brouillon enregistré');

    // Pour sauvegarder côté client : mettre à jour localStorage si tu veux
    localStorage.setItem('draftDeclaration', JSON.stringify(form));
  }

  submitDeclaration(form) {
    console.log('Déclaration soumise:', form);
    alert('Déclaration soumise !');

    // Ici tu peux envoyer form vers le serveur via fetch/axios
  }
}
