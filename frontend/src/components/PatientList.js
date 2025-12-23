import React, { useState, useEffect } from 'react';
import './PatientList.css';
import { apiService } from '../services/apiService';

const PatientList = ({ onSelectPatient }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // TODO: Implement the fetchPatients function
  // This function should:
  // 1. Call apiService.getPatients with appropriate parameters (page, limit, search)
  // 2. Update the patients state with the response data
  // 3. Update the pagination state
  // 4. Handle loading and error states
  const fetchPatients = async () => {
    // Your implementation here
    setLoading(true);
    try {
      const limit = 10;
      const resp = await apiService.getPatients(currentPage, limit, searchTerm);
      setPatients(resp.patients || []);
      setPagination(resp.pagination || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [currentPage, searchTerm]);

  // TODO: Implement search functionality
  // Add a debounce or handle search input changes
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="patient-list-container">
        <div className="loading">Loading patients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="patient-list-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="patient-list-container">
      <div className="patient-list-header">
        <h2>Patients</h2>
        {/* TODO: Add search input field */}
        <input
          type="text"
          placeholder="Search patients..."
          className="search-input"
          // TODO: Add value, onChange handlers
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* TODO: Implement patient list display */}
      {/* Map through patients and display them */}
      {/* Each patient should be clickable and call onSelectPatient with patient.id */}
      <div className="patient-list">
        {patients.length === 0 ? (
          <div className="empty">No patients found</div>
        ) : (
          patients.map((p) => (
            <div
              key={p.id}
              className="patient-card"
              onClick={() => onSelectPatient && onSelectPatient(p.id)}
            >
              <h3 className="patient-name">{p.name}</h3>
              <div className="patient-meta">
                <div className="patient-email">{p.email}</div>
                <div className="patient-dob">{new Date(p.dateOfBirth).toLocaleDateString()}</div>
              </div>
              <div className="patient-footer">
                <div className="patient-phone">{p.phone}</div>
                <div className="patient-wallet">{p.walletAddress || '—'}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* TODO: Implement pagination controls */}
      {/* Show pagination buttons if pagination data is available */}
      {pagination && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((s) => Math.max(1, s - 1))}
            disabled={pagination.page <= 1}
          >
            Prev
          </button>

          <span className="page-info">Page {pagination.page} of {pagination.totalPages}</span>

          <button
            onClick={() => setCurrentPage((s) => Math.min(pagination.totalPages, s + 1))}
            disabled={pagination.page >= pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientList;


