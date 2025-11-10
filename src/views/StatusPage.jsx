import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import { StatusViewModel } from '../viewmodels/StatusViewModel';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function StatusPage() {
  const vm = new StatusViewModel();
  const [status, setStatus] = useState({ etat: '', dateSoumission: '', messages: '' });

  useEffect(() => {
    const fetchStatus = async () => {
      const data = await vm.fetchCurrentStatus();
      setStatus(data);
    };
    fetchStatus();
  }, []);

  function getStatusColor(etat) {
    switch (etat) {
      case 'En cours': return 'orange';
      case 'Validée automatiquement': return 'green';
      case 'En révision par un agent': return 'blue';
      case 'Clôturée': return 'gray';
      default: return 'black';
    }
  }

  return (
    <div style={{ display: 'flex', background: '#f3f4f6', minHeight: '100vh', justifyContent: 'center' }}>
      <Navigation />

      <div className="container my-4">
        {/* TITRE HORS CARTE */}
        <h4 className="mb-4 text-center">Suivi de traitement</h4>

        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card shadow-sm" style={{ width: '630px', maxWidth: '100%' }}>
              <div className="card-body d-flex flex-column gap-2">
                <p style={{ fontSize: '0.9rem', marginBottom: '6px' }}>
                  <strong>État :</strong>{' '}
                  <span style={{ color: getStatusColor(status.etat), fontWeight: 'bold' }}>
                    {status.etat || '—'}
                  </span>
                </p>

                <p style={{ fontSize: '0.9rem', marginBottom: '6px' }}>
                  <strong>Date de soumission :</strong> {status.dateSoumission || '—'}
                </p>

                <p style={{ fontSize: '0.9rem', marginBottom: '6px' }}>
                  <strong>Messages :</strong> {status.messages || '—'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
