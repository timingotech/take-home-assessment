import React, { useState, useEffect } from 'react';
import './PatientDetail.css';
import { apiService } from '../services/apiService';

const PatientDetail = ({ patientId, onBack }) => {
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO: Implement fetchPatientData function
  // This should fetch both patient details and their records
  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        const patientResp = await apiService.getPatient(patientId);
        const recordsResp = await apiService.getPatientRecords(patientId);
        setPatient(patientResp || null);
        setRecords(recordsResp.records || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  if (loading) {
    return (
      <div className="patient-detail-container">
        <div className="loading">Loading patient details...</div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="patient-detail-container">
        <div className="error">Error loading patient: {error || 'Patient not found'}</div>
        <button onClick={onBack} className="back-btn">Back to List</button>
      </div>
    );
  }

  return (
    <div className="patient-detail-container">
      <div className="patient-detail-header">
        <button onClick={onBack} className="back-btn">← Back to List</button>
      </div>

      <div className="patient-detail-content">
        {/* TODO: Display patient information */}
        {/* Show: name, email, dateOfBirth, gender, phone, address, walletAddress */}
        <div className="patient-info-section">
          <h2>Patient Information</h2>
          {/* Your implementation here */}
          <div className="patient-info">
            <div><strong>Name:</strong> {patient.name}</div>
            <div><strong>Email:</strong> {patient.email}</div>
            <div><strong>Date of Birth:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</div>
            <div><strong>Gender:</strong> {patient.gender}</div>
            <div><strong>Phone:</strong> {patient.phone || '—'}</div>
            <div><strong>Address:</strong> {patient.address || '—'}</div>
            <div><strong>Wallet:</strong> {patient.walletAddress || '—'}</div>
          </div>
        </div>

        {/* TODO: Display patient records */}
        {/* Show list of medical records with: type, title, date, doctor, hospital, status */}
        <div className="patient-records-section">
          <h2>Medical Records ({records.length})</h2>
          {/* Your implementation here */}
          {records.length === 0 ? (
            <div className="empty">No records available</div>
          ) : (
            <div className="records-list">
              {records.map((r) => (
                <div key={r.id} className="record-card">
                  <div className="record-header">
                    <span className="record-type">{r.type}</span>
                    <span className="record-title">{r.title}</span>
                  </div>
                  <div className="record-meta">
                    <div><strong>Date:</strong> {new Date(r.date).toLocaleDateString()}</div>
                    <div><strong>Doctor:</strong> {r.doctor}</div>
                    <div><strong>Hospital:</strong> {r.hospital}</div>
                    <div><strong>Status:</strong> {r.status}</div>
                    <div className="record-hash"><strong>Hash:</strong> {r.blockchainHash || '—'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;


