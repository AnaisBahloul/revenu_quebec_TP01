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

  // Pour déterminer le badge actif
  function getBadge(step) {
    const current = status.etat;
    switch (step) {
      case 'Déclaration reçue':
        return current !== '' ? 'text-bg-success' : 'text-bg-secondary';

      case 'Validation automatisée':
        return current === 'Validée automatiquement' ? 'text-bg-success'
            : current === 'En révision par un agent' ? 'text-bg-warning'
            : 'text-bg-secondary';

      case 'Révision par un agent':
        return current === 'En révision par un agent' ? 'text-bg-primary'
            : current === 'Clôturée' ? 'text-bg-success'
            : 'text-bg-secondary';

      default:
        return 'text-bg-secondary';
    }
  }

  return (
    <div style={{ display: 'flex', background: '#f3f4f6', minHeight: '100vh', justifyContent: 'center' }}>
      <Navigation />

      <div className="container my-4">
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

               {/* Timeline verticale */}
<div className="mt-3">
  <ul className="timeline list-unstyled" style={{ borderLeft: '2px solid #ccc', paddingLeft: '16px' }}>

    <li className="mb-3">
      <span className={`badge ${getBadge('Déclaration reçue')}`}>✓</span>{' '}
      Déclaration reçue
      <div style={{ fontSize: '0.8rem', color: '#555', marginLeft: '22px' }}>
        {status.dateRecu || '—'}
      </div>
    </li>

    <li className="mb-3">
      <span className={`badge ${getBadge('Validation automatisée')}`}>…</span>{' '}
      Validation automatisée
      <div style={{ fontSize: '0.8rem', color: '#555', marginLeft: '22px' }}>
        {status.dateValidationAuto || '—'}
      </div>
    </li>

    <li className="mb-3">
      <span className={`badge ${getBadge('Révision par un agent')}`}>•</span>{' '}
      Révision par un agent
      <div style={{ fontSize: '0.8rem', color: '#555', marginLeft: '22px' }}>
        {status.dateRevisionAgent || '—'}
      </div>
    </li>

  </ul>
</div>


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
