import React from 'react';
import { Bot, ShieldCheck, Database, FileCheck, Settings, Lock } from 'lucide-react';

export default function Navbar({
  isConfigured,
  onOpenConfig,
  onOpenKnowledgeBase,
  onOpenMLHGuide
}) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'rgba(7, 13, 25, 0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.875rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-indigo) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(6, 182, 212, 0.35)'
          }}>
            <Bot size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
                Privacy-Aware RAG Bot
              </span>
              <span className="badge badge-fga">Auth0 FGA Guard</span>
              <span className="badge badge-mlh">Builders Week</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Fine-Grained Authorization (ReBAC) for LLM Document Retrieval
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onOpenKnowledgeBase}
            title="Inspect RAG Knowledge Database Documents"
          >
            <Database size={15} color="#06b6d4" />
            <span>Document Index</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onOpenMLHGuide}
            title="MLH Submission Guide & Copyable text"
          >
            <FileCheck size={15} color="#10b981" />
            <span>MLH Submission</span>
          </button>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onOpenConfig}
            title="Auth0 Settings"
          >
            <Settings size={15} />
            <span>Auth0 Config</span>
          </button>
        </div>
      </div>
    </header>
  );
}
