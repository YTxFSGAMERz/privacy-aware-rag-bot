import React from 'react';
import { UserCheck, Shield, Users, Briefcase, ChevronRight } from 'lucide-react';

export default function PersonaSelector({ activeUserId, personas, onSelectPersona }) {
  const currentPersona = personas[activeUserId] || Object.values(personas)[0];

  return (
    <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
            <Users size={16} />
          </div>
          <div>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Auth0 FGA Identity & Role Switcher</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
              Test RAG retrieval across different organizational tiers
            </span>
          </div>
        </div>
        <span className="badge badge-fga">
          <Shield size={12} />
          FGA Enforced
        </span>
      </div>

      {/* Persona Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '0.85rem'
      }}>
        {Object.values(personas).map((p) => {
          const isActive = p.id === activeUserId;
          return (
            <div
              key={p.id}
              onClick={() => onSelectPersona(p.id)}
              style={{
                backgroundColor: isActive ? 'rgba(6, 182, 212, 0.12)' : 'var(--bg-primary)',
                border: `1.5px solid ${isActive ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                transition: 'all 0.2s',
                boxShadow: isActive ? '0 0 14px rgba(6, 182, 212, 0.2)' : 'none'
              }}
            >
              <img
                src={p.avatar}
                alt={p.name}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: `2px solid ${isActive ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                  objectFit: 'cover'
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: isActive ? '#38bdf8' : 'var(--text-primary)' }}>
                    {p.name}
                  </span>
                  {isActive && (
                    <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                      Active
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '0.1rem' }}>
                  {p.roleTitle}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.15rem' }}>
                  {p.role}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
