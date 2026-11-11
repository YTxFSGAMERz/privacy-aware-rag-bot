import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Bot, Shield, Database, Lock, Sparkles, RefreshCw } from 'lucide-react';
import PersonaSelector from './components/PersonaSelector';
import ChatBot from './components/ChatBot';
import KnowledgeBaseModal from './components/KnowledgeBaseModal';

const DEFAULT_PERSONAS = {
  'user:bob': {
    id: 'user:bob',
    name: 'Bob Jenkins',
    role: 'role:general_employee',
    roleTitle: 'General Employee (Junior SWE)',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80'
  },
  'user:alice': {
    id: 'user:alice',
    name: 'Alice Chang',
    role: 'role:engineering_manager',
    roleTitle: 'Engineering Manager',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&h=120&q=80'
  },
  'user:carol': {
    id: 'user:carol',
    name: 'Carol Robinson',
    role: 'role:hr_director',
    roleTitle: 'HR & Legal Director',
    department: 'People & Legal',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80'
  }
};

export default function AppContent({
  isConfigured,
  onOpenConfig,
  onOpenMLHGuide,
  isKnowledgeBaseOpen,
  setIsKnowledgeBaseOpen
}) {
  const [personas, setPersonas] = useState(DEFAULT_PERSONAS);
  const [activeUserId, setActiveUserId] = useState('user:bob');
  const [documents, setDocuments] = useState([]);
  const [lastAuditTrace, setLastAuditTrace] = useState(null);

  useEffect(() => {
    fetch('/api/fga/model')
      .then((res) => res.json())
      .then((data) => {
        if (data.personas) setPersonas(data.personas);
      })
      .catch((err) => console.warn('Could not load FGA model:', err));

    fetch('/api/documents')
      .then((res) => res.json())
      .then((data) => {
        if (data.documents) setDocuments(data.documents);
      })
      .catch((err) => console.warn('Could not load document index:', err));
  }, []);

  const activeUser = personas[activeUserId] || personas['user:bob'];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Persona Role Switcher */}
      <PersonaSelector
        activeUserId={activeUserId}
        personas={personas}
        onSelectPersona={(id) => setActiveUserId(id)}
      />

      {/* Main RAG Bot Chat */}
      <ChatBot
        key={activeUserId}
        activeUser={activeUser}
        onAuditTraceGenerated={(trace) => setLastAuditTrace(trace)}
      />

      {/* Knowledge Base Modal */}
      <KnowledgeBaseModal
        isOpen={isKnowledgeBaseOpen}
        onClose={() => setIsKnowledgeBaseOpen(false)}
        documents={documents}
      />
    </div>
  );
}
