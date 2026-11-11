import React from 'react';
import { X, FileText, Lock, ShieldCheck, Database, Building2 } from 'lucide-react';

export default function KnowledgeBaseModal({ isOpen, onClose, documents }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                RAG Document Knowledge Index
              </h2>
              <span className="badge badge-fga">Auth0 FGA Protected</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              All documents indexed in the vector database with their associated Auth0 FGA access policies
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {documents.map((doc) => {
            const isManager = doc.sensitivity.includes('MANAGER');
            const isRestricted = doc.sensitivity.includes('DIRECTOR');

            return (
              <div
                key={doc.id}
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={18} color={isRestricted ? '#f43f5e' : isManager ? '#f59e0b' : '#10b981'} />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{doc.title}</span>
                  </div>
                  {isRestricted ? (
                    <span className="badge badge-danger">Restricted (Director Only)</span>
                  ) : isManager ? (
                    <span className="badge badge-warning">Confidential (Manager+)</span>
                  ) : (
                    <span className="badge badge-success">Public Internal</span>
                  )}
                </div>

                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                  {doc.description}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '0.5rem',
                  marginTop: '0.25rem',
                  fontSize: '0.725rem',
                  color: 'var(--text-muted)'
                }}>
                  <span>Dept: <strong style={{ color: 'var(--text-secondary)' }}>{doc.department}</strong></span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>ID: {doc.id}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
