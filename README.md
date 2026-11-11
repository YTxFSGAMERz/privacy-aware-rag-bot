# 🔒 The Privacy-Aware RAG Bot (Auth0 FGA & Document Access Control)

> **MLH Global Hack Week: Builders Week Challenge**  
> *"The Privacy-Aware RAG Bot (Focus: Auth0 FGA)"*

An internal-facing HR and corporate knowledge assistant that sources answers from an enterprise document index (**RAG**) while enforcing strict document-level authorization using **Auth0 FGA (Fine-Grained Authorization / ReBAC)** before any content reaches the LLM context window.

---

## 🎯 Success Criteria Met & Verified

- [x] **Auth0 FGA Authorization Model**: Formulated and enforced a relationship-based authorization model (`type user`, `type role`, `type document`, with `viewer: [user, role#member]` relations).
- [x] **Demonstrated Manager vs General Employee Access**:
  - **General Employee (Bob)**: Can access public company handbook, but when querying salaries or Q4 budget, **Auth0 FGA denies retrieval** (`ALLOWED: FALSE`) and redacts the document from the prompt context.
  - **Engineering Manager (Alice)**: Possesses the `viewer` relationship for engineering compensation and Q4 budget documents, successfully retrieving the confidential data.
  - **HR Director (Carol)**: Authorized across all organizational tiers, including restricted executive equity and performance records.
- [x] **Retrieval-Time Access Denial**: Sensitive documents are filtered at retrieval time, guaranteeing the language model cannot hallucinate or leak unauthorized organizational data.
- [x] **Live FGA Evaluation Trace**: Every response provides an inspectable audit trail detailing candidate documents, FGA tuple checks, and context window redactions.

---

## 📐 Architecture & Pipeline

```text
┌─────────────────┐       ┌────────────────────┐       ┌────────────────────────┐
│ User Query via  │ ────> │ RAG Index Search   │ ────> │ Candidate Documents    │
│ Active Role     │       │ (Vector / Keyword) │       │ Retrieved from Store   │
└─────────────────┘       └────────────────────┘       └────────────────────────┘
                                                                    │
                                                                    ▼
                                                       ┌────────────────────────┐
                                                       │ Auth0 FGA Engine       │
                                                       │ ReBAC Tuple Evaluation │
                                                       │ (can_view check)       │
                                                       └────────────────────────┘
                                                              /          \
                                                      ALLOWED              DENIED
                                                            /              \
                                                           ▼                ▼
                                               ┌──────────────────┐   ┌───────────────────────────┐
                                               │ Document Content │   │ Document Redacted &       │
                                               │ Passed to LLM    │   │ Purged from Prompt Context│
                                               └──────────────────┘   └───────────────────────────┘
```

---

## ⚡ Quick Start

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/YTxFSGAMERz/privacy-aware-rag-bot.git
cd privacy-aware-rag-bot
npm install
```

### 2. Configure Auth0 Application

1. In your [Auth0 Dashboard](https://manage.auth0.com/), register:
   - **Allowed Callback URLs**: `http://localhost:5176`
   - **Allowed Logout URLs**: `http://localhost:5176`
   - **Allowed Web Origins**: `http://localhost:5176`
2. Add credentials to `.env.local`:
   ```env
   VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
   VITE_AUTH0_CLIENT_ID=your-client-id
   PORT=3003
   ```

### 3. Run Full-Stack System

```bash
npm run dev
```

Launches:
- **Express Backend API & FGA Engine**: `http://localhost:3003`
- **Vite Frontend Client**: `http://localhost:5176`

Open **[http://localhost:5176](http://localhost:5176)** in your browser!

---

## 🎮 How to Test the FGA Access Denial

1. **Test as General Employee (Bob)**:
   - Make sure **Bob Jenkins** (`role:general_employee`) is selected in the top Persona Switcher.
   - Click preset *"💰 Engineering Salaries (Sensitive)"*.
   - **Observed Result**: The bot displays a red banner: **"ACCESS DENIED BY AUTH0 FGA POLICY"**, explaining that `role:general_employee` lacks the `viewer` relation for `doc:engineering_salaries_2026`.
2. **Test as Engineering Manager (Alice)**:
   - Click on **Alice Chang** (`role:engineering_manager`) in the Persona Switcher.
   - Run the exact same query: *"What are the engineering salary bands?"*.
   - **Observed Result**: Access is **GRANTED**, citing the L3-L6 engineering salary ranges!
3. **Inspect the FGA Evaluation Trace**:
   - Click **"View Auth0 FGA Security Check"** under any message to inspect the live tuple check logic.

---

## 📋 Major League Hacking (MLH) Submission

When submitting on the [MLH Challenge Page](https://www.mlh.com/events/global-hack-week-builders-week/challenges/01a1ad3d-291b-dd4a-ddeb-9b2ef0b791bb/submissions/new):

- **Project URL**: `https://github.com/YTxFSGAMERz/privacy-aware-rag-bot`
- **Technologies Used**:
  ```
  React 19, Vite, Node.js, Express, @auth0/auth0-react, Auth0 FGA (Fine-Grained Authorization), OpenFGA / ReBAC (Relationship-Based Access Control), RAG (Retrieval-Augmented Generation), REST API, Lucide Icons, CSS3
  ```
- **Description**: Click **MLH Submission** in the app header to copy the complete Markdown summary.
- **Screenshots**: Take two screenshots:
  1. Bob (General Employee) getting **Access Denied** on salary documents.
  2. Alice (Engineering Manager) getting **Access Granted** on the same salary document.

---

## 📄 License

MIT
