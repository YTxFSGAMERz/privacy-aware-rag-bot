import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ShieldCheck, ShieldAlert, FileText, ChevronDown, ChevronUp, Sparkles, Loader2, Check, Copy, Ban, CheckCircle } from 'lucide-react';

const TEST_PRESETS = [
  { label: '💰 Engineering Salaries (Sensitive)', query: 'What are the engineering salary bands and compensation levels?' },
  { label: '📊 Q4 Budget Allocation (Sensitive)', query: 'What is our Q4 engineering budget allocation?' },
  { label: '👔 Executive Equity (Restricted)', query: 'Show me executive C-suite compensation and equity allocation' },
  { label: '🌴 Holiday & Hackathon Policy (Public)', query: 'What is our annual paid time off and hackathon policy?' }
];

export default function ChatBot({ activeUser, onAuditTraceGenerated }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello **${activeUser?.name || 'Farhan'}**! I am the **Privacy-Aware RAG Knowledge Assistant**.\n\nI source answers from our company's internal document database while enforcing **Auth0 FGA (Fine-Grained Authorization)** at the document retrieval layer.\n\n• Currently acting as: **${activeUser?.name}** (\`${activeUser?.roleTitle}\`)\n• Try querying salary or budget documents to test FGA document-level access denial!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      auditTrace: null
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedTraceId, setExpandedTraceId] = useState(null);
  const [copiedTraceId, setCopiedTraceId] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (queryToSend) => {
    const text = queryToSend || inputText.trim();
    if (!text || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          activeUserId: activeUser.id
        })
      });

      const data = await res.json();

      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'No information could be retrieved.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        auditTrace: data.fgaAuditTrace
      };

      setMessages((prev) => [...prev, botMessage]);
      setExpandedTraceId(botMessage.id); // Auto expand to highlight FGA check
      if (onAuditTraceGenerated && data.fgaAuditTrace) {
        onAuditTraceGenerated(data.fgaAuditTrace);
      }
    } catch (err) {
      console.error('Error querying RAG bot:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyTrace = (trace, id) => {
    navigator.clipboard.writeText(JSON.stringify(trace, null, 2));
    setCopiedTraceId(id);
    setTimeout(() => setCopiedTraceId(null), 2000);
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '620px', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '1rem 1.5rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(12, 21, 39, 0.9)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <Bot size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>HR & Corporate Knowledge Bot</span>
              <span className="badge badge-fga" style={{ fontSize: '0.65rem' }}>Auth0 FGA Guard</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Active User: <strong style={{ color: 'var(--text-primary)' }}>{activeUser?.name}</strong> ({activeUser?.roleTitle})
            </p>
          </div>
        </div>

        <span className="badge badge-success">
          <ShieldCheck size={12} />
          FGA Active
        </span>
      </div>

      {/* Messages Stream */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: msg.sender === 'user' ? '80%' : '90%'
            }}
          >
            {msg.sender === 'bot' && (
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(6, 182, 212, 0.2)',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Bot size={18} color="#38bdf8" />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{
                backgroundColor: msg.sender === 'user'
                  ? 'var(--accent-indigo)'
                  : msg.text.includes('ACCESS DENIED')
                    ? 'rgba(244, 63, 94, 0.1)'
                    : 'var(--bg-secondary)',
                border: `1px solid ${msg.sender === 'user'
                  ? 'transparent'
                  : msg.text.includes('ACCESS DENIED')
                    ? 'rgba(244, 63, 94, 0.35)'
                    : 'var(--border-color)'}`,
                color: 'var(--text-primary)',
                padding: '0.85rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {msg.text}
              </div>

              {/* Timestamp & Trace Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span>{msg.timestamp}</span>

                {msg.auditTrace && (
                  <button
                    type="button"
                    onClick={() => setExpandedTraceId(expandedTraceId === msg.id ? null : msg.id)}
                    style={{
                      background: 'none',
                      color: '#38bdf8',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <span>{expandedTraceId === msg.id ? 'Hide FGA Security Check' : 'View Auth0 FGA Security Check (Access Proof)'}</span>
                    {expandedTraceId === msg.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                )}
              </div>

              {/* FGA Evaluation Details Box */}
              {msg.auditTrace && expandedTraceId === msg.id && (
                <div className="animate-fade-in" style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(6, 182, 212, 0.35)',
                  padding: '0.85rem',
                  marginTop: '0.35rem',
                  fontSize: '0.78rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontWeight: 600 }}>
                      <ShieldCheck size={14} />
                      <span>Auth0 FGA Evaluation Log (Fine-Grained Authorization)</span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => handleCopyTrace(msg.auditTrace, msg.id)}
                      style={{ padding: '0.15rem 0.45rem', fontSize: '0.7rem' }}
                    >
                      {copiedTraceId === msg.id ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                      <span>{copiedTraceId === msg.id ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                  </div>

                  {/* Document evaluations */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.5rem' }}>
                    {msg.auditTrace.fgaEvaluations.map((evalItem, i) => (
                      <div
                        key={i}
                        style={{
                          background: evalItem.allowed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
                          border: `1px solid ${evalItem.allowed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                          borderRadius: '4px',
                          padding: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {evalItem.documentTitle}
                          </div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
                            Tuple Check: {evalItem.fgaRule}
                          </div>
                        </div>

                        <div>
                          {evalItem.allowed ? (
                            <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                              ALLOWED
                            </span>
                          ) : (
                            <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>
                              ACCESS DENIED
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.4rem' }}>
                    Context Window Status: <strong style={{ color: msg.auditTrace.contextWindowPassedToLLM.length > 0 ? '#10b981' : '#f43f5e' }}>
                      {msg.auditTrace.contextWindowPassedToLLM.length} document(s) permitted
                    </strong>, <strong style={{ color: '#f43f5e' }}>{msg.auditTrace.redactedDocuments.length} document(s) redacted by FGA</strong>.
                  </div>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <User size={18} color="#f8fafc" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <Loader2 size={20} className="spinner" color="#06b6d4" />
            <span>Retrieving candidate documents & evaluating Auth0 FGA access tuples...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Query Buttons */}
      <div style={{
        padding: '0.5rem 1.25rem',
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'rgba(7, 13, 25, 0.7)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        overflowX: 'auto'
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}>
          <Sparkles size={12} color="#06b6d4" /> Try Presets:
        </span>
        {TEST_PRESETS.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(p.query)}
            disabled={isLoading}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              fontSize: '0.78rem',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          gap: '0.75rem',
          backgroundColor: 'var(--bg-secondary)'
        }}
      >
        <input
          type="text"
          className="input-control"
          placeholder={`Ask the knowledge assistant as ${activeUser?.name}...`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading}
          style={{ flex: 1 }}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!inputText.trim() || isLoading}
        >
          <Send size={16} />
          <span>Ask RAG Bot</span>
        </button>
      </form>
    </div>
  );
}
