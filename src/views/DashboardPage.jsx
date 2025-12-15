// src/views/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import { DashboardViewModel } from '../viewmodels/DashboardViewModel';
import { AvisViewModel } from '../viewmodels/AvisViewModel';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function DashboardPage() {
  const dashboardVM = new DashboardViewModel();
  const avisVM = new AvisViewModel();
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    nom: '',
    hasBrouillon: false,  
    declarationStatus: '',
    lastDeclarationStep: null,
    alerts: [],
    avis: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const summaryData = await dashboardVM.getUserSummary();
      const avisData = await avisVM.getAllAvis();
      setSummary({ ...summaryData, avis: avisData });
    };
    fetchData();
  }, []);

  const handleDeclarationClick = (action) => {
  if (action === 'poursuivre') {
    navigate('/declaration', { state: { step: summary.lastDeclarationStep } });
  } else {
    handleNewDeclaration();
  }
};

const handleNewDeclaration = async () => {
  // Une seule confirmation
  if (summary.hasBrouillon) {
     const confirmed = window.confirm(
      "Vous avez une déclaration en cours non terminée.\n\n" +
      "Voulez-vous vraiment commencer une nouvelle déclaration ?\n" +
      "La déclaration en cours sera supprimée et ne pourra pas être récupérée."
    );
    
    if (!confirmed) {
      return;
    }
  }

   const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  
  try {
    const storedUser = JSON.parse(localStorage.getItem('user')) || {};
    const userId = storedUser.id || storedUser.utilisateurId;
    
    // Supprimer l'ancien brouillon
    if (userId && summary.hasBrouillon) {
      const response = await fetch(`${dashboardVM.baseURL}/declarations/brouillon/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (response.ok) {
        console.log('Ancien brouillon supprimé');
      }
    }
  } catch (error) {
    console.error('Erreur suppression brouillon:', error);
  }
  
  // Nettoyer et naviguer
  localStorage.removeItem('draftDeclaration');
  const updatedUser = { ...storedUser, lastDeclarationStep: null };
  localStorage.setItem('user', JSON.stringify(updatedUser));
  
  navigate('/declaration', { state: { step: 1, reset: true } });
};


  return (
    <div style={{ display: 'flex', background: '#f3f4f6', minHeight: '100vh', justifyContent: 'center' }}>
      <Navigation />

      <div className="container my-4">

        {/* TITRE HORS CARTE */}
        <h4 className="text-center mb-4">Bienvenue {summary.nom}</h4>

        {/* WRAPPER QUI LIMITE LA LARGEUR DU DASHBOARD */}
        <div style={{ maxWidth: '630px', margin: '0 auto' }}>

          <div className="row g-4">

  {/* Déclaration */}
<div className="col-12 col-md-6">
  <div className="card shadow-sm">
    <div className="card-body d-flex flex-column gap-2">
      <h5 className="fw-semibold">Déclaration</h5>
      <p className="text-secondary small mb-2">
  {summary.hasBrouillon
    ? `Déclaration en cours, arrivée à l'étape ${summary.lastDeclarationStep}.`
    : 'Commencer une nouvelle déclaration en 3 étapes.'}
</p>


      {summary.hasBrouillon ? (
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => handleDeclarationClick('poursuivre')}
          >
            Poursuivre
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => handleDeclarationClick('nouvelle')}
          >
            Nouvelle déclaration
          </button>
        </div>
      ) : (
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => handleDeclarationClick('nouvelle')}
        >
          Nouvelle déclaration
        </button>
      )}
    </div>
  </div>
</div>


  {/* Suivi */}
  <div className="col-12 col-md-6">
    <div className="card shadow-sm">
      <div className="card-body d-flex flex-column gap-2">
        <h5 className="fw-semibold">Suivi</h5>
        <p className="text-secondary small mb-2">
          État actuel : <span className="badge text-bg-warning">{summary.declarationStatus || 'Aucune'}</span>
        </p>
        <button className="btn btn-outline-primary" onClick={() => navigate('/status')}>
          Voir le suivi
        </button>
      </div>
    </div>
  </div>

  {/* Historique */}
  <div className="col-12 col-md-6">
    <div className="card shadow-sm">
      <div className="card-body d-flex flex-column gap-2">
        <h5 className="fw-semibold">Historique</h5>
        <p className="text-secondary small mb-2">
          Consulter vos déclarations antérieures.
        </p>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/history')}>
          Voir l'historique
        </button>
      </div>
    </div>
  </div>

  {/* Avis */}
  <div className="col-12 col-md-6">
    <div className="card shadow-sm">
      <div className="card-body d-flex flex-column gap-2">
        <h5 className="fw-semibold">Avis</h5>
        <p className="text-secondary small mb-2">
          Consulter vos avis de cotisation.
        </p>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/avis')}>
          Voir les avis
        </button>
      </div>
    </div>
  </div>

</div>

        </div>

      </div>
    </div>
  );
}
