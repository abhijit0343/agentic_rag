export const INITIAL_MOCK_FILES = [
  {
    id: 'doc-1',
    name: 'Q3_Vendor_Master_Agreement_Amended.pdf',
    size: 2480000,
    type: 'application/pdf',
    extension: 'PDF',
    pageCount: 42,
    status: 'ready',
    progress: 100,
    summarySnippet: 'Master services agreement outlining indemnification liability caps, payment schedules, and SLA obligations.'
  },
  {
    id: 'doc-2',
    name: 'FY2025_Operating_Budget_Forecast.xlsx',
    size: 1120000,
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extension: 'XLSX',
    pageCount: 8,
    status: 'ready',
    progress: 100,
    summarySnippet: 'Quarterly breakdown of departmental expenditures, cloud compute infrastructure allocation, and variance analysis.'
  },
  {
    id: 'doc-3',
    name: 'Executive_Board_Briefing_Deck.pptx',
    size: 4760000,
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    extension: 'PPTX',
    pageCount: 19,
    status: 'ready',
    progress: 100,
    summarySnippet: 'Strategy synthesis for European expansion, operational headcount projection, and risk mitigation roadmap.'
  }
];

export const INITIAL_AGENT_STEPS = [
  {
    id: 'step-1',
    title: 'Parsing document structures',
    description: 'Deconstructing 69 total pages across 3 formats into semantic hierarchy.',
    status: 'done',
    startedAt: '10:42:01.04',
    completedAt: '10:42:03.22',
    logs: [
      { timestamp: '10:42:01.08', message: 'PDF raster check passed. Native text layer found (14,280 words).' },
      { timestamp: '10:42:01.84', message: 'Parsed 14 tabular sheets from FY2025_Operating_Budget_Forecast.xlsx.' },
      { timestamp: '10:42:02.90', message: 'Extracted speaker notes and slide shapes from PPTX briefing.' }
    ]
  },
  {
    id: 'step-2',
    title: 'Extracting key obligations & financial tables',
    description: 'Isolating liability provisions, cash flow projections, and governance thresholds.',
    status: 'done',
    startedAt: '10:42:03.24',
    completedAt: '10:42:06.10',
    logs: [
      { timestamp: '10:42:03.45', message: 'Identified §14.2 Limitation of Liability (capped at 2x 12-month fees).' },
      { timestamp: '10:42:04.80', message: 'Reconciled currency mismatches in Sheet 3 (EUR/USD conversion parity).' },
      { timestamp: '10:42:05.95', message: 'Cross-referenced Slide 7 cloud expense against Tab 2 OpEx actuals.' }
    ]
  },
  {
    id: 'step-3',
    title: 'Cross-checking discrepancies & risk synthesis',
    description: 'Evaluating contractual exposure against projected capital commitments.',
    status: 'running',
    startedAt: '10:42:06.12',
    logs: [
      { timestamp: '10:42:06.20', message: 'Evaluating clause conflict: §8 termination notice vs slide 12 roadmap.' },
      { timestamp: '10:42:07.01', message: 'Calculating net variance ratio across FY2025 Q3 forecast.' },
      { timestamp: '10:42:07.82', message: 'Generating inline source attribution anchors.' }
    ]
  },
  {
    id: 'step-4',
    title: 'Formulating executive decision memo',
    description: 'Drafting structured brief with actionable takeaways and citations.',
    status: 'pending',
    logs: []
  }
];

export const MOCK_CITATIONS = [
  {
    id: 1,
    documentName: 'Q3_Vendor_Master_Agreement_Amended.pdf',
    page: 14,
    snippet: '§ 14.2 Neither party shall be liable for consequential damages exceeding aggregate fees paid in the prior twelve (12) month period.'
  },
  {
    id: 2,
    documentName: 'FY2025_Operating_Budget_Forecast.xlsx',
    page: 3,
    snippet: 'Row 48: Infrastructure & Local Inference compute pool: $382,000 projected run-rate with 15% contingency buffer.'
  },
  {
    id: 3,
    documentName: 'Executive_Board_Briefing_Deck.pptx',
    page: 7,
    snippet: 'Slide 7 Milestone 3: SLA threshold mandated at 99.95% uptime with penalty credit accruals commencing Day 45.'
  }
];

export const MOCK_AGENT_RESPONSE = `### Synthesized Executive Memo & Risk Audit

Upon cross-referencing **Q3 Vendor Master Agreement** against the **FY2025 Operating Budget** and **Executive Briefing Deck**, three primary strategic alignment points and two material contractual exposures emerge:

1. **Liability Exposure vs. Budget Reserve**
   The Master Agreement bounds vendor indemnification to twelve months of recurring billings [1]. However, operating budget allocations in Row 48 dedicate $382,000 to primary compute dependencies [2]. In a scenario involving prolonged downtime, the maximum recoverable reimbursement equates to only 43% of total projected vendor commitments.

2. **SLA Penalties and Operational Readiness**
   Slide 7 commits the enterprise to an external uptime SLA of 99.95% [3]. The agreement provides no pass-through breach coverage if upstream model hosters experience scheduled downtime exceeding 4.2 hours quarterly.

3. **Immediate Recommended Actions**
   - **Remedy A**: Insert a mutual bilateral carve-out for data breach disclosures under Section 16.
   - **Remedy B**: Adjust Q3 capital expenditure reserves by 7.5% to insulate against infrastructure variance.`;

export const SUGGESTION_PROMPTS = [
  "Summarize key clauses and extract high-risk liabilities",
  "Reconcile figures between the spreadsheet and board deck",
  "Draft an executive decision memo with action points",
  "Audit compliance obligations and notice periods"
];

export const USE_CASES_DATA = [
  {
    id: 'legal',
    label: 'Legal Counsel',
    title: 'Extract indemnities, change of control, and notice triggers',
    description: 'Audit 140-page master service agreements in seconds. Spot unilateral indemnification and hidden auto-renewals without scanning line by line.',
    before: {
      tag: 'Raw Input',
      title: 'Commercial_Lease_Addendum_12.pdf',
      text: 'Section 28.4: In the event Lessee fails to deliver registered notice of non-renewal exactly one hundred eighty (180) days prior to expiration, this lease shall automatically renew for thirty-six (36) additional months at 115% prevailing index value...'
    },
    after: {
      tag: 'Agent Extraction',
      title: 'Actionable Clause Brief',
      text: '⚠️ Unfavorable Auto-Renewal Flagged\n• Deadline: Nov 14, 2026 (180 days prior)\n• Financial Impact: 3-year forced extension with 15% automatic rent escalator.\n• Recommended Action: File formal termination letter before close of business Nov 12.'
    }
  },
  {
    id: 'finance',
    label: 'Finance & M&A',
    title: 'Audit multi-currency spreadsheets against auditor notes',
    description: 'Verify EBITDA reconciliations across complex quarterly decks, cap tables, and debt covenants.',
    before: {
      tag: 'Raw Input',
      title: 'Q2_CapTable_Consolidated_v4.xlsx',
      text: 'Series B liquidation preference: 1.5x non-participating; note footnote 8 regarding senior secured credit facility covenants stipulating minimum debt-service coverage ratio of 1.25x.'
    },
    after: {
      tag: 'Agent Extraction',
      title: 'Audited Financial Memo',
      text: '✓ Covenant Compliance Verified\n• DSCR sits at 1.41x (covenant threshold is 1.25x).\n• Series B preference pool requires $24.8M senior liquidation clearance prior to common distribution.'
    }
  },
  {
    id: 'research',
    label: 'Scientific Research',
    title: 'Cross-analyze clinical study methodology across 10 papers',
    description: 'Map patient sample sizes, p-value margins, and contradictory findings across preprints and peer-reviewed journals.',
    before: {
      tag: 'Raw Input',
      title: 'Meta_Analysis_Cohort_N800.pdf',
      text: 'Cohort A (n=412) exhibited statistically significant reduction in biomarker delta (p < 0.01), whereas Cohort B (n=388) control showed negligible variation over 24 weeks.'
    },
    after: {
      tag: 'Agent Extraction',
      title: 'Comparative Literature Matrix',
      text: '✓ Statistically Sound (n=800 combined)\n• Confirms biomarker degradation across 6-month observation.\n• Contradicts earlier 2024 findings regarding dosage frequency.'
    }
  },
  {
    id: 'students',
    label: 'Academic Studies',
    title: 'Synthesize lecture slides, textbook chapters, and syllabus requirements',
    description: 'Turn dense 800-page academic texts into structured study architectures with direct page references.',
    before: {
      tag: 'Raw Input',
      title: 'Neuroscience_Principles_Ch14.pdf',
      text: 'Action potential propagation along myelinated axons relies upon saltatory conduction at the nodes of Ranvier, characterized by high density voltage-gated Na+ channels.'
    },
    after: {
      tag: 'Agent Extraction',
      title: 'Concept Architecture & Quiz Drill',
      text: '• Core Mechanism: Saltatory conduction boosts velocity 100x via nodal depolarization.\n• Exam Target: Voltage-gated Na+ channel concentration at nodes vs internodes.'
    }
  },
  {
    id: 'operations',
    label: 'Supply Chain & Ops',
    title: 'Parse logistics bills of lading and customs declarations',
    description: 'Reconcile freight forwarder packing slips with ERP inventory manifests and tariff codes.',
    before: {
      tag: 'Raw Input',
      title: 'Freight_BOL_Hamburg_Rotterdam.pdf',
      text: 'HS Code 8471.50.00: 42 crates containing automated processing units. Demurrage charges commence 72 hours post berth clearance at EUR 450/day.'
    },
    after: {
      tag: 'Agent Extraction',
      title: 'Clearance & Demurrage Alert',
      text: '⚠️ Demurrage Clock Active\n• Free Time: 72 hours from vessel berth (expires Thursday 16:00).\n• Potential Penalty: €450 daily per container.'
    }
  }
];

export const PRICING_TIERS = [
  {
    name: 'Research Tier',
    price: '$0',
    cadence: 'Forever complimentary',
    description: 'For individuals analyzing research papers, personal leases, and study materials.',
    features: [
      'Up to 15 document uploads monthly',
      'Max 50MB per file archive',
      'Local model inference support',
      'Standard 3-step synthesis pipeline',
      'Export to Markdown & Plain Text'
    ],
    cta: 'Start with Research',
    inverted: false
  },
  {
    name: 'Professional Edition',
    price: '$39',
    cadence: 'Per seat / monthly',
    description: 'For corporate counsel, investment associates, and operational leads requiring deep multi-file synthesis.',
    features: [
      'Unlimited document uploads',
      'Up to 250MB single file limit (large PDFs & ZIPs)',
      'Sub-clause cross-document audit agent',
      'Verified citations with page thumbnail jump',
      'Export to styled DOCX, PDF, and CSV tables',
      'Priority inference queue (< 3s response)',
      'Configurable data retention TTL (1-30 days)'
    ],
    cta: 'Activate Professional',
    inverted: true,
    highlight: 'Most Selected'
  },
  {
    name: 'Enterprise Sovereign',
    price: 'Custom',
    cadence: 'Billed annually',
    description: 'For defense, healthcare, and financial institutions requiring air-gapped on-premise deployments.',
    features: [
      'Dedicated on-premise Ollama / vLLM cluster',
      'Zero external network dependencies',
      'Custom fine-tuned semantic embeddings',
      'Role-based access control & SAML SSO',
      'SOC2 Type II & HIPAA audit attestations',
      '24/7 dedicated solutions engineering'
    ],
    cta: 'Contact Architecture Team',
    inverted: false
  }
];

export const FAQ_ITEMS = [
  {
    q: 'How does Karta handle large, complex multi-document packages?',
    a: 'Karta converts files into semantic structural trees rather than naive token slices. Tabular sheets in Excel, slide speaker notes in PowerPoint, and scanned pages in PDF are processed through format-specific parsing pipelines before being indexed into an in-memory or persisted Chroma vector collection.'
  },
  {
    q: 'Can I connect this to my private local Llama 3.2 instance?',
    a: 'Yes. Karta was architected to communicate seamlessly with local Ollama endpoints (http://localhost:11434) and custom FastAPI backends. All weights and document embeddings can remain completely isolated inside your private infrastructure.'
  },
  {
    q: 'What is the data retention and confidentiality policy?',
    a: 'By default, uploaded files are processed in ephemeral memory and discarded after synthesis. Your documents are never stored in public models, never transmitted to third-party model training pipelines, and you can purge your session data with a single click at any moment.'
  },
  {
    q: 'How does citation verification work?',
    a: 'Every factual assertion rendered by the agent includes a bracketed citation anchor. Hovering or clicking the anchor highlights the exact source document, page number, and original clause snippet from the source file.'
  },
  {
    q: 'Which file formats are supported?',
    a: 'Karta parses PDF (native and scanned OCR), Word (DOCX/DOC), Excel (XLSX), Comma-Separated Values (CSV), PowerPoint (PPTX), Plain Text (TXT), Markdown, high-resolution scans (PNG/JPG/WEBP), and multi-file ZIP archives.'
  }
];

export const PAST_SESSIONS_MOCK = [
  {
    id: 'ses-101',
    title: 'Series B Term Sheet & Disclosure Reconciliation',
    date: 'Today at 09:15',
    filesCount: 3,
    fileNames: ['TermSheet_Final_Clean.pdf', 'CapTable_July.xlsx', 'InvestorRights_Draft.docx'],
    summary: 'Identified 2 unaligned liquidation preferences and validated affirmative board consent clauses.'
  },
  {
    id: 'ses-102',
    title: 'Commercial Lease Agreement — European Office',
    date: 'Yesterday at 16:40',
    filesCount: 1,
    fileNames: ['Berlin_HQ_Lease_2026.pdf'],
    summary: 'Flagged 180-day non-renewal notification mandate and €4,200 quarterly HVAC maintenance surcharge.'
  },
  {
    id: 'ses-103',
    title: 'Clinical Cohort Trial Synthesis (N=1,420)',
    date: 'Nov 4, 2026',
    filesCount: 4,
    fileNames: ['Methodology_Paper_v2.pdf', 'Patient_Vitals_Matrix.csv', 'Statistical_Appendix.pdf', 'Lab_Results.xlsx'],
    summary: 'Consolidated efficacy indicators and cross-referenced dosage escalations across 12-week test window.'
  }
];

