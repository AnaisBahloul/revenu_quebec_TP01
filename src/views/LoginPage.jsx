import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginViewModel } from '../viewmodels/LoginViewModel';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const vm = new LoginViewModel();

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await vm.login(email, password);
    if (success) navigate('/dashboard');
    else alert('Email ou mot de passe incorrect.');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <div className="card shadow-sm" style={{ width: '630px', maxWidth: '100%' }}>
        {/* TITRE DANS LA CARTE */}
        <div className="card-header fw-semibold text-center">
          Connexion
        </div>

        <div className="card-body d-flex flex-column gap-3">
          <p className="text-secondary small mb-3">
            Déjà un compte? Connectez-vous ici. Première visite? <a href="/signup">Créer un compte</a>.
          </p>

          <form onSubmit={handleLogin} noValidate>
            <div className="mb-3">
              <label className="form-label">Courriel</label>
              <input
                type="email"
                className="form-control"
                placeholder="prenom.nom@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                className="form-control"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary btn-sm">
                Connexion
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
