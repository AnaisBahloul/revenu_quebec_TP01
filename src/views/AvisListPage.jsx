// src/views/AvisListPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { AvisViewModel } from '../viewmodels/AvisViewModel';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AvisListPage() {
  const [avisList, setAvisList] = useState([]);
  const vm = new AvisViewModel();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvis = async () => {
      const data = await vm.getAllAvis();
      setAvisList(data);
    };
    fetchAvis();
  }, []);

  return (
    <div style={{ display: 'flex', background: '#f3f4f6', minHeight: '100vh', justifyContent: 'center' }}>
      <Navigation />

      <div className="container my-4">
        <div className="row justify-content-center">
          <div className="col-12">
            <h4 className="text-center mb-4">Avis de cotisation</h4>

            {avisList.length === 0 ? (
              <p className="text-secondary small text-center">Aucun avis disponible.</p>
            ) : (
              avisList.map((avis) => (
                <div key={avis.id} className="mb-3">
                  <div className="card shadow-sm" style={{ width: '630px', maxWidth: '100%' }}>
                    <div
                      className="card-body d-flex justify-content-between align-items-center"
                      style={{ flexWrap: 'wrap' }}
                    >
                      <div>
                        <span style={{ fontWeight: 600, color: '#003366', fontSize: '1rem' }}>
                          {avis.title}
                        </span>
                        <span
                          className={`badge ms-2 ${
                            avis.type === 'automatique' ? 'text-bg-primary' : 'text-bg-secondary'
                          }`}
                        >
                          {avis.type === 'automatique' ? 'Automatisé' : 'Personnalisé'}
                        </span>
                        <div className="text-secondary small mt-1">{avis.date}</div>
                      </div>

                      <div className="mt-2 mt-md-0">
                        <button
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => navigate(`/avis/${avis.id}`)}
                        >
                          Voir
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => vm.downloadPDF(avis.id)}
                        >
                          Télécharger
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
