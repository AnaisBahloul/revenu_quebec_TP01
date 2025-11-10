import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { SignupViewModel } from '../viewmodels/SignupViewModel';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SignupPage() {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    nom:'', prenom:'', dob:'', nas:'', email:'',
    password:'', confirmPassword:''
  });

  const navigate = useNavigate();
  const vm = new SignupViewModel();

  const goNext = () => {
    if(!form.email || !form.nas || !form.nom || !form.prenom || !form.dob){
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setStep(2);
  };

  const createAccount = async () => {
    if(form.password.length < 8){
      alert("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if(form.password !== form.confirmPassword){
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
    const success = await vm.signup(form);
    if(success) navigate('/');
    else alert("Erreur lors de la création du compte.");
  };

  return (
    <div style={{ display: 'flex',  minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <div className="card shadow-sm" style={{ width: '630px', maxWidth: '100%' }}>

        {/* Étape 1 */}
        {step === 1 && (
          <>
            <div className="card-header fw-semibold text-center">
              Créer un compte — Étape 1/2 : Informations de base
            </div>
            <div className="card-body d-flex flex-column gap-3">
              <div className="mb-3">
                <label className="form-label">Adresse courriel <span className="text-danger">*</span></label>
                <input type="email" className="form-control" placeholder="prenom.nom@email.com"
                  value={form.email}
                  onChange={e => setForm({...form, email:e.target.value})} />
              </div>

              <div className="mb-3">
                <label className="form-label">Numéro d’assurance sociale (NAS) <span className="text-danger">*</span></label>
                <input type="text" className="form-control" placeholder="123 456 789"
                  value={form.nas}
                  onChange={e => setForm({...form, nas:e.target.value})} />
              </div>

              <div className="row g-3 mb-3">
                <div className="col">
                  <label className="form-label">Prénom <span className="text-danger">*</span></label>
                  <input type="text" className="form-control"
                    value={form.prenom}
                    onChange={e => setForm({...form, prenom:e.target.value})} />
                </div>
                <div className="col">
                  <label className="form-label">Nom <span className="text-danger">*</span></label>
                  <input type="text" className="form-control"
                    value={form.nom}
                    onChange={e => setForm({...form, nom:e.target.value})} />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Date de naissance <span className="text-danger">*</span></label>
                <input type="date" className="form-control"
                  value={form.dob}
                  onChange={e => setForm({...form, dob:e.target.value})} />
              </div>

              <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>← Annuler</button>
                <button className="btn btn-primary" onClick={goNext}>Valider →</button>
              </div>
            </div>
          </>
        )}

        {/* Étape 2 */}
        {step === 2 && (
          <>
            <div className="card-header fw-semibold text-center">
              Créer un compte — Étape 2/2 : Choix du mot de passe
            </div>
            <div className="card-body d-flex flex-column gap-3">
              <div className="mb-3">
                <label className="form-label">Mot de passe <span className="text-danger">*</span></label>
                <input type="password" className="form-control" placeholder="Min 8 caractères"
                  value={form.password}
                  onChange={e => setForm({...form, password:e.target.value})} />
              </div>

              <div className="mb-3">
                <label className="form-label">Confirmer le mot de passe</label>
                <input type="password" className="form-control"
                  value={form.confirmPassword}
                  onChange={e => setForm({...form, confirmPassword:e.target.value})} />
              </div>

              <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-outline-secondary" onClick={() => setStep(1)}>← Précédent</button>
                <button className="btn btn-primary" onClick={createAccount}>Créer le compte</button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
