// src/views/DeclarationView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function DeclarationView() {
  const { id } = useParams(); // ID de la déclaration depuis l'URL
  const navigate = useNavigate();
  const [declaration, setDeclaration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState({});

  const typeRevenuOptions = [
    { value: 1, label: "Revenus d'emploi" },
    { value: 2, label: "Intérêts" },
    { value: 3, label: "Placement" },
    { value: 99, label: "Autre" },
  ];

  useEffect(() => {
  const userFromStorage = JSON.parse(localStorage.getItem('user')) || {};
  const normalizedUser = {
    nom: userFromStorage.nom || '',
    prenom: userFromStorage.prenom || '',
    nas: userFromStorage.nas || userFromStorage.NAS || '',
    dob: userFromStorage.dob || userFromStorage.DateNaissance || ''
  };
  setUserInfo(normalizedUser);
}, []);


  useEffect(() => {
    const fetchDeclaration = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5100/api/declarations/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Déclaration non trouvée');
        }

        const data = await response.json();
        setDeclaration(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDeclaration();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', background: '#f3f4f6', minHeight: '100vh' }}>
        <Navigation />
        <main className="container my-4 d-flex justify-content-center align-items-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </main>
      </div>
    );
  }

  if (error || !declaration) {
    return (
      <div style={{ display: 'flex', background: '#f3f4f6', minHeight: '100vh' }}>
        <Navigation />
        <main className="container my-4">
          <div className="alert alert-danger" role="alert">
            {error || 'Déclaration non trouvée'}
          </div>
          <button className="btn btn-outline-secondary" onClick={() => navigate('/dashboard')}>
            ← Retour au tableau de bord
          </button>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', background: '#f3f4f6', minHeight: '100vh' }}>
      <Navigation />
      <main className="container my-4">
        <div style={{ maxWidth: '630px', margin: '0 auto' }}>
          
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">Déclaration de revenus</h4>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/history')}>
              ← Retour
            </button>
          </div>

          {/* Badge d'état */}
          <div className="mb-4">
            <span className={`badge ${declaration.etatCode === 10 ? 'bg-success' : declaration.etatCode === 0 ? 'bg-warning' : 'bg-secondary'}`}>
              {declaration.etat || 'Inconnu'}
            </span>
            <small className="text-muted ms-2">
              {declaration.dateSoumission 
                ? `Soumise le ${new Date(declaration.dateSoumission).toLocaleDateString()}`
                : 'Non soumise'
              }
            </small>
          </div>

          {/* Card principale */}
          <div className="card shadow-sm" style={{ width: '630px', maxWidth: '100%' }}>
            <div className="card-header fw-semibold">Détails de la déclaration</div>
            <div className="card-body p-3">

              {/* Identité */}
              <div className="border rounded p-2 mb-2 bg-light">
                <h6 className="mb-1">Identité</h6>
                <p className="mb-1"><strong>Nom :</strong> {declaration.utilisateur?.nom || 'Non disponible'}</p>
                <p className="mb-1"><strong>Prénom :</strong> {declaration.utilisateur?.prenom || 'Non disponible'}</p>
                <p className="mb-1"><strong>NAS :</strong> {userInfo.nas || 'Non disponible'}</p>
<p className="mb-1"><strong>Date de naissance :</strong> {userInfo.dob || 'Non disponible'}</p>
              </div>

              {/* Coordonnées */}
              <div className="border rounded p-2 mb-2 bg-light">
                <h6 className="mb-1">Coordonnées</h6>
                <p className="mb-1"><strong>Adresse :</strong> {declaration.adresse || 'Non renseigné'}</p>
                <p className="mb-1"><strong>Email :</strong> {declaration.email || 'Non renseigné'}</p>
                <p className="mb-1"><strong>Téléphone :</strong> {declaration.telephone || 'Non renseigné'}</p>
                <p className="mb-1"><strong>Citoyenneté :</strong> {declaration.citoyennete || 'Non renseigné'}</p>
              </div>

              {/* Revenus côte à côte */}
              <div className="row g-2">
                {/* Revenus d'emploi */}
                <div className="col-12 col-md-6">
                  <div className="border rounded p-2 bg-light h-100">
                    <h6 className="mb-1">Revenus d'emploi</h6>
                    {declaration.revenusEmploi && declaration.revenusEmploi.length > 0 ? (
                      declaration.revenusEmploi.map((r, idx) => (
                        <div key={idx} className="border rounded p-1 mb-1">
                          <p className="mb-1"><strong>Employeur :</strong> {r.employeur || 'Non spécifié'}</p>
                          <p className="mb-1"><strong>Montant :</strong> {r.montant ? `${r.montant} CAD` : 'Non spécifié'}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted mb-0">Aucun revenu d'emploi déclaré</p>
                    )}
                  </div>
                </div>

                {/* Autres revenus */}
                <div className="col-12 col-md-6">
                  <div className="border rounded p-2 bg-light h-100">
                    <h6 className="mb-1">Autres revenus</h6>
                    {declaration.autresRevenus && declaration.autresRevenus.length > 0 ? (
                      declaration.autresRevenus.map((r, idx) => {
                        const typeLabel = typeRevenuOptions.find(opt => 
                          opt.value === parseInt(r.type) || opt.value.toString() === r.type?.toString()
                        )?.label || 'Non spécifié';
                        
                        return (
                          <div key={idx} className="border rounded p-1 mb-1">
                            <p className="mb-1"><strong>Type :</strong> {typeLabel}</p>
                            <p className="mb-1"><strong>Montant :</strong> {r.montant ? `${r.montant} CAD` : 'Non spécifié'}</p>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-muted mb-0">Aucun autre revenu déclaré</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Fichiers */}
              {declaration.fichiers && declaration.fichiers.length > 0 && (
                <div className="border rounded p-2 mb-2 bg-light">
                  <h6 className="mb-1">Pièces justificatives</h6>
                  <ul className="list-group list-group-flush">
                    {declaration.fichiers.map((f, idx) => (
                      <li key={idx} className="list-group-item d-flex justify-content-between align-items-center py-1">
                        <span>{f.nom}</span>
                        {f.url && (
                          <a href={f.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
                            Télécharger
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Confirmation (affichage seulement) */}
              <div className="border rounded p-2 mb-2 bg-light">
                <h6 className="mb-1">Confirmation</h6>
                <div className="d-flex align-items-center gap-2">
                  <span className="text-danger">*</span>
                  <div className="form-check m-0">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="confirmationCheckView"
                      checked={declaration.confirmationExactitude}
                      disabled
                    />
                    <label className="form-check-label" htmlFor="confirmationCheckView">
                      Je confirme que les renseignements fournis sont exacts.
                    </label>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}