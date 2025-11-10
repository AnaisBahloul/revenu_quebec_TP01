import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { AvisViewModel } from '../viewmodels/AvisViewModel';

export default function AvisPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const vm = new AvisViewModel();
  const [avis, setAvis] = useState({
    nom: '',
    prenom: '',
    nas: '',
    year: '',
    amount: '',
    refNumber: '',
    generationDate: '',
    incomeSummary: [],
    taxCalculation: {},
    requiresAgentReview: false,
    adjustmentNotes: []
  });

  useEffect(() => {
    const fetchAvis = async () => {
      const data = await vm.getAvisDetails(id);
      setAvis(data);
    };
    fetchAvis();
  }, [id]);

  return (
    <div style={{display:'flex', background:'#f3f4f6', minHeight:'100vh'}}>
      <Navigation />
      <div style={styles.content}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div>
              <p style={styles.subtitle}>Avis de cotisation • {avis.year || '—'}</p>
              <h1 style={styles.title}>Avis de cotisation</h1>
              <p style={styles.meta}>Référence : {avis.refNumber || '—'}</p>
              <p style={styles.meta}>Généré le : {avis.generationDate || '—'}</p>
            </div>
            <div style={styles.actions}>
              <button onClick={() => vm.downloadPDF(id)} style={styles.primaryButton}>Télécharger PDF</button>
              <button onClick={() => navigate('/avis')} style={styles.secondaryButton}>Retour</button>
            </div>
          </div>

          <div style={styles.infoGrid}>
            <div style={styles.infoBlock}>
              <h2 style={styles.blockTitle}>Identité du contribuable</h2>
              <p><strong>Nom :</strong> {avis.prenom} {avis.nom}</p>
              <p><strong>NAS :</strong> {avis.nas || '—'}</p>
              <p><strong>Année fiscale :</strong> {avis.year || '—'}</p>
            </div>
            <div style={styles.infoBlock}>
              <h2 style={styles.blockTitle}>Montant final</h2>
              <p style={styles.amount}>{avis.amount || '—'}</p>
              <p>Montant à payer ou à recevoir selon le calcul ci-dessous.</p>
            </div>
          </div>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Résumé des revenus déclarés</h2>
            <div style={{overflowX:'auto'}}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Description</th>
                    <th style={{ ...styles.th, borderRight:'none' }}>Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {avis.incomeSummary && avis.incomeSummary.length > 0 ? (
                    avis.incomeSummary.map((item, idx) => (
                      <tr key={idx} style={idx % 2 ? styles.rowAlt : undefined}>
                        <td style={styles.td}>{item.type}</td>
                        <td style={styles.td}>{item.description}</td>
                        <td style={{ ...styles.td, borderRight:'none' }}>{item.amount}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td style={{ ...styles.td, borderRight:'none' }} colSpan={3}>Aucun revenu déclaré.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Calcul de l’impôt</h2>
            <div style={styles.calcGrid}>
              <div style={styles.calcCard}>
                <p style={styles.calcLabel}>Revenu imposable</p>
                <p style={styles.calcValue}>{avis.taxCalculation?.taxableIncome || '—'}</p>
              </div>
              <div style={styles.calcCard}>
                <p style={styles.calcLabel}>Déductions</p>
                <p style={styles.calcValue}>{avis.taxCalculation?.deductions || '—'}</p>
              </div>
              <div style={styles.calcCard}>
                <p style={styles.calcLabel}>Impôt net</p>
                <p style={styles.calcValue}>{avis.taxCalculation?.netTax || '—'}</p>
              </div>
              <div style={styles.calcCard}>
                <p style={styles.calcLabel}>Montant à payer / recevoir</p>
                <p style={styles.calcValue}>{avis.taxCalculation?.amountPayable || '—'}</p>
              </div>
            </div>
          </section>

          {avis.requiresAgentReview && (
            <section style={styles.alertSection}>
              <h2 style={styles.sectionTitle}>Avis personnalisé par un agent</h2>
              <p style={{marginBottom:'10px'}}>
                Cette déclaration a été examinée par un agent en raison d’incohérences détectées. Ajustements / précisions :
              </p>
              <ul style={styles.noteList}>
                {avis.adjustmentNotes?.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  content: {
    flex: 1,
    padding: '15px',           // réduit par rapport à 30px
    display: 'flex',
    justifyContent: 'center'
  },
  card: {
    width: '100%',
    maxWidth: '630px',         // comme ProfilePage
    background: '#ffffff',
    borderRadius: '10px',      // légèrement plus petit
    boxShadow: '0 8px 20px rgba(0,0,0,0.05)', // ombre plus douce
    padding: '20px',           // padding réduit
    boxSizing: 'border-box'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '10px',                // plus serré
    marginBottom: '16px'        // réduit
  },
  subtitle: {
    margin: 0,
    fontSize: '0.85rem',        // plus petit
    color: '#475569'
  },
  title: {
    margin: '2px 0',
    fontSize: '1.5rem',         // réduit
    color: '#003366'
  },
  meta: {
    margin: '2px 0',
    color: '#475569',
    fontSize: '0.85rem'         // plus petit
  },
  actions: {
    display: 'flex',
    gap: '6px',                  // plus serré
    flexWrap: 'wrap'
  },
  primaryButton: {
    background: '#003366',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 10px',        // réduit
    fontSize: '0.85rem',        // réduit
    cursor: 'pointer'
  },
  secondaryButton: {
    background: '#e5e7eb',
    color: '#1f2937',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 10px',
    fontSize: '0.85rem',
    cursor: 'pointer'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', // un peu plus serré
    gap: '10px',
    marginBottom: '16px'
  },
  infoBlock: {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',        // légèrement plus petit
    padding: '12px',             // padding réduit
    background: '#f8fafc'
  },
  blockTitle: {
    margin: '0 0 6px',
    fontSize: '0.95rem',        // réduit
    color: '#003366'
  },
  amount: {
    fontSize: '1.2rem',         // réduit
    fontWeight: 600,
    color: '#047857',
    margin: '0 0 4px'
  },
  section: {
    marginBottom: '16px'        // réduit
  },
  sectionTitle: {
    marginBottom: '8px',
    fontSize: '1rem',           // réduit
    color: '#003366'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '400px'           // légèrement plus petit
  },
  th: {
    padding: '8px 12px',        // réduit
    textAlign: 'left',
    borderRight: '1px solid rgba(0,0,0,0.1)',
    background: '#f1f5f9',
    fontWeight: 600,
    fontSize: '0.85rem'         // réduit
  },
  td: {
    padding: '8px 12px',        // réduit
    borderRight: '1px solid rgba(0,0,0,0.1)',
    borderTop: '1px solid rgba(0,0,0,0.05)',
    verticalAlign: 'middle',
    fontSize: '0.85rem'         // réduit
  },
  rowAlt: {
    background: '#f9fafb'
  },
  calcGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', // plus serré
    gap: '10px'
  },
  calcCard: {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '12px',
    background: '#f8fafc'
  },
  calcLabel: {
    margin: 0,
    color: '#475569',
    fontSize: '0.8rem'           // réduit
  },
  calcValue: {
    margin: '4px 0 0',
    fontSize: '1rem',            // réduit
    fontWeight: 600,
    color: '#111827'
  },
  alertSection: {
    border: '1px solid #fbbf24',
    background: '#fef3c7',
    borderRadius: '8px',
    padding: '12px'
  },
  noteList: {
    margin: 0,
    paddingLeft: '12px',
    fontSize: '0.85rem'          // réduit
  }
};

