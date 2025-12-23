import React, { useState, useEffect } from 'react';
import './ConsentManagement.css';
import { apiService } from '../services/apiService';
import { useWeb3 } from '../hooks/useWeb3';

const ConsentManagement = ({ account }) => {
  const { signMessage } = useWeb3();
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    purpose: '',
  });

  // TODO: Implement fetchConsents function
  useEffect(() => {
    const fetchConsents = async () => {
      setLoading(true);
      try {
        const statusFilter = filterStatus === 'all' ? null : filterStatus;
        const resp = await apiService.getConsents(null, statusFilter);
        setConsents(resp.consents || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConsents();
  }, [filterStatus]);

  // TODO: Implement createConsent function
  // This should:
  // 1. Sign a message using signMessage from useWeb3 hook
  // 2. Call apiService.createConsent with the consent data and signature
  // 3. Refresh the consents list
  const handleCreateConsent = async (e) => {
    e.preventDefault();
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const message = `I consent to: ${formData.purpose} for patient: ${formData.patientId}`;
      const signature = await signMessage(message);
      await apiService.createConsent({
        patientId: formData.patientId,
        purpose: formData.purpose,
        walletAddress: account,
        signature,
      });
      // refresh
      const statusFilter = filterStatus === 'all' ? null : filterStatus;
      const resp = await apiService.getConsents(null, statusFilter);
      setConsents(resp.consents || []);
      setFormData({ patientId: '', purpose: '' });
      setShowCreateForm(false);
    } catch (err) {
      alert('Failed to create consent: ' + err.message);
    }
  };

  // TODO: Implement updateConsentStatus function
  // This should update a consent's status (e.g., from pending to active)
  const handleUpdateStatus = async (consentId, newStatus) => {
    try {
      const blockchainTxHash = newStatus === 'active' ? `0x${Date.now().toString(16)}` : null;
      await apiService.updateConsent(consentId, { status: newStatus, blockchainTxHash });
      const statusFilter = filterStatus === 'all' ? null : filterStatus;
      const resp = await apiService.getConsents(null, statusFilter);
      setConsents(resp.consents || []);
    } catch (err) {
      alert('Failed to update consent: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="consent-management-container">
        <div className="loading">Loading consents...</div>
      </div>
    );
  }

  return (
    <div className="consent-management-container">
      <div className="consent-header">
        <h2>Consent Management</h2>
        <button
          className="create-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
          disabled={!account}
        >
          {showCreateForm ? 'Cancel' : 'Create New Consent'}
        </button>
      </div>

      {!account && (
        <div className="warning">
          Please connect your MetaMask wallet to manage consents
        </div>
      )}

      {showCreateForm && account && (
        <div className="create-consent-form">
          <h3>Create New Consent</h3>
          <form onSubmit={handleCreateConsent}>
            <div className="form-group">
              <label>Patient ID</label>
              <input
                type="text"
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                required
                placeholder="e.g., patient-001"
              />
            </div>
            <div className="form-group">
              <label>Purpose</label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                required
              >
                <option value="">Select purpose...</option>
                <option value="Research Study Participation">Research Study Participation</option>
                <option value="Data Sharing with Research Institution">Data Sharing with Research Institution</option>
                <option value="Third-Party Analytics Access">Third-Party Analytics Access</option>
                <option value="Insurance Provider Access">Insurance Provider Access</option>
              </select>
            </div>
            <button type="submit" className="submit-btn">
              Sign & Create Consent
            </button>
          </form>
        </div>
      )}

      <div className="consent-filters">
        <button
          className={filterStatus === 'all' ? 'active' : ''}
          onClick={() => setFilterStatus('all')}
        >
          All
        </button>
        <button
          className={filterStatus === 'active' ? 'active' : ''}
          onClick={() => setFilterStatus('active')}
        >
          Active
        </button>
        <button
          className={filterStatus === 'pending' ? 'active' : ''}
          onClick={() => setFilterStatus('pending')}
        >
          Pending
        </button>
      </div>

      {/* TODO: Display consents list */}
      <div className="consents-list">
        {consents.length === 0 ? (
          <div className="empty">No consents found</div>
        ) : (
          consents.map((c) => (
            <div key={c.id} className="consent-card">
              <div className="consent-main">
                <div><strong>Patient:</strong> {c.patientId}</div>
                <div><strong>Purpose:</strong> {c.purpose}</div>
                <div><strong>Status:</strong> {c.status}</div>
                <div><strong>Created:</strong> {new Date(c.createdAt).toLocaleString()}</div>
                <div><strong>Tx:</strong> {c.blockchainTxHash || '—'}</div>
              </div>
              <div className="consent-actions">
                {c.status === 'pending' && (
                  <button onClick={() => handleUpdateStatus(c.id, 'active')}>Activate</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConsentManagement;


