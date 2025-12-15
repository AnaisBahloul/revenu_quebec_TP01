import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import { StatusViewModel } from '../viewmodels/StatusViewModel';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function StatusPage() {
  const vm = new StatusViewModel();
  const [status, setStatus] = useState({
    etat: '',
    dateSoumission: '',
    messages: '',
    statuts: [],
    hasHistorique: false,
    declarationEtat: '',
    etatActuelCode: 0
  });

  useEffect(() => {
    const fetchStatus = async () => {
      const data = await vm.fetchCurrentStatus();
      setStatus(data);
    };
    fetchStatus();
  }, []);

  // Fonction pour obtenir la couleur du badge selon l'état
  function getBadgeColor(statut) {
    // Si le statut a une couleur spécifique, l'utiliser
    if (statut.couleur) {
      return statut.couleur;
    }
    
    // Sinon, utiliser la logique par défaut
    const etat = statut.etat || statut.etatAffichage || '';
    if (etat.includes('Reçue') || etat.includes('Recu')) return 'green';
    if (etat.includes('Validée automatiquement') || etat.includes('ValideeAutomatiquement')) return 'orange';
    if (etat.includes('En révision') || etat.includes('EnRevision')) return 'blue';
    if (etat.includes('Traitée') || etat.includes('Traitee')) return 'gray';
    
    return 'secondary';
  }

  // Fonction pour obtenir la classe Bootstrap de couleur
  function getBootstrapColorClass(color) {
    const map = {
      'green': 'text-bg-success',
      'orange': 'text-bg-warning',
      'blue': 'text-bg-primary',
      'gray': 'text-bg-secondary',
      'success': 'text-bg-success',
      'warning': 'text-bg-warning',
      'primary': 'text-bg-primary',
      'secondary': 'text-bg-secondary'
    };
    return map[color] || 'text-bg-secondary';
  }

  // Fonction pour obtenir l'icône
  function getIconForEtat(etat) {
    if (!etat) return '○';
    
    const etatStr = etat.toString().toLowerCase();
    
    if (etatStr.includes('reçu') || etatStr.includes('recu') || etatStr.includes('traitée') || etatStr.includes('traitee')) return '✓';
    if (etatStr.includes('validée automatiquement') || etatStr.includes('valideeautomatiquement')) return '…';
    if (etatStr.includes('en révision') || etatStr.includes('enrevision')) return '•';
    
    return '○';
  }

  const etatActuel = status.etat || status.declarationEtat || '';
  const etatActuelColor = getBadgeColor({ etatAffichage: etatActuel });

  return (
    <div style={{ display: 'flex', background: '#f3f4f6', minHeight: '100vh', justifyContent: 'center' }}>
      <Navigation />

      <div className="container my-4">
        <h4 className="mb-4 text-center">Suivi de traitement</h4>

        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card shadow-sm" style={{ width: '630px', maxWidth: '100%' }}>
              <div className="card-body d-flex flex-column gap-2">

                {/* CORRECTION ICI : Seulement le texte de l'état en couleur */}
                <p style={{ fontSize: '0.9rem', marginBottom: '6px' }}>
                  <strong>État :</strong>{' '}
                  <span style={{ 
                    color: etatActuelColor, // JUSTE la couleur pour le texte de l'état
                    fontWeight: 'bold' 
                  }}>
                    {etatActuel || '—'}
                  </span>
                </p>

                {/* Date de soumission reste en noir */}
                <p style={{ fontSize: '0.9rem', marginBottom: '6px' }}>
                  <strong>Date de soumission :</strong> {status.dateSoumission || '—'}
                </p>

                {/* Message principal reste en noir */}
                <p style={{ fontSize: '0.9rem', marginBottom: '6px' }}>
                  <strong>Messages :</strong> {status.messages || '—'}
                </p>

                {/* Timeline - tout reste en noir sauf les badges */}
                <div className="mt-3">
                  <ul className="timeline list-unstyled" style={{ borderLeft: '2px solid #ccc', paddingLeft: '16px' }}>
                    
                    {status.statuts.length > 0 ? (
                      status.statuts.map((statut, index) => {
                        const badgeColor = getBadgeColor(statut);
                        const icon = getIconForEtat(statut.etatAffichage || statut.etat);
                        
                        return (
                          <li key={index} className="mb-3">
                            {/* Le badge a sa couleur, mais le texte reste noir */}
                            <span className={`badge ${getBootstrapColorClass(badgeColor)}`}>
                              {icon}
                            </span>{' '}
                            {/* Texte de l'étape en noir */}
                            <span style={{ color: 'black' }}>
                              {statut.etatAffichage || statut.etat || 'État inconnu'}
                            </span>
                            <div style={{ fontSize: '0.8rem', color: '#555', marginLeft: '22px' }}>
                              {statut.date || statut.dateSimple || '—'}
                              {statut.message && (
                                <div style={{ 
                                  fontStyle: 'italic', 
                                  marginTop: '2px'
                                }}>
                                  {statut.message}
                                </div>
                              )}
                            </div>
                          </li>
                        );
                      })
                    ) : status.declarationEtat && status.declarationEtat !== 'Aucune déclaration soumise' ? (
                      // Afficher seulement l'état actuel quand pas d'historique
                      <li className="mb-3">
                        <span className={`badge ${getBootstrapColorClass(etatActuelColor)}`}>
                          {getIconForEtat(etatActuel)}
                        </span>{' '}
                        {/* Texte en noir */}
                        <span style={{ color: 'black' }}>
                          {etatActuel}
                        </span>
                        <div style={{ fontSize: '0.8rem', color: '#555', marginLeft: '22px' }}>
                          {status.dateSoumission || '—'}
                          <div style={{ fontStyle: 'italic', marginTop: '2px' }}>
                            {status.messages || 'En cours de traitement'}
                          </div>
                        </div>
                      </li>
                    ) : (
                      // Aucune déclaration soumise
                      <li className="mb-3">
                        <span className="badge text-bg-secondary">○</span>{' '}
                        <span style={{ color: 'black' }}>
                          Aucune déclaration soumise
                        </span>
                        <div style={{ fontSize: '0.8rem', color: '#555', marginLeft: '22px' }}>
                          —
                          <div style={{ fontStyle: 'italic', marginTop: '2px' }}>
                            {status.messages || 'Commencer une nouvelle déclaration'}
                          </div>
                        </div>
                      </li>
                    )}
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