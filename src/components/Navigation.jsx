// src/components/Navigation.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardViewModel } from '../viewmodels/DashboardViewModel';

export default function Navigation() {
  const navigate = useNavigate();
  const vm = new DashboardViewModel();

  const handleLogout = async () => {  // ← AJOUTE "async" ici !
    console.log('🔄 Bouton déconnexion cliqué');
    await vm.logout();  // ← AJOUTE "await" ici !
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.title}>Revenu Québec</h2>
      <ul style={styles.ul}>
  <li><Link to="/dashboard" style={styles.link}>Tableau de bord</Link></li>
  <li><Link to="/declaration" style={styles.link}>Déclaration</Link></li>
  <li><Link to="/status" style={styles.link}>Suivi</Link></li>
  <li><Link to="/history" style={styles.link}>Historique</Link></li>
  <li><Link to="/avis" style={styles.link}>Avis</Link></li> {/* Ajouté */}
  <li><Link to="/profile" style={styles.link}>Profil</Link></li>
  <li><button onClick={handleLogout} style={styles.logout}>Déconnexion</button></li>
</ul>
    </nav>
  );
}

const styles = {
  nav: {
    width: '200px',
    minHeight: '100vh',
    background: '#004080',
    color: 'white',
    padding: '20px',
    boxSizing: 'border-box',
  },
  title: {
    marginBottom: '20px',
  },
  ul: {
    listStyle: 'none',
    padding: 0,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    display: 'block',
    padding: '10px 0',
  },
  logout: {
    background: '#ff4d4d',
    border: 'none',
    color: 'white',
    padding: '10px',
    width: '100%',
    marginTop: '20px',
    cursor: 'pointer',
  }
};
