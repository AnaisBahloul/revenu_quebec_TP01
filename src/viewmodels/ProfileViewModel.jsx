// ProfileViewModel.js
export class ProfileViewModel {
  constructor(baseURL = 'http://localhost:5100/api') {
    this.baseURL = baseURL;
  }

  async getProfile() {
    try {
      // 1. Récupère l'ID depuis localStorage
      const storedUser = JSON.parse(localStorage.getItem('user')) || {};
      const userId = storedUser.id;
      
      if (!userId) {
        console.error('❌ Aucun ID utilisateur trouvé');
        throw new Error('Utilisateur non connecté');
      }
      
      console.log('📡 Récupération profil ID:', userId);
      
      // 2. Appelle l'API pour avoir les DONNÉES FRAÎCHES
      const response = await fetch(`${this.baseURL}/utilisateurs/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        console.error('❌ Erreur API:', response.status);
        throw new Error('Profil non trouvé');
      }
      
      const user = await response.json();
      console.log('✅ Données fraîches API:', user);
      
      // 3. Retourne les données formatées
      return {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        nas: user.nas,
        dob: user.dateNaissance,
        email: user.courriel,
        adresse: user.adresse || '',
        telephone: user.telephone || ''
      };
      
    } catch (error) {
      console.error('🔥 Erreur récupération profil:', error);
      
      // 4. Fallback: données locales SI API échoue
      const storedUser = JSON.parse(localStorage.getItem('utilisateur')) || {};
      return {
        id: storedUser.id,
        nom: storedUser.nom || 'Non renseigné',
        prenom: storedUser.prenom || 'Non renseigné',
        nas: storedUser.nas || 'Non renseigné',
        dob: storedUser.dob || 'Non renseigné',
        email: storedUser.email || storedUser.courriel || 'Non renseigné',
        adresse: storedUser.adresse || '',
        telephone: storedUser.telephone || ''
      };
    }
  }

  async updateProfile(field, value) {
  try {
    // 1. Récupère l'utilisateur actuel
    const storedUser = JSON.parse(localStorage.getItem('user')) || {};
    const userId = storedUser.id;

    if (!userId) throw new Error('Non connecté');

    // 2. Prépare le payload complet avec tous les champs obligatoires
    const updateData = {
      Courriel: storedUser.email || storedUser.courriel || '',
      Adresse: storedUser.adresse || '',
      Telephone: storedUser.telephone || ''
    };

    // 3. Mets à jour le champ modifié
    if (field === 'email') updateData.Courriel = value;
    if (field === 'adresse') updateData.Adresse = value;
    if (field === 'telephone') updateData.Telephone = value;

    console.log("📡 Envoi JSON exact :", updateData);
    console.log("🟡 [updateProfile] ID:", userId);

    // 4. Appel API
    const response = await fetch(`${this.baseURL}/utilisateurs/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updateData)
    });

    console.log("🟡 [updateProfile] Status API:", response.status);
    console.log("🟡 [updateProfile] Réponse API:", await response.clone().text());

    if (!response.ok) throw new Error(await response.text());

    // 5. Met à jour localStorage avec les nouvelles valeurs
    storedUser.email = updateData.Courriel;
    storedUser.adresse = updateData.Adresse;
    storedUser.telephone = updateData.Telephone;
    localStorage.setItem('user', JSON.stringify(storedUser));

    return true;
  } catch (err) {
    console.error('🔥 updateProfile error:', err);
    return false;
  }
}


}