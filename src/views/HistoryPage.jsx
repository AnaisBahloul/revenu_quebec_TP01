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

  return (
    <div style={{ display: 'flex', background: '#f3f4f6', minHeight: '100vh', justifyContent: 'center' }}>
      <Navigation />

      <div className="container my-4">
        {/* TITRE HORS CARTE */}
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
                            <td>{d.status}</td>
                            <td>{d.amount}</td>
                            <td>
                              <button
                                className="btn btn-outline-primary btn-sm me-2"
                                onClick={() => vm.viewAvis(d.avisId)}
                              >
                                Voir
                              </button>
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => vm.downloadPDF(d.avisId)}
                              >
                                Télécharger
                              </button>
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
