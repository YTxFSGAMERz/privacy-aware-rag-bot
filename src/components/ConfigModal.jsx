import React, { useState } from 'react';
import { X, Check, Copy, Key, Globe, Info } from 'lucide-react';

export default function ConfigModal({ isOpen, onClose, currentDomain, currentClientId, onSave }) {
  const [domain, setDomain] = useState(currentDomain || '');
  const [clientId, setClientId] = useState(currentClientId || '');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const callbackUrl = window.location.origin;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(callbackUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(domain.trim(), clientId.trim());
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Auth0 Configuration
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Connect your Auth0 Single Page Application
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onClose}
            style={{ borderRadius: '50%', padding: '0.5rem', lineHeight: 0 }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{
          backgroundColor: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom: '1.25rem',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', color: '#38bdf8', fontWeight: 600 }}>
            <Info size={16} />
            <span>Auth0 Allowed Application URLs:</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
            Ensure this exact origin is registered in your Auth0 dashboard:
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-primary)',
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem'
          }}>
            <span style={{ color: 'var(--accent-emerald)' }}>{callbackUrl}</span>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleCopyUrl}
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
            >
              {copiedUrl ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
              <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group" style={{ marginBottom: '1rem' }}>
            <label className="input-label" htmlFor="auth0-domain">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Globe size={15} /> Auth0 Domain
              </span>
            </label>
            <input
              id="auth0-domain"
              className="input-control"
              type="text"
              placeholder="e.g. dev-xyz.us.auth0.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
            />
          </div>

          <div className="input-group" style={{ marginBottom: '1.25rem' }}>
            <label className="input-label" htmlFor="auth0-client-id">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Key size={15} /> Client ID
              </span>
            </label>
            <input
              id="auth0-client-id"
              className="input-control"
              type="text"
              placeholder="e.g. BZ81vD6Q8K..."
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {saveSuccess ? (
                <>
                  <Check size={16} />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Credentials</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
