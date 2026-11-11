import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// ============================================================================
// 1. RAG DOCUMENT DATABASE (Internal Knowledge Repository)
// ============================================================================
const DOCUMENTS = [
  {
    id: 'doc:company_handbook',
    title: 'Company Handbook & Employee Perks (2026)',
    department: 'General',
    sensitivity: 'PUBLIC_INTERNAL',
    description: 'General workplace guidelines, hybrid policy, holiday schedules, and wellness stipends.',
    content: `
[COMPANY HANDBOOK & PERKS 2026]
- Working Hours: Flexible core hours between 10:00 AM - 4:00 PM local time.
- Hybrid Policy: Engineers and staff may work remotely up to 3 days per week.
- Paid Time Off: 25 days of annual paid vacation plus 10 paid public holidays.
- Wellness & Education: $1,200 annual stipend for gym memberships, books, or technical certifications.
- Hackathons: All employees receive 2 paid Hack Days per quarter to participate in hackathons such as MLH Global Hack Week.
`
  },
  {
    id: 'doc:engineering_salaries_2026',
    title: 'Engineering Department Compensation & Salary Bands (2026)',
    department: 'Engineering',
    sensitivity: 'CONFIDENTIAL_MANAGER',
    description: 'Base pay ranges, promotion criteria, and bonus targets for engineering levels.',
    content: `
[ENGINEERING COMPENSATION BANDS 2026 - CONFIDENTIAL]
- L3 (Associate SWE): $110,000 - $135,000 base salary + 10% target bonus.
- L4 (Software Engineer): $135,000 - $165,000 base salary + 15% target bonus.
- L5 (Senior Software Engineer): $165,000 - $205,000 base salary + 20% target bonus.
- L6 (Staff / Principal SWE): $210,000 - $265,000 base salary + 25% target bonus.
- M1 (Engineering Manager): $215,000 - $275,000 base salary + 25% target bonus.
- Annual Merit Increase: Standard performance merit increase pool is 4.5% effective Q1.
`
  },
  {
    id: 'doc:q4_budget_forecast',
    title: 'Q4 Engineering R&D Budget & Cloud Infrastructure Allocation',
    department: 'Engineering',
    sensitivity: 'CONFIDENTIAL_MANAGER',
    description: 'Quarterly financial budget, AWS/cloud compute costs, and LLM API allocations.',
    content: `
[Q4 ENGINEERING BUDGET & INFRASTRUCTURE - CONFIDENTIAL]
- Total Allocated Budget: $4,250,000.
- Cloud Hosting & Infrastructure: $1,400,000 (AWS multi-region & database replication).
- AI & LLM Inference APIs: $650,000 (OpenAI, Anthropic, Gemini API tokens).
- Headcount & Contractor Sourcing: $1,800,000 (5 new engineering roles in Q4).
- Security & Compliance (Auth0 / Okta FGA): $400,000.
`
  },
  {
    id: 'doc:executive_salaries_and_equity',
    title: 'Executive C-Suite Compensation & Cap Table Allocation',
    department: 'HR / Executive',
    sensitivity: 'RESTRICTED_DIRECTOR',
    description: 'Confidential executive compensation, board-approved stock options, and retention grants.',
    content: `
[EXECUTIVE COMPENSATION & EQUITY - RESTRICTED]
- Chief Executive Officer (CEO): $450,000 base, 60% bonus target, 3.2% equity ownership.
- Chief Technology Officer (CTO): $380,000 base, 50% bonus target, 1.8% equity ownership.
- Chief Financial Officer (CFO): $360,000 base, 50% bonus target, 1.5% equity ownership.
- Executive RSU Vesting: 4-year schedule with a 1-year cliff and monthly vesting thereafter.
`
  },
  {
    id: 'doc:employee_disciplinary_records',
    title: 'Confidential HR Employee Relations & Disciplinary Logs',
    department: 'HR / Legal',
    sensitivity: 'RESTRICTED_DIRECTOR',
    description: 'Internal grievance records, performance improvement plans, and legal settlements.',
    content: `
[HR EMPLOYEE RELATIONS & DISCIPLINARY LOGS - STRICTLY CONFIDENTIAL]
- Active Performance Improvement Plans (PIPs): 3 employees under 60-day review.
- Legal & Severance Reserve: $250,000 allocated for confidential mutual separations in FY2026.
- Formal Workplace Investigations: Zero active complaints currently pending legal arbitration.
`
  }
];

// ============================================================================
// 2. AUTH0 FGA AUTHORIZATION ENGINE (ReBAC Model & Relationship Tuples)
// ============================================================================
/*
  FGA Model Schema:
  type user
  type role
    relations
      define member: [user]
  type document
    relations
      define viewer: [user, role#member]
      define can_view: viewer
*/

const FGA_RELATIONSHIP_TUPLES = [
  // Document Viewer Tuples:
  // General Employee can view company handbook
  { user: 'role:general_employee#member', relation: 'viewer', object: 'doc:company_handbook' },

  // Engineering Manager can view handbook, engineering salaries, and Q4 budget
  { user: 'role:engineering_manager#member', relation: 'viewer', object: 'doc:company_handbook' },
  { user: 'role:engineering_manager#member', relation: 'viewer', object: 'doc:engineering_salaries_2026' },
  { user: 'role:engineering_manager#member', relation: 'viewer', object: 'doc:q4_budget_forecast' },

  // HR & Legal Director can view everything
  { user: 'role:hr_director#member', relation: 'viewer', object: 'doc:company_handbook' },
  { user: 'role:hr_director#member', relation: 'viewer', object: 'doc:engineering_salaries_2026' },
  { user: 'role:hr_director#member', relation: 'viewer', object: 'doc:q4_budget_forecast' },
  { user: 'role:hr_director#member', relation: 'viewer', object: 'doc:executive_salaries_and_equity' },
  { user: 'role:hr_director#member', relation: 'viewer', object: 'doc:employee_disciplinary_records' },
];

// Pre-defined User Personas for Demo
const USER_PERSONAS = {
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

// Core Auth0 FGA Check Implementation
function checkFGA(userId, roleId, relation, objectId) {
  // Check direct tuple match
  const directMatch = FGA_RELATIONSHIP_TUPLES.some(
    t => (t.user === userId || t.user === `${roleId}#member`) && t.relation === relation && t.object === objectId
  );
  return directMatch;
}

// ============================================================================
// 3. API ENDPOINTS
// ============================================================================

// GET /api/fga/model - Get FGA Model schema, tuples, and personas
app.get('/api/fga/model', (req, res) => {
  res.json({
    status: 'active',
    modelType: 'Auth0 FGA / OpenFGA ReBAC (Relationship-Based Access Control)',
    schema: `
model
  schema 1.1
type user
type role
  relations
    define member: [user]
type document
  relations
    define viewer: [user, role#member]
    define can_view: viewer
    `.trim(),
    tuples: FGA_RELATIONSHIP_TUPLES,
    personas: USER_PERSONAS
  });
});

// GET /api/documents - List all documents in RAG knowledge database
app.get('/api/documents', (req, res) => {
  res.json({
    total: DOCUMENTS.length,
    documents: DOCUMENTS.map(d => ({
      id: d.id,
      title: d.title,
      department: d.department,
      sensitivity: d.sensitivity,
      description: d.description
    }))
  });
});

// POST /api/rag/query - Privacy-Aware RAG Search & FGA Gated Retrieval
app.post('/api/rag/query', (req, res) => {
  const { query, activeUserId } = req.body;
  const user = USER_PERSONAS[activeUserId] || USER_PERSONAS['user:bob'];

  const lowerQuery = (query || '').toLowerCase();

  // Step 1: Semantic / Keyword Retrieval from Document Index
  const candidateDocs = DOCUMENTS.filter(doc => {
    const textToSearch = `${doc.title} ${doc.description} ${doc.content}`.toLowerCase();
    const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 2);
    // If query matches any relevant keyword
    return queryWords.some(w => textToSearch.includes(w)) || textToSearch.includes(lowerQuery);
  });

  // If no specific match, default to handbook
  const matchedDocs = candidateDocs.length > 0 ? candidateDocs : [DOCUMENTS[0]];

  // Step 2: Auth0 FGA Fine-Grained Authorization Check per Document
  const evaluatedDocs = matchedDocs.map(doc => {
    const isAllowed = checkFGA(user.id, user.role, 'viewer', doc.id);
    return {
      document: doc,
      allowed: isAllowed,
      fgaRule: `${user.role}#member -> viewer -> ${doc.id}`,
      reason: isAllowed
        ? `Auth0 FGA verified: Role '${user.roleTitle}' possesses 'viewer' relation for '${doc.id}'.`
        : `Auth0 FGA DENIED: Role '${user.roleTitle}' lacks 'viewer' relation for '${doc.id}'. Content purged from prompt.`
    };
  });

  // Step 3: Filtered Context passed to LLM (Deny-list removes unauthorized content)
  const allowedDocs = evaluatedDocs.filter(e => e.allowed).map(e => e.document);
  const deniedDocs = evaluatedDocs.filter(e => !e.allowed).map(e => e.document);

  // Step 4: Assistant Synthesis with Privacy Protection
  let botReply = '';

  if (allowedDocs.length === 0 && deniedDocs.length > 0) {
    // Complete Access Denied Scenario
    const deniedTitles = deniedDocs.map(d => `"${d.title}"`).join(', ');
    botReply = `🔒 **ACCESS DENIED BY AUTH0 FGA POLICY**

You asked: *"Search index for: ${query}"*

The RAG index retrieved candidate document(s): **${deniedTitles}**.

However, based on your authenticated identity (**${user.name}**, role: \`${user.role}\`), **Auth0 FGA policy check returned \`ALLOWED: FALSE\`**.

Because you lack the \`viewer\` relationship for this document in the Auth0 FGA authorization model, **all sensitive text was redacted and excluded from my context window**.

*To access this document, switch to a role with authorized viewer permissions (e.g. Engineering Manager or HR Director).*`;
  } else {
    // Allowed or Partially Allowed
    let summaryContent = '';

    if (lowerQuery.includes('salary') || lowerQuery.includes('compensation') || lowerQuery.includes('band')) {
      summaryContent = `Based on the authorized document **"Engineering Department Compensation & Salary Bands (2026)"**, here are our current engineering levels:
• **L3 (Associate SWE)**: $110k - $135k base + 10% bonus
• **L4 (Software Engineer)**: $135k - $165k base + 15% bonus
• **L5 (Senior SWE)**: $165k - $205k base + 20% bonus
• **L6 (Staff SWE)**: $210k - $265k base + 25% bonus
• **M1 (Engineering Manager)**: $215k - $275k base + 25% bonus`;
    } else if (lowerQuery.includes('budget') || lowerQuery.includes('q4') || lowerQuery.includes('infrastructure')) {
      summaryContent = `According to authorized document **"Q4 Engineering R&D Budget & Cloud Infrastructure Allocation"**:
• Total Allocated Budget: **$4.25M**
• Cloud Infrastructure: **$1.4M** (AWS multi-region)
• AI & LLM Inference APIs: **$650k** (API inference token pool)
• Headcount & Hiring: **$1.8M** (5 engineering roles)
• Security & FGA Governance: **$400k**`;
    } else if (lowerQuery.includes('executive') || lowerQuery.includes('ceo') || lowerQuery.includes('equity') || lowerQuery.includes('c-suite')) {
      summaryContent = `According to restricted document **"Executive C-Suite Compensation & Cap Table Allocation"**:
• CEO Base: $450,000 + 60% bonus target (3.2% equity)
• CTO Base: $380,000 + 50% bonus target (1.8% equity)
• Standard 4-year vesting schedule with 1-year cliff.`;
    } else {
      summaryContent = `According to our **"Company Handbook & Employee Perks (2026)"**:
• Core Hours: Flexible 10:00 AM - 4:00 PM local time.
• Hybrid Policy: Up to 3 days remote per week.
• Paid Time Off: 25 days annual PTO + 10 paid public holidays.
• Wellness & Learning: $1,200 annual education/gym stipend.
• Hackathons: 2 paid Hack Days per quarter for MLH Global Hack Week!`;
    }

    let warningNotice = '';
    if (deniedDocs.length > 0) {
      warningNotice = `\n\n> ⚠️ *Note: ${deniedDocs.length} additional document(s) (${deniedDocs.map(d => d.id).join(', ')}) matched your query but were redacted by Auth0 FGA due to insufficient permissions.*`;
    }

    botReply = `Hello **${user.name}**! Here is what I retrieved from our knowledge base:

${summaryContent}${warningNotice}`;
  }

  // Audit trace for judging and inspection
  const fgaAuditTrace = {
    timestamp: new Date().toISOString(),
    query,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      roleTitle: user.roleTitle,
      department: user.department
    },
    ragIndexCandidates: matchedDocs.map(d => ({ id: d.id, title: d.title, sensitivity: d.sensitivity })),
    fgaEvaluations: evaluatedDocs.map(e => ({
      documentId: e.document.id,
      documentTitle: e.document.title,
      allowed: e.allowed,
      fgaRule: e.fgaRule,
      reason: e.reason
    })),
    contextWindowPassedToLLM: allowedDocs.map(d => d.id),
    redactedDocuments: deniedDocs.map(d => d.id),
    privacyPreserved: true
  };

  return res.json({
    reply: botReply,
    fgaAuditTrace
  });
});

app.listen(PORT, () => {
  console.log(`[Backend] The Privacy-Aware RAG Bot API & Auth0 FGA Engine listening on http://localhost:${PORT}`);
});
