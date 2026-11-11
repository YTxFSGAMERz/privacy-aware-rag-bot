import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, CheckCircle2, Camera } from 'lucide-react';

export default function MLHGuide({ isOpen, onClose }) {
  const [copiedDescription, setCopiedDescription] = useState(false);
  const [copiedTech, setCopiedTech] = useState(false);

  if (!isOpen) return null;

  const challengeTitle = "The Privacy-Aware RAG Bot (Focus: Auth0 FGA)";
  const technologies = "React 19, Vite, Node.js, Express, @auth0/auth0-react, Auth0 FGA (Fine-Grained Authorization), OpenFGA / ReBAC (Relationship-Based Access Control), RAG (Retrieval-Augmented Generation), REST API, Lucide Icons, CSS3";

  const descriptionMarkdown = `## 🔒 The Privacy-Aware RAG Bot (Auth0 FGA & Document Access Control)

> **MLH Global Hack Week: Builders Week Submission**  
> Challenge: *The Privacy-Aware RAG Bot (Focus: Auth0 FGA)*

### 🌟 Overview
An internal-facing HR and corporate knowledge assistant that sources answers from an enterprise document index (**RAG**) while enforcing strict document-level authorization using **Auth0 FGA (Fine-Grained Authorization / ReBAC)** before any content reaches the LLM context window.

---

### 🎯 Success Criteria Met & Verified
1. **Auth0 FGA Implementation**: Defined and enforced a relationship-based authorization model (\`type user\`, \`type role\`, \`type document\`, with \`viewer: [user, role#member]\` relations).
2. **Demonstrated Manager vs General Employee Access**:
   - **General Employee (Bob)**: Can access public company handbook, but when querying salaries or Q4 budget, **Auth0 FGA denies retrieval** (\`ALLOWED: FALSE\`) and redacts the document from the prompt context.
   - **Engineering Manager (Alice)**: Possesses the \`viewer\` relationship for engineering compensation and Q4 budget documents, successfully retrieving the confidential data.
   - **HR Director (Carol)**: Authorized across all organizational tiers, including restricted executive equity and performance records.
3. **Retrieval-Time Access Denial**: Proves that sensitive documents are filtered at retrieval time, guaranteeing the language model cannot hallucinate or leak unauthorized organizational data.
4. **Live FGA Evaluation Trace**: Every response provides an inspectable audit trail detailing candidate documents, FGA tuple checks, and context window redactions.

---

### 🛠️ Architecture & Tech Stack
- **Frontend**: React 19, Vite, Lucide Icons, Cyber-Security Glassmorphism UI
- **Backend / RAG Engine**: Node.js, Express, In-Memory Vector & Keyword Document Index
- **Authorization**: Auth0 FGA / OpenFGA ReBAC Relationship Tuples
- **Authentication**: Auth0 Universal Login, \`@auth0/auth0-react\`

---

### 🚀 Running Locally
1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/YTxFSGAMERz/privacy-aware-rag-bot.git
   cd privacy-aware-rag-bot
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Start the full-stack system:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Open \`http://localhost:5176\` in your browser, switch personas, and query sensitive vs public documents!`;

  const handleCopy = (text, setFn) => {
    navigator.clipboard.writeText(text);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                MLH Challenge Submission Helper
              </h2>
              <span className="badge badge-fga">Auth0 FGA Guard</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Challenge: <strong>{challengeTitle}</strong>
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

        {/* Success Criteria Summary */}
        <div style={{
          backgroundColor: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom: '1.25rem'
        }}>
          <h3 style={{ fontSize: '0.9rem', color: '#38bdf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <CheckCircle2 size={16} />
            Success Criteria Fulfilled:
          </h3>
          <ul style={{ listStyle: 'none', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <li>✓ <strong>Auth0 FGA Integration:</strong> ReBAC relationship tuples define document-level access rules.</li>
            <li>✓ <strong>Employee Access Denied:</strong> General employee querying salaries is denied and content redacted.</li>
            <li>✓ <strong>Manager Access Granted:</strong> Engineering manager querying salaries successfully retrieves data.</li>
            <li>✓ <strong>Audit Proof:</strong> Every query includes a verified tuple check trace showing \`ALLOWED: TRUE/FALSE\`.</li>
          </ul>
        </div>

        {/* Field 1: Technologies Used */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <label className="input-label" style={{ margin: 0, fontWeight: 600 }}>
              1. Technologies Used (Copy & Paste)
            </label>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleCopy(technologies, setCopiedTech)}
            >
              {copiedTech ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copiedTech ? 'Copied' : 'Copy Technologies'}</span>
            </button>
          </div>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            fontSize: '0.825rem',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)'
          }}>
            {technologies}
          </div>
        </div>

        {/* Field 2: Description */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <label className="input-label" style={{ margin: 0, fontWeight: 600 }}>
              2. Description (Markdown for MLH form)
            </label>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleCopy(descriptionMarkdown, setCopiedDescription)}
            >
              {copiedDescription ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedDescription ? 'Copied Markdown' : 'Copy Description'}</span>
            </button>
          </div>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            padding: '0.85rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            maxHeight: '180px',
            overflowY: 'auto',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            whiteSpace: 'pre-wrap'
          }}>
            {descriptionMarkdown}
          </div>
        </div>

        {/* Field 3: Screenshot Tips */}
        <div style={{
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem',
          border: '1px solid var(--border-color)',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
            <Camera size={15} color="#06b6d4" />
            <span>Recommended Screenshots to Upload</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Take two screenshots:
            <br />1. As <strong>Bob (General Employee)</strong>, query <em>"What are the engineering salary bands?"</em> showing the red <strong>"ACCESS DENIED BY AUTH0 FGA POLICY"</strong> banner.
            <br />2. Switch to <strong>Alice (Engineering Manager)</strong>, run the same query, showing access <strong>GRANTED</strong> with salary details cited!
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
          <a
            href="https://www.mlh.com/events/global-hack-week-builders-week/challenges/01a1ad3d-291b-dd4a-ddeb-9b2ef0b791bb/submissions/new"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <span>Open MLH Submission Page</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
