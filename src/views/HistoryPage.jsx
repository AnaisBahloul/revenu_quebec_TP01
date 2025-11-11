import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import { HistoryViewModel } from '../viewmodels/HistoryViewModel';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function HistoryPage() {
  const vm = new HistoryViewModel();
  const [declarations, setDeclarations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await vm.fetchDeclarations();
      setDeclarations(data);
    };
    fetchData();
  }, []);

  // Fonction pour colorer les statuts
  const getStatusBadge = (status) => {
    if (!status) return 'badge text-bg-secondary';

    switch (status.toLowerCase()) {
      case 'traitée':
      case 'validée':
      case 'traitée automatiquement':
      case 'traitée avec révision':
        return 'badge text-bg-success'; // vert
      case 'en validation':
      case 'en validation automatique':
        return 'badge text-bg-warning'; // jaune
    
      case 'révision par un agent':
        return 'badge text-bg-info'; // bleu
      case 'erreur':
      case 'erreur de données':
      case 'incohérence':
        return 'badge text-bg-danger'; // rouge
      default:
        return 'badge text-bg-secondary'; // gris
    }
  };

  // Fonction pour colorer le montant
  const getAmountClass = (amount) => {
  if (!amount || amount === '—') return 'text-secondary';
  const numeric = parseFloat(amount.replace(/\s|\$/g, '')); // supprime espaces et $
  if (numeric < 0) return 'text-danger'; // à payer
  if (numeric > 0) return 'text-success'; // à recevoir
  return 'text-secondary'; // zéro ou non défini
};


  return (
    <div style={{ display: 'flex', background: '#f3f4f6', minHeight: '100vh', justifyContent: 'center' }}>
      <Navigation />

      <div className="container my-4">
        <h4 className="mb-4 text-center">Historique des déclarations</h4>

        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card shadow-sm" style={{ width: '630px', maxWidth: '100%' }}>
              <div className="card-body p-3">
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
                      {declarations.length > 0 ? (
                        declarations.map(d => (
                          <tr key={d.avisId}>
                            <td>{d.year}</td>
                            <td>
                              <span className={getStatusBadge(d.status)}>
                                {d.status}
                              </span>
                            </td>
                            <td className={getAmountClass(d.amount)}>
                              {d.amount === '—' ? '—' : d.amount}
                            </td>
                            <td>
  {['traitée', 'validée', 'traitée automatiquement', 'traitée avec révision'].includes(d.status.toLowerCase()) && (
    <button
      className="btn btn-outline-primary btn-sm me-2"
      style={{ minWidth: '120px' }}
      onClick={() => vm.viewAvis(d.avisId)}
    >
      Voir avis
    </button>
  )}
  {['en traitement', 'en validation', 'en validation automatique', 'en révision par un agent'].includes(d.status.toLowerCase()) && (
    <button
      className="btn btn-outline-secondary btn-sm"
      style={{ minWidth: '120px' }}
      onClick={() => vm.viewRevue(d.avisId)}
    >
      Voir déclaration
    </button>
  )}
</td>

                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center">Aucune déclaration trouvée.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
