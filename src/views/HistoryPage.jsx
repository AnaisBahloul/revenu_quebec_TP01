import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import { HistoryViewModel } from '../viewmodels/HistoryViewModel';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

export default function HistoryPage() {
  const vm = new HistoryViewModel();
  const [declarations, setDeclarations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await vm.getAllDeclarations();
      console.log("📊 Données après transformation:", data);
      setDeclarations(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Fonction pour colorer les statuts
  const getStatusBadge = (status) => {
    if (!status) return 'badge text-bg-secondary';

    const statusLower = status.toLowerCase();
    
    if (statusLower === 'brouillon') return 'badge text-bg-light border text-dark';
    if (statusLower === 'reçue') return 'badge text-bg-primary';
    if (statusLower === 'validée automatiquement') return 'badge text-bg-success';
    if (statusLower === 'en révision par un agent') return 'badge text-bg-warning';
    if (statusLower === 'traitée' || statusLower === 'traitée') return 'badge text-bg-info';
    
    return 'badge text-bg-secondary';
  };

  // Fonction pour colorer le montant
  const getAmountClass = (amount) => {
    if (!amount || amount === '—') return 'text-secondary';
    
    // Extraire le nombre du montant (ex: "1500 $" -> 1500)
    const match = amount.match(/([-]?\d+)/);
    if (!match) return 'text-secondary';
    
    const numeric = parseFloat(match[0]);
    
    if (numeric < 0) return 'text-danger fw-bold'; // à payer
    if (numeric > 0) return 'text-success fw-bold'; // à recevoir
    return 'text-secondary'; // zéro
  };

  // Formatage du montant pour l'affichage
  const formatAmount = (amount) => {
    if (!amount || amount === '—') return '—';
    
    // Si c'est déjà formaté, on garde
    if (typeof amount === 'string' && amount.includes('$')) {
      return amount;
    }
    
    // Sinon on formate
    const numeric = parseFloat(amount);
    if (isNaN(numeric)) return '—';
    
    return `${numeric.toFixed(2)} $`;
  };

  // Fonction pour afficher le statut avec des détails
  const renderStatus = (declaration) => {
    if (declaration.estBrouillon) {
      return "Brouillon";
    }
    return declaration.status;
  };

  // Fonction pour les actions disponibles
  const renderActions = (declaration) => {
    // Si c'est un brouillon
    if (declaration.estBrouillon) {
    return (
      <button
        className="btn btn-outline-warning btn-sm"
        style={{ minWidth: '120px' }}
        onClick={() => navigate('/declaration', { 
          state: { 
            step: declaration.currentStep || 4, // Utilise l'étape sauvegardée
            reset: false 
          } 
        })}
      >
        Continuer
      </button>
    );
  }

    // Si la déclaration a un avis
    if (declaration.avisId && declaration.avis) {
      return (
        <button
          className="btn btn-outline-primary btn-sm"
          style={{ minWidth: '120px' }}
          onClick={() => vm.viewAvis(declaration.avisId)}
        >
          Voir avis
        </button>
      );
    }

    // Si la déclaration est soumise mais pas encore traitée
    return (
      <button
        className="btn btn-outline-secondary btn-sm"
        style={{ minWidth: '120px' }}
         onClick={() => navigate(`/declaration/${declaration.declarationId}`)}
      >
        Voir déclaration
      </button>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', background: '#f3f4f6', minHeight: '100vh', justifyContent: 'center' }}>
        <Navigation />
        <div className="container my-4">
          <div className="text-center">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', background: '#f3f4f6', minHeight: '100vh', justifyContent: 'center' }}>
      <Navigation />

      <div className="container my-4">
        <h4 className="mb-4 text-center">Historique des déclarations</h4>

        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card shadow-sm" style={{ width: '630px', maxWidth: '100%' }}>
              <div className="card-body p-3">
                {declarations.length === 0 ? (
                  <div className="text-center">
                    <p className="text-muted">Aucune déclaration trouvée.</p>
                    <a href="/declaration" className="btn btn-primary btn-sm">
                      Créer une déclaration
                    </a>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped mb-0" style={{ fontSize: '0.9rem' }}>
                      <thead>
                        <tr>
                          <th>Année fiscale</th>
                          <th>Statut</th>
                          <th>Montant</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {declarations.map(d => (
                          <tr key={d.declarationId}>
                            <td>{d.year}</td>
                            <td>
                              <span className={getStatusBadge(renderStatus(d))}>
                                {renderStatus(d)}
                              </span>
                            </td>
                            <td className={getAmountClass(d.amount)}>
                              {formatAmount(d.amount)}
                            </td>
                            <td>
                              {renderActions(d)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {/* Section pour le brouillon en cours */}
                {declarations.some(d => d.estBrouillon) && (
                  <div className="alert alert-info mt-3 mb-0" role="alert">
                    <strong>💡 Vous avez un brouillon en cours</strong>
                    <br />
                    Cliquez sur "Continuer" pour reprendre votre déclaration là où vous vous étiez arrêté.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}