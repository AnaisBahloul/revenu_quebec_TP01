// src/views/DeclarationPage.jsx
import React, { useState, useRef } from 'react';
import Navigation from '../components/Navigation';
import { DeclarationViewModel } from '../viewmodels/DeclarationViewModel';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaTrash } from 'react-icons/fa';

export default function DeclarationPage() {
  const vm = new DeclarationViewModel();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    adresse: '',
    email: '',
    telephone: '',
    citoyennete: '',
    revenusEmploi: { employeur: '', montant: '' },
    autresRevenus: { placement: '', autres: '' },
    fichiers: [],
    confirmationExactitude: false
  });

  const handleFileChange = (e) => {
    setForm({ ...form, fichiers: [...form.fichiers, ...Array.from(e.target.files)] });
  };

  const validateStep1 = () => {
    if (!form.adresse || !form.email || !form.telephone || !form.citoyennete) {
      setError("Veuillez remplir les champs obligatoires.");
      return;
    }
    setError("");
    setStep(2);
  };

  const validateStep2 = () => {
    const r = form.revenusEmploi;
    const a = form.autresRevenus;
    if (!r.employeur || !r.montant) {
      setError("Veuillez remplir les champs du revenu d'emploi.");
      return;
    }
    setError("");
    setStep(3);
  };

  const validateStep3 = () => {
    setError("");
    setStep(4);
  };

  const handleSubmit = () => {
    if (!form.confirmationExactitude) {
      setError("Vous devez confirmer l'exactitude.");
      return;
    }
    setError("");
    const data = {
      ...form,
      revenus: [form.revenusEmploi, form.autresRevenus],
    };
    vm.submitDeclaration(data);
  };

  return (
    <div style={{ display: 'flex', background: '#f3f4f6', minHeight: '100vh' }}>
      <Navigation />

      <main className="container my-4">

        <ol className="breadcrumb mb-4">
          <li className={`breadcrumb-item ${step === 1 && 'active'}`}>Coordonnées / Identité</li>
          <li className={`breadcrumb-item ${step === 2 && 'active'}`}>Revenus</li>
          <li className={`breadcrumb-item ${step === 3 && 'active'}`}>Justificatifs</li>
          <li className={`breadcrumb-item ${step === 4 && 'active'}`}>Revue & Confirmation</li>
        </ol>

        <h4 className="text-center mb-4">Déclaration de revenus</h4>

        {/* ---------- Étape 1: Coordonnées / Identité ---------- */}
        {step === 1 && (
          <div className="card shadow-sm">
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
              <input
                className="form-control mb-3"
                placeholder="Citoyenneté"
                value={form.citoyennete}
                onChange={(e) => setForm({ ...form, citoyennete: e.target.value })}
              />

              {error && <p className="text-danger fw-bold">{error}</p>}

              <div className="d-flex justify-content-end">
                <button className="btn btn-primary" onClick={validateStep1}>
                  Suivant →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------- Étape 2: Revenus ---------- */}
        {step === 2 && (
          <div className="card shadow-sm">
            <div className="card-header fw-semibold">Revenus</div>
            <div className="card-body">

              <h6>Revenus d'emploi <span className="text-danger">*</span></h6>
              <div className="row g-3 mb-3">
                <div className="col-md-8">
                  <input
                    className="form-control"
                    placeholder="Nom de l'employeur"
                    value={form.revenusEmploi.employeur}
                    onChange={(e) =>
                      setForm({ ...form, revenusEmploi: { ...form.revenusEmploi, employeur: e.target.value } })
                    }
                  />
                </div>
                <div className="col-md-4">
                  <input
                    className="form-control"
                    type="number"
                    placeholder="0.00"
                    value={form.revenusEmploi.montant}
                    onChange={(e) =>
                      setForm({ ...form, revenusEmploi: { ...form.revenusEmploi, montant: e.target.value } })
                    }
                  />
                </div>
              </div>

              <h6>Autres revenus</h6>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Revenus de placement"
                    value={form.autresRevenus.placement}
                    onChange={(e) =>
                      setForm({ ...form, autresRevenus: { ...form.autresRevenus, placement: e.target.value } })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Autres"
                    value={form.autresRevenus.autres}
                    onChange={(e) =>
                      setForm({ ...form, autresRevenus: { ...form.autresRevenus, autres: e.target.value } })
                    }
                  />
                </div>
              </div>

              {error && <p className="text-danger fw-bold">{error}</p>}

              <div className="d-flex justify-content-between">
                <button className="btn btn-outline-secondary" onClick={() => setStep(1)}>
                  ← Précédent
                </button>
                <button className="btn btn-primary" onClick={validateStep2}>
                  Suivant →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------- Étape 3: Pièces justificatives ---------- */}
{step === 3 && (
  <div className="card shadow-sm">
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
            {f.name}
            <FaTrash
              style={{ cursor: 'pointer', color: 'red' }}
              onClick={() => {
                const newFiles = [...form.fichiers];
                newFiles.splice(idx, 1); // supprime le fichier
                setForm({ ...form, fichiers: newFiles });
              }}
            />
          </li>
        ))}
      </ul>

      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-outline-secondary" onClick={() => setStep(2)}>
          ← Précédent
        </button>
        <button className="btn btn-primary" onClick={validateStep3}>
          Suivant →
        </button>
      </div>
    </div>
  </div>
)}

        {/* ---------- Étape 4: Revue & Confirmation ---------- */}
        {step === 4 && (
          <div className="card shadow-sm">
            <div className="card-header fw-semibold">Revue & Confirmation</div>
            <div className="card-body">
              <ul>
                <li><strong>Identité :</strong> {vm.user.prenom} {vm.user.nom}, NAS: {vm.user.nas}</li>
                <li><strong>Adresse :</strong> {form.adresse}</li>
                <li><strong>Revenus :</strong> Emploi: {form.revenusEmploi.montant} CAD, Placements: {form.autresRevenus.placement} CAD, Autres: {form.autresRevenus.autres} CAD</li>
              </ul>
              
             <div className="d-flex align-items-center gap-2 mt-3">
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
      Je confirme que les renseignements fournis sont exacts
    </label>
  </div>
</div>


              {error && <p className="text-danger fw-bold mt-2">{error}</p>}

              <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-outline-secondary" onClick={() => setStep(3)}>
                  ← Précédent
                </button>
                <button className="btn btn-success" onClick={handleSubmit}>
                  Envoyer la déclaration
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
