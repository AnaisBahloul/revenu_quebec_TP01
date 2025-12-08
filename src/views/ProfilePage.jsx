// src/views/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import { ProfileViewModel } from '../viewmodels/ProfileViewModel';
import { FaEdit, FaSave } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ProfilePage() {
  const vm = new ProfileViewModel();
  const [profile, setProfile] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await vm.getProfile();
      setProfile(data);
    };
    fetchProfile();
  }, []);

  const handleEditClick = (field) => {
    setEditingField(field);
    setTempValue(profile[field] || '');
  };

  const handleSave = async (field) => {
  setProfile({ ...profile, [field]: tempValue });
  setEditingField(null);

  // Appelle l’API pour mettre à jour la DB
  const success = await vm.updateProfile(field, tempValue);
  if (!success) {
    alert('Erreur lors de la sauvegarde du profil. Veuillez réessayer.');
  }
};


  const renderEditableField = (label, field) => (
    <div className="d-flex justify-content-between align-items-center mb-2">
      <strong>{label} :</strong>
      <div className="d-flex align-items-center" style={{ gap: '8px', flex: 1, marginLeft: '10px' }}>
        {editingField === field ? (
          <>
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="form-control"
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary btn-sm" onClick={() => handleSave(field)}>
              <FaSave />
            </button>
          </>
        ) : (
          <>
            <span style={{ flex: 1 }}>{profile[field]}</span>
            <FaEdit
              style={{ cursor: 'pointer', color: '#004080' }}
              onClick={() => handleEditClick(field)}
            />
          </>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', background: '#f3f4f6', minHeight: '100vh', justifyContent: 'center' }}>
      <Navigation />

      <div className="container my-4">
        <h4 className="mb-4 text-center">Mon Profil</h4>

        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card shadow-sm" style={{ width: '630px', maxWidth: '100%' }}>
              <div className="card-body d-flex flex-column gap-1">
                {/* Champs fixes */}
                <p><strong>Nom :</strong> {profile.nom}</p>
                <p><strong>Prénom :</strong> {profile.prenom}</p>
                <p><strong>NAS :</strong> {profile.nas}</p>
                <p><strong>Date de naissance :</strong> {profile.dob}</p>

                {/* Champs éditables */}
                {renderEditableField('Email', 'email')}
                {renderEditableField('Adresse', 'adresse')}
                {renderEditableField('Téléphone', 'telephone')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
