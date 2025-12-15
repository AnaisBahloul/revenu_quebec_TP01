// src/views/DeclarationPage.jsx
import React, { useState, useRef, useMemo, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { DeclarationViewModel } from '../viewmodels/DeclarationViewModel';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaTrash } from 'react-icons/fa';
import countryList from "react-select-country-list";
import Select from 'react-select';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export default function DeclarationPage() {

const vm = useMemo(() => new DeclarationViewModel(), []);
const fileInputRef = useRef(null);
const navigate = useNavigate();
const location = useLocation();
const initialStep = location.state?.step || 1;
const resetForm = location.state?.reset || false;

  const [step, setStep] = useState(initialStep);
  const [error, setError] = useState("");

useEffect(() => {
  if (resetForm) {
    handleCancel(); // réinitialise le formulaire si nouvelle déclaration
  }
}, [resetForm]);

  const [form, setForm] = useState({
    adresse: '',
    email: '',
    telephone: '',
    citoyennete: '',
    revenusEmploi: [],
    autresRevenus: [],
    fichiers: [],
    confirmationExactitude: false
  });


const options = useMemo(() => countryList().getLabels(), []);

useEffect(() => {
  const loadExistingDraft = async () => {
    try {
      const savedDraft = await vm.loadDraft();
      if (savedDraft && !resetForm) {
        setForm(savedDraft.form);
        setStep(savedDraft.step);
      }
    } catch (error) {
      console.error('Erreur chargement brouillon:', error);
    }
  };
  
  loadExistingDraft();
}, [vm, resetForm]);



function CountrySelect({ value, onChange, options }) {
  return (
    <Select
      options={options.map(c => ({ value: c, label: c }))}
      value={value ? { value, label: value } : null}
      onChange={(selected) => onChange(selected.value)}
      menuPlacement="bottom"  // force l'ouverture vers le bas
      styles={{
        menu: (provided) => ({ ...provided }), // limite la hauteur
      }}
      placeholder="Sélectionnez un pays"
      isSearchable
    />
  );
}


  const handleFileChange = (e) => {
    setForm({ ...form, fichiers: [...form.fichiers, ...Array.from(e.target.files)] });
  };

  // Validation étapes
  const validateStep1 = () => {
    if (!form.adresse || !form.email || !form.telephone || !form.citoyennete) {
      setError("Veuillez remplir les champs obligatoires.");
      return;
    }
    setError("");
    setStep(2);
  };

  const validateStep2 = () => {
  const firstEmploi = form.revenusEmploi[0];

  if (!firstEmploi.employeur.trim() || !firstEmploi.montant.trim()) {
    setError("Veuillez remplir tous les champs du revenu d'emploi obligatoire.");
    return;
  }

  setError("");
  setStep(3);
};


  const validateStep3 = () => {
    setError("");
    setStep(4);
  };

  const handleSave = async () => {
  const data = {
    ...form,
    revenus: [...form.revenusEmploi, ...form.autresRevenus],
  };
  try {
    await vm.saveDraft(data, step);
    navigate('/dashboard');
  } catch (error) {
    console.error('Erreur sauvegarde:', error);
  }
};

const handleSubmit = async () => {
  // Validation complète
  const errors = [];
  
  if (!form.adresse) errors.push("L'adresse est obligatoire");
  if (!form.email) errors.push("L'email est obligatoire");
  if (!form.telephone) errors.push("Le téléphone est obligatoire");
  if (!form.citoyennete) errors.push("La citoyenneté est obligatoire");
  
  // Vérifier au moins un revenu d'emploi rempli
  const hasRevenuEmploi = form.revenusEmploi.some(r => 
    r.employeur && r.employeur.trim() && r.montant
  );
  if (!hasRevenuEmploi) {
    errors.push("Au moins un revenu d'emploi est obligatoire");
  }
  
  if (!form.confirmationExactitude) {
    errors.push("Vous devez confirmer l'exactitude des informations");
  }
  
  if (errors.length > 0) {
    setError(errors.join(". "));
    return;
  }
  
  setError("");
  
  try {
    await vm.submitDeclaration(form);
    navigate('/dashboard', { 
      state: { 
        message: 'Déclaration soumise avec succès !',
        success: true 
      } 
    });
  } catch (error) {
    setError("Erreur lors de la soumission: " + error.message);
  }
};

  // Mise à jour d'un champ de revenu
const handleChange = (type, idx, key, value) => {
  const updated = [...form[type]];
  updated[idx][key] = value;
  setForm({ ...form, [type]: updated });
};


const handleCancel = async () => {
  // Vérifier s'il y a des données non sauvegardées
  const hasUnsavedChanges = 
    form.adresse || form.email || form.telephone || form.citoyennete ||
    form.revenusEmploi.some(r => r.employeur || r.montant) ||
    form.autresRevenus.some(r => r.type || r.montant) ||
    form.fichiers.length > 0;
  
  if (hasUnsavedChanges) {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir annuler ? " +
      "Toutes les modifications non sauvegardées seront perdues et le brouillon sera supprimé."
    );
    
    if (!confirmed) {
      return;
    }
  }
  
  try {
    const storedUser = JSON.parse(localStorage.getItem('user')) || {};
    const userId = storedUser.id || storedUser.utilisateurId;
    
    // Supprimer le brouillon du serveur
    if (userId) {
      const response = await fetch(`${vm.baseURL}/declarations/brouillon/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (response.ok) {
        console.log('Brouillon supprimé du serveur');
      }
    }
  } catch (error) {
    console.error('Erreur suppression brouillon serveur:', error);
  }
  
  // Réinitialiser
  setForm({
    adresse: '',
    email: '',
    telephone: '',
    citoyennete: '',
    revenusEmploi: [{ employeur: '', montant: '' }],
    autresRevenus: [{ type: '', montant: '' }],
    fichiers: [],
    confirmationExactitude: false
  });
  setError("");
  setStep(1);
  
  localStorage.removeItem('draftDeclaration');
  
  const updatedUser = { ...storedUser, lastDeclarationStep: null };
  localStorage.setItem('user', JSON.stringify(updatedUser));
  
  navigate('/dashboard');
};

const typeRevenuOptions = [
  { value: 1, label: "Revenus d'emploi" },
  { value: 2, label: "Intérêts" },
  { value: 3, label: "Placement" },
  { value: 99, label: "Autre" },
];


const addRevenuEmploi = () => {
  setForm({
    ...form,
    revenusEmploi: [...form.revenusEmploi, { employeur: '', montant: '' }],
  });
};

const removeRevenuEmploi = (idx) => {
  const updated = [...form.revenusEmploi];
  updated.splice(idx, 1);
  setForm({ ...form, revenusEmploi: updated });
};

const addAutreRevenu = () => {
  setForm({
    ...form,
    autresRevenus: [...form.autresRevenus, { type: '', montant: '' }],
  });
};

const removeAutreRevenu = (idx) => {
  const updated = [...form.autresRevenus];
  updated.splice(idx, 1);
  setForm({ ...form, autresRevenus: updated });
};


  return (
    <div style={{ display: 'flex', background: '#f3f4f6', minHeight: '100vh' }}>
      <Navigation />
      <main className="container my-4">
        <div style={{ maxWidth: '630px', margin: '0 auto' }}>

        <h4 className="text-center mb-4">Déclaration de revenus</h4>

        {/* ---------- Étape 1: Coordonnées / Identité ---------- */}
        {step === 1 && (
          <div className="card shadow-sm " style={{ width: '630px', maxWidth: '100%' }}>
            <div className="card-header fw-semibold">Coordonnées / Identité</div>
            <div className="card-body">
              <h6 className="mb-3">Identité </h6>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <input className="form-control" value={vm.user.nom} disabled />
                </div>
                <div className="col-md-6">
                  <input className="form-control" value={vm.user.prenom} disabled />
                </div>
                <div className="col-md-6">
                  <input className="form-control" value={vm.user.nas} disabled />
                </div>
                <div className="col-md-6">
                  <input className="form-control" value={vm.user.dob} disabled />
                </div>
              </div>

              <h6 className="mb-2">Contact <span className="text-danger">*</span></h6>
              <input
                className="form-control mb-2"
                placeholder="Adresse"
                value={form.adresse}
                onChange={(e) => setForm({ ...form, adresse: e.target.value })}
              />
              <input
                className="form-control mb-2"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                className="form-control mb-2"
                placeholder="Téléphone"
                value={form.telephone}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
              />
              <CountrySelect
  value={form.citoyennete}
  onChange={(val) => setForm({ ...form, citoyennete: val })}
  options={options}
/>



              {error && <p className="text-danger fw-bold">{error}</p>}
              
              <div className="d-flex justify-content-between mt-4 align-items-center">
  {/* Annuler à gauche */}
  <button className="btn btn-outline-secondary" onClick={() => navigate('/dashboard')}>
    ← Retour
  </button>

  {/* Sauvegarder au centre */}
  <button className="btn btn-outline-secondary" onClick={handleSave}>
    Sauvegarder
  </button>

  {/* Suivant / Envoyer à droite */}
  <button className="btn btn-outline-primary" onClick={validateStep1}>
    Suivant →
  </button>
</div>

            </div>
          </div>
        )}

{/* ---------- Étape 2: Revenus ---------- */}
{step === 2 && (
  <div className="card shadow-sm" style={{ width: '630px', maxWidth: '100%' }}>
    <div className="card-header fw-semibold">Revenus</div>
    <div className="card-body">

      {/* Revenus d'emploi */}
<h6>Revenus d'emploi <span className="text-danger">*</span></h6>
{form.revenusEmploi.length === 0 ? (
  // Si vide, afficher UNE SEULE ligne vide avec bouton +
  <div className="row g-3 mb-2 align-items-center">
    <div className="col-md-8">
      <input
        className="form-control"
        placeholder="Nom de l'employeur"
        value=""
        onChange={(e) => {
          // Crée un nouveau array avec une ligne
          setForm({
            ...form,
            revenusEmploi: [{ employeur: e.target.value, montant: '' }]
          });
        }}
      />
    </div>
    <div className="col-md-3">
      <input
        className="form-control"
        type="number"
        placeholder="Montant"
        value=""
        onChange={(e) => {
          setForm({
            ...form,
            revenusEmploi: [{ employeur: '', montant: e.target.value }]
          });
        }}
      />
    </div>
    <div className="col-md-1">
      <button className="btn btn-outline-success btn-sm" onClick={addRevenuEmploi}>
        +
      </button>
    </div>
  </div>
) : (
  // Si pas vide, afficher TOUTES les lignes avec la logique des boutons
  form.revenusEmploi.map((rev, idx) => (
    <div className="row g-3 mb-2 align-items-center" key={idx}>
      <div className="col-md-8">
        <input
          className="form-control"
          placeholder="Nom de l'employeur"
          value={rev.employeur}
          onChange={(e) => handleChange("revenusEmploi", idx, "employeur", e.target.value)}
        />
      </div>
      <div className="col-md-3">
        <input
          className="form-control"
          type="number"
          placeholder="Montant"
          value={rev.montant}
          onChange={(e) => handleChange("revenusEmploi", idx, "montant", e.target.value)}
        />
      </div>
      <div className="col-md-1 d-flex">
        {/* Bouton + SEULEMENT sur la PREMIÈRE ligne */}
        {idx === 0 && (
          <button className="btn btn-outline-success btn-sm me-1" onClick={addRevenuEmploi}>
            +
          </button>
        )}
        {/* Bouton - SEULEMENT si plus d'une ligne ET pas la première */}
        {form.revenusEmploi.length > 1 && idx > 0 && (
          <button className="btn btn-outline-danger btn-sm" onClick={() => removeRevenuEmploi(idx)}>
            x
          </button>
        )}
      </div>
    </div>
  ))
)}
      {/* Autres revenus */}
<h6 className="mt-3">Autres revenus</h6>
{form.autresRevenus.length === 0 ? (
  // Si vide, afficher UNE SEULE ligne vide avec bouton +
  <div className="row g-3 mb-2 align-items-center">
    <div className="col-md-8">
      <Select
        options={typeRevenuOptions}
        value={null}
        onChange={(e) => {
          // Crée un nouveau array avec une ligne
          setForm({
            ...form,
            autresRevenus: [{ type: e.value.toString(), montant: '' }]
          });
        }}
        placeholder="Sélectionnez un type"
      />
    </div>
    <div className="col-md-3">
      <input
        className="form-control"
        type="number"
        placeholder="Montant"
        value=""
        onChange={(e) => {
          setForm({
            ...form,
            autresRevenus: [{ type: '', montant: e.target.value }]
          });
        }}
      />
    </div>
    <div className="col-md-1">
      <button className="btn btn-outline-success btn-sm" onClick={addAutreRevenu}>
        +
      </button>
    </div>
  </div>
) : (
  // Si pas vide, afficher TOUTES les lignes avec la logique des boutons
  form.autresRevenus.map((rev, idx) => (
    <div className="row g-3 mb-2 align-items-center" key={idx}>
      <div className="col-md-8">
        <Select
          options={typeRevenuOptions}
          value={typeRevenuOptions.find(o => 
            o.value === parseInt(rev.type) || o.value.toString() === rev.type?.toString()
          ) || null}
          onChange={(e) => handleChange("autresRevenus", idx, "type", e.value)}
          placeholder="Sélectionnez un type"
        />
      </div>
      <div className="col-md-3">
        <input
          className="form-control"
          type="number"
          placeholder="Montant"
          value={rev.montant}
          onChange={(e) => handleChange("autresRevenus", idx, "montant", e.target.value)}
        />
      </div>
      <div className="col-md-1 d-flex">
        {/* Bouton + SEULEMENT sur la PREMIÈRE ligne */}
        {idx === 0 && (
          <button className="btn btn-outline-success btn-sm me-1" onClick={addAutreRevenu}>
            +
          </button>
        )}
        {/* Bouton - SEULEMENT si plus d'une ligne ET pas la première */}
        {form.autresRevenus.length > 1 && idx > 0 && (
          <button className="btn btn-outline-danger btn-sm" onClick={() => removeAutreRevenu(idx)}>
            x
          </button>
        )}
      </div>
    </div>
  ))
)}

      {error && <p className="text-danger fw-bold mt-2">{error}</p>}

      <div className="d-flex justify-content-between mt-4 align-items-center">
                  <button className="btn btn-outline-secondary" onClick={() => setStep(1)}>
    ← Précédent
  </button>
                  <button className="btn btn-outline-secondary mx-auto" onClick={handleSave}>Sauvegarder</button>
                  <button className="btn btn-outline-primary" onClick={validateStep2}>Suivant →</button>
                </div>

    </div>
  </div>
)}




        {/* ---------- Étape 3: Pièces justificatives ---------- */}
        {step === 3 && (
          <div className="card shadow-sm" style={{ width: '630px', maxWidth: '100%' }}>
            <div className="card-header fw-semibold">Pièces justificatives</div>
            <div className="card-body">
              <div className="border rounded p-4 bg-white d-flex justify-content-between align-items-center mb-3">
                <strong>Ajouter un fichier</strong>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => fileInputRef.current.click()}
                >
                  Parcourir…
                </button>
                <input
                  type="file"
                  multiple
                  hidden
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>

              <ul className="list-group list-group-flush">
                {form.fichiers.map((f, idx) => (
                  <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                    {f.name || f.originalName}
                    <FaTrash
                      style={{ cursor: 'pointer', color: 'red' }}
                      onClick={() => {
                        const newFiles = [...form.fichiers];
                        newFiles.splice(idx, 1);
                        setForm({ ...form, fichiers: newFiles });
                      }}
                    />
                  </li>
                ))}
              </ul>

              <div className="d-flex justify-content-between mt-4 align-items-center">
                  <button className="btn btn-outline-secondary" onClick={() => setStep(2)}>
    ← Précédent
  </button>
                  <button className="btn btn-outline-secondary mx-auto" onClick={handleSave}>Sauvegarder</button>
                  <button className="btn btn-outline-primary" onClick={validateStep3}>Suivant →</button>
                </div>
            </div>
          </div>
        )}

        {/* ---------- Étape 4: Revue & Confirmation ---------- */}
{step === 4 && (
  <div className="card shadow-sm" style={{ width: '630px', maxWidth: '100%' }}>
    <div className="card-header fw-semibold">Revue & Confirmation</div>
    <div className="card-body p-3"> {/* réduit padding général */}

      {/* Identité */}
      <div className="border rounded p-2 mb-2 bg-light"> {/* p-3 -> p-2, mb-3 -> mb-2 */}
        <h6 className="mb-1">Identité</h6>
        <p className="mb-1"><strong>Nom :</strong> {vm.user.nom}</p>
        <p className="mb-1"><strong>Prénom :</strong> {vm.user.prenom}</p>
        <p className="mb-1"><strong>NAS :</strong> {vm.user.nas}</p>
        <p className="mb-1"><strong>Date de naissance :</strong> {vm.user.dob}</p>
      </div>

      {/* Coordonnées */}
      <div className="border rounded p-2 mb-2 bg-light">
        <h6 className="mb-1">Coordonnées</h6>
        <p className="mb-1"><strong>Adresse :</strong> {form.adresse}</p>
        <p className="mb-1"><strong>Email :</strong> {form.email}</p>
        <p className="mb-1"><strong>Téléphone :</strong> {form.telephone}</p>
        <p className="mb-1"><strong>Citoyenneté :</strong> {form.citoyennete}</p>
      </div>

      {/* Revenus côte à côte */}
      <div className="row g-2"> {/* g-3 -> g-2 pour moins d’espace */}
        {/* Revenus d'emploi */}
        <div className="col-12 col-md-6">
          <div className="border rounded p-2 bg-light h-100">
            <h6 className="mb-1">Revenus d'emploi</h6>
            {form.revenusEmploi.map((r, idx) => (
              <div key={idx} className="border rounded p-1 mb-1">
                <p className="mb-1"><strong>Employeur :</strong> {r.employeur}</p>
                <p className="mb-1"><strong>Montant :</strong> {r.montant} CAD</p>
              </div>
            ))}
          </div>
        </div>

        {/* Autres revenus */}
        <div className="col-12 col-md-6">
          <div className="border rounded p-2 bg-light h-100">
            <h6 className="mb-1">Autres revenus</h6>
            {/* Autres revenus dans l'étape 4 */}
{form.autresRevenus.map((r, idx) => {
  const typeLabel = typeRevenuOptions.find(opt => opt.value.toString() === r.type?.toString())?.label || 'Non spécifié';
  return (
    <div key={idx} className="border rounded p-1 mb-1">
      <p className="mb-1"><strong>Type :</strong> {typeLabel}</p>
      <p className="mb-1"><strong>Montant :</strong> {r.montant} CAD</p>
    </div>
  );
})}
          </div>
        </div>
      </div>

      {/* Fichiers */}
      {form.fichiers.length > 0 && (
        <div className="border rounded p-2 mb-2 bg-light">
          <h6 className="mb-1">Pièces justificatives</h6>
          <ul className="list-group list-group-flush">
            {form.fichiers.map((f, idx) => (
              <li key={idx} className="list-group-item d-flex justify-content-between align-items-center py-1">
                {f.name}
                
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Confirmation */}
      <div className="d-flex align-items-center gap-2 mb-2">
        <span className="text-danger">*</span>
        <div className="form-check m-0">
          <input
            type="checkbox"
            className="form-check-input"
            id="confirmationCheck"
            checked={form.confirmationExactitude}
            onChange={(e) => setForm({ ...form, confirmationExactitude: e.target.checked })}
          />
          <label className="form-check-label" htmlFor="confirmationCheck">
            Je confirme que les renseignements fournis sont exacts.
          </label>
        </div>
      </div>

      {error && <p className="text-danger fw-bold mb-2">{error}</p>}

      {/* Boutons */}
      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-outline-secondary btn-sm" onClick={() => setStep(3)}>
          ← Précédent
        </button>
        <button className="btn btn-outline-danger btn-sm" onClick={handleCancel}>Annuler</button>
        <button className="btn btn-outline-success btn-sm" onClick={handleSubmit}>Soumettre</button>
      </div>

    </div>
  </div>
)}


        </div>
      </main>
    </div>
  );
}



 
