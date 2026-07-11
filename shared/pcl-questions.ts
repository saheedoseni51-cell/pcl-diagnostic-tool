/**
 * PCL 3x3 Diagnostic Tool - Questions, Categories, and Scoring Logic
 * 
 * Structure:
 * - 36 questions total
 * - 3 Dimensions: Organisation, Process, People (O, P, Pe)
 * - 3 Categories per dimension: Goals, Structure, Management
 * - 4 questions per category (3 dimensions × 3 categories × 4 questions = 36)
 * - 5-point scale per question (1-5, mapped to options A-E)
 */

export interface Question {
  code: string; // e.g., "O1", "P5", "Pe12"
  section: string; // "Organisation Goals", "Process Structure", etc.
  category: string; // "Goals", "Structure", or "Management"
  dimension: string; // "Organisation", "Process", or "People"
  title: string;
  description: string;
  options: string[]; // 5 options (A-E)
}

export interface Section {
  key: string; // "Goals", "Structure", "Management"
  questions: string[]; // Array of question codes
}

export interface DimensionCategory {
  key: string; // e.g., "O1", "P1", "Pe1"
  questions: string[]; // 4 question codes
  theme: string; // Full category name
}

export const PCL_QUESTIONS: Question[] = [
  // ORGANISATION - Goals (O1-O4)
  {
    code: "O1",
    section: "Organisation Goals",
    category: "Goals",
    dimension: "Organisation",
    title: "Strategic Direction",
    description: "Select the statement that best reflects the organisation's strategic direction.",
    options: [
      "Direction is unclear.",
      "Direction exists but is interpreted differently.",
      "Direction is defined but applied inconsistently.",
      "Direction is clear and guides decisions.",
      "Direction is sharp, shared, and refreshed with evidence.",
    ],
  },
  {
    code: "O2",
    section: "Organisation Goals",
    category: "Goals",
    dimension: "Organisation",
    title: "Mission-to-Priority Alignment",
    description: "Select the statement that best reflects alignment between mission and priorities.",
    options: [
      "Priorities do not reflect mission.",
      "Some priorities reflect mission.",
      "Mission and priorities are broadly aligned.",
      "Priorities are clearly derived from mission.",
      "Mission and priorities are tightly aligned.",
    ],
  },
  {
    code: "O3",
    section: "Organisation Goals",
    category: "Goals",
    dimension: "Organisation",
    title: "Strategic Prioritisation",
    description: "Select the statement that best reflects how the organisation prioritises.",
    options: [
      "Too many priorities compete.",
      "Priority areas exist but shift often.",
      "A defined set exists but sequencing is weak.",
      "Priorities are focused and sequenced.",
      "Priorities are managed as a portfolio.",
    ],
  },
  {
    code: "O4",
    section: "Organisation Goals",
    category: "Goals",
    dimension: "Organisation",
    title: "Goal Cascading",
    description: "Select the statement that best reflects how goals are cascaded.",
    options: [
      "Goals rarely translate to teams.",
      "Some units translate goals.",
      "Goals are cascaded with variation.",
      "Goals are systematically translated.",
      "Goals cascade clearly to team level.",
    ],
  },

  // ORGANISATION - Structure (O5-O8)
  {
    code: "O5",
    section: "Organisation Structure",
    category: "Structure",
    dimension: "Organisation",
    title: "Structural Fitness",
    description: "Select the statement that best reflects the fit of the current structure.",
    options: [
      "Structure does not support delivery.",
      "Some parts support delivery.",
      "Structure is workable but needs redesign.",
      "Structure generally supports delivery.",
      "Structure is intentionally designed for delivery.",
    ],
  },
  {
    code: "O6",
    section: "Organisation Structure",
    category: "Structure",
    dimension: "Organisation",
    title: "Governance Clarity",
    description: "Select the statement that best reflects governance clarity.",
    options: [
      "Roles and escalation paths are unclear.",
      "Governance exists but is not well understood.",
      "Structures are defined but adherence varies.",
      "Governance supports accountability.",
      "Governance is well understood and disciplined.",
    ],
  },
  {
    code: "O7",
    section: "Organisation Structure",
    category: "Structure",
    dimension: "Organisation",
    title: "Accountability Clarity",
    description: "Select the statement that best reflects accountability clarity.",
    options: [
      "Ownership is unclear.",
      "Accountability overlaps create confusion.",
      "Most roles are defined.",
      "Accountability is generally clear.",
      "Accountability is sharply defined.",
    ],
  },
  {
    code: "O8",
    section: "Organisation Structure",
    category: "Structure",
    dimension: "Organisation",
    title: "Cross-Functional Coordination",
    description: "Select the statement that best reflects cross-functional coordination.",
    options: [
      "Functions work independently.",
      "Coordination is reactive.",
      "Coordination exists but varies.",
      "Coordination is structured.",
      "Coordination is embedded and shared.",
    ],
  },

  // ORGANISATION - Management (O9-O12)
  {
    code: "O9",
    section: "Organisation Management",
    category: "Management",
    dimension: "Organisation",
    title: "Executive Decision Discipline",
    description: "Select the statement that best reflects executive decision discipline.",
    options: [
      "Decisions are delayed.",
      "Decisions are made but inconsistent.",
      "Decisions are made and acted on unevenly.",
      "Decisions are timely and followed through.",
      "Decision-making is disciplined and transparent.",
    ],
  },
  {
    code: "O10",
    section: "Organisation Management",
    category: "Management",
    dimension: "Organisation",
    title: "Performance Governance",
    description: "Select the statement that best reflects performance governance.",
    options: [
      "No structured review process.",
      "Review mechanisms exist but are weak.",
      "Performance governance is in place.",
      "Regular reviews use clear metrics.",
      "Performance governance is embedded.",
    ],
  },
  {
    code: "O11",
    section: "Organisation Management",
    category: "Management",
    dimension: "Organisation",
    title: "Management Information Quality",
    description: "Select the statement that best reflects management information quality.",
    options: [
      "Information is fragmented or delayed.",
      "Useful information exists but is incomplete.",
      "Information is available for key issues.",
      "Leaders receive timely useful information.",
      "Information is robust, trusted, and integrated.",
    ],
  },
  {
    code: "O12",
    section: "Organisation Management",
    category: "Management",
    dimension: "Organisation",
    title: "Execution Tracking",
    description: "Select the statement that best reflects execution tracking.",
    options: [
      "Little structured tracking.",
      "Follow-up occurs but not systematically.",
      "Tracking exists but discipline varies.",
      "Actions are routinely tracked.",
      "Execution tracking is highly disciplined.",
    ],
  },

  // PROCESS - Goals (P1-P4)
  {
    code: "P1",
    section: "Process Goals",
    category: "Goals",
    dimension: "Process",
    title: "Process Purpose Clarity",
    description: "Select the statement that best reflects process purpose clarity.",
    options: [
      "Processes lack purpose.",
      "Purpose is recognised but not consistent.",
      "Purposes are generally defined.",
      "Key processes have clear objectives.",
      "Processes are designed around outcomes.",
    ],
  },
  {
    code: "P2",
    section: "Process Goals",
    category: "Goals",
    dimension: "Process",
    title: "Process-to-Strategy Alignment",
    description: "Select the statement that best reflects process-to-strategy alignment.",
    options: [
      "Processes are not connected to strategy.",
      "Some processes support strategy.",
      "Major processes are reasonably aligned.",
      "Core processes are aligned to priorities.",
      "Design and improvement are strategy-driven.",
    ],
  },
  {
    code: "P3",
    section: "Process Goals",
    category: "Goals",
    dimension: "Process",
    title: "Service Standards",
    description: "Select the statement that best reflects service standards.",
    options: [
      "No clear standards.",
      "Some informal expectations.",
      "Standards exist in some areas.",
      "Clear standards are defined.",
      "Standards are embedded and monitored.",
    ],
  },
  {
    code: "P4",
    section: "Process Goals",
    category: "Goals",
    dimension: "Process",
    title: "Critical Process Prioritisation",
    description: "Select the statement that best reflects prioritisation of critical processes.",
    options: [
      "Critical processes are not identified.",
      "Some critical processes are recognised.",
      "Critical processes are known in most areas.",
      "Critical processes get focused attention.",
      "Critical processes are protected and managed.",
    ],
  },

  // PROCESS - Structure (P5-P8)
  {
    code: "P5",
    section: "Process Structure",
    category: "Structure",
    dimension: "Process",
    title: "Process Documentation",
    description: "Select the statement that best reflects process documentation.",
    options: [
      "Processes depend on memory.",
      "Some processes are documented.",
      "Many processes are documented.",
      "Major processes are documented and accessible.",
      "Documentation is current and actively maintained.",
    ],
  },
  {
    code: "P6",
    section: "Process Structure",
    category: "Structure",
    dimension: "Process",
    title: "Standardisation",
    description: "Select the statement that best reflects standardisation.",
    options: [
      "Work is done differently without reason.",
      "Some standardisation exists.",
      "Standard methods are defined.",
      "Execution is largely standardised.",
      "Standardisation is strong and intentional.",
    ],
  },
  {
    code: "P7",
    section: "Process Structure",
    category: "Structure",
    dimension: "Process",
    title: "Process Ownership",
    description: "Select the statement that best reflects process ownership.",
    options: [
      "Ownership is unclear.",
      "Ownership exists in some areas.",
      "Owners are identified in many areas.",
      "Key processes have clear ownership.",
      "Ownership is explicit and respected.",
    ],
  },
  {
    code: "P8",
    section: "Process Structure",
    category: "Structure",
    dimension: "Process",
    title: "Workflow and Handoffs",
    description: "Select the statement that best reflects workflow and handoffs.",
    options: [
      "Work breaks at handoffs.",
      "Handoffs are person-dependent.",
      "Workflow is understood but bottlenecks remain.",
      "Workflows support efficient delivery.",
      "Workflow is streamlined and managed.",
    ],
  },

  // PROCESS - Management (P9-P12)
  {
    code: "P9",
    section: "Process Management",
    category: "Management",
    dimension: "Process",
    title: "Process KPI Tracking",
    description: "Select the statement that best reflects process KPI tracking.",
    options: [
      "Metrics are rarely measured.",
      "Some metrics exist but are limited.",
      "KPI tracking exists for major processes.",
      "KPIs are tracked regularly.",
      "Metrics drive redesign and improvement.",
    ],
  },
  {
    code: "P10",
    section: "Process Management",
    category: "Management",
    dimension: "Process",
    title: "Monitoring Routine",
    description: "Select the statement that best reflects monitoring routines.",
    options: [
      "Reviews occur only when problems arise.",
      "Some review routines exist.",
      "Processes are reviewed periodically.",
      "Regular monitoring supports action.",
      "Monitoring is predictive and disciplined.",
    ],
  },
  {
    code: "P11",
    section: "Process Management",
    category: "Management",
    dimension: "Process",
    title: "Exception Handling",
    description: "Select the statement that best reflects exception handling.",
    options: [
      "Handled case by case.",
      "Recurring issues are recognised.",
      "Exceptions are tracked in many cases.",
      "Structured approaches exist.",
      "Exception handling strengthens controls.",
    ],
  },
  {
    code: "P12",
    section: "Process Management",
    category: "Management",
    dimension: "Process",
    title: "Continuous Improvement",
    description: "Select the statement that best reflects continuous improvement.",
    options: [
      "Changes happen only after serious problems.",
      "Improvement is occasional.",
      "Improvement is recognised but uneven.",
      "Processes are regularly improved.",
      "Continuous improvement is embedded.",
    ],
  },

  // PEOPLE - Goals (Pe1-Pe4)
  {
    code: "Pe1",
    section: "People Goals",
    category: "Goals",
    dimension: "People",
    title: "Workforce Understanding of Strategy",
    description: "Select the statement that best reflects workforce understanding of strategy.",
    options: [
      "Most staff know tasks, not direction.",
      "Awareness exists but varies widely.",
      "Staff broadly understand priorities.",
      "Employees understand priorities and relevance.",
      "Strategic understanding is strong across the workforce.",
    ],
  },
  {
    code: "Pe2",
    section: "People Goals",
    category: "Goals",
    dimension: "People",
    title: "Role-to-Goal Alignment",
    description: "Select the statement that best reflects role-to-goal alignment.",
    options: [
      "Roles are not linked to outcomes.",
      "Some staff can link work to goals.",
      "Role-to-goal alignment exists in principle.",
      "Most roles are clearly linked.",
      "Contribution is explicit and reinforced.",
    ],
  },
  {
    code: "Pe3",
    section: "People Goals",
    category: "Goals",
    dimension: "People",
    title: "Capability Prioritisation",
    description: "Select the statement that best reflects capability prioritisation.",
    options: [
      "Critical capabilities are not identified.",
      "Some gaps are known but not structured.",
      "Capability needs are defined in some areas.",
      "The organisation has a clear view of needed capabilities.",
      "Capability priorities guide investment.",
    ],
  },
  {
    code: "Pe4",
    section: "People Goals",
    category: "Goals",
    dimension: "People",
    title: "Change Readiness",
    description: "Select the statement that best reflects change readiness.",
    options: [
      "Change creates confusion.",
      "Adaptation is uneven.",
      "The workforce is moderately receptive.",
      "Staff are prepared for change.",
      "Change readiness is strong.",
    ],
  },

  // PEOPLE - Structure (Pe5-Pe8)
  {
    code: "Pe5",
    section: "People Structure",
    category: "Structure",
    dimension: "People",
    title: "Role Design Clarity",
    description: "Select the statement that best reflects role design clarity.",
    options: [
      "Many roles no longer fit needs.",
      "Some roles are clear.",
      "Most roles are defined.",
      "Role design is generally clear.",
      "Roles are intentionally designed and refreshed.",
    ],
  },
  {
    code: "Pe6",
    section: "People Structure",
    category: "Structure",
    dimension: "People",
    title: "Reporting and Supervision Logic",
    description: "Select the statement that best reflects reporting and supervision logic.",
    options: [
      "Reporting lines do not support oversight.",
      "Supervision works in some areas.",
      "Reporting structures are generally functional.",
      "Reporting and supervision are well structured.",
      "Structures are deliberately configured for clarity.",
    ],
  },
  {
    code: "Pe7",
    section: "People Structure",
    category: "Structure",
    dimension: "People",
    title: "Talent Deployment Fit",
    description: "Select the statement that best reflects talent deployment fit.",
    options: [
      "People are assigned mainly by availability.",
      "There are attempts to match roles.",
      "Talent deployment is broadly reasonable.",
      "People are generally deployed well.",
      "Deployment is highly intentional.",
    ],
  },
  {
    code: "Pe8",
    section: "People Structure",
    category: "Structure",
    dimension: "People",
    title: "Succession and Pipeline Strength",
    description: "Select the statement that best reflects succession and pipeline strength.",
    options: [
      "Critical roles depend on incumbents.",
      "Potential successors are known informally.",
      "Succession thinking exists in some areas.",
      "A structured pipeline exists.",
      "Succession management is deliberate and integrated.",
    ],
  },

  // PEOPLE - Management (Pe9-Pe12)
  {
    code: "Pe9",
    section: "People Management",
    category: "Management",
    dimension: "People",
    title: "Performance Management Quality",
    description: "Select the statement that best reflects performance management quality.",
    options: [
      "Performance conversations are informal.",
      "A process exists but is not consistent.",
      "Performance management is established.",
      "The system supports accountability and development.",
      "It is robust, trusted, and used actively.",
    ],
  },
  {
    code: "Pe10",
    section: "People Management",
    category: "Management",
    dimension: "People",
    title: "Supervision and Coaching",
    description: "Select the statement that best reflects supervision and coaching.",
    options: [
      "Supervision varies widely.",
      "Some managers provide useful support.",
      "Support is broadly present.",
      "Managers provide structured support.",
      "Coaching is a strong institutional practice.",
    ],
  },
  {
    code: "Pe11",
    section: "People Management",
    category: "Management",
    dimension: "People",
    title: "Learning and Development",
    description: "Select the statement that best reflects learning and development.",
    options: [
      "Training is ad hoc.",
      "Learning exists but is weakly linked.",
      "Development is somewhat structured.",
      "Learning is linked to workforce priorities.",
      "Capability-building is strategic and continuous.",
    ],
  },
  {
    code: "Pe12",
    section: "People Management",
    category: "Management",
    dimension: "People",
    title: "Culture and Behaviour Reinforcement",
    description: "Select the statement that best reflects culture and behaviour reinforcement.",
    options: [
      "Behaviours do not reflect values.",
      "Positive behaviours are encouraged inconsistently.",
      "Culture is recognisable but uneven.",
      "Desired behaviours are generally reinforced.",
      "Culture is actively shaped and visible.",
    ],
  },
];

/**
 * Section definitions: Goals, Structure, Management
 * Each section contains 12 questions (4 from each dimension)
 */
export const SECTIONS: Section[] = [
  {
    key: "Goals",
    questions: ["O1", "O2", "O3", "O4", "P1", "P2", "P3", "P4", "Pe1", "Pe2", "Pe3", "Pe4"],
  },
  {
    key: "Structure",
    questions: ["O5", "O6", "O7", "O8", "P5", "P6", "P7", "P8", "Pe5", "Pe6", "Pe7", "Pe8"],
  },
  {
    key: "Management",
    questions: ["O9", "O10", "O11", "O12", "P9", "P10", "P11", "P12", "Pe9", "Pe10", "Pe11", "Pe12"],
  },
];

/**
 * Dimension-Category mapping for 3x3 heatmap
 * Maps each cell (e.g., O1 = Organisation Goals) to its 4 questions
 */
export const DIMENSION_CATEGORIES: Record<string, DimensionCategory> = {
  O1: {
    key: "O1",
    questions: ["O1", "O2", "O3", "O4"],
    theme: "Organisation Goals",
  },
  O2: {
    key: "O2",
    questions: ["O5", "O6", "O7", "O8"],
    theme: "Organisation Structure",
  },
  O3: {
    key: "O3",
    questions: ["O9", "O10", "O11", "O12"],
    theme: "Organisation Management",
  },
  P1: {
    key: "P1",
    questions: ["P1", "P2", "P3", "P4"],
    theme: "Process Goals",
  },
  P2: {
    key: "P2",
    questions: ["P5", "P6", "P7", "P8"],
    theme: "Process Structure",
  },
  P3: {
    key: "P3",
    questions: ["P9", "P10", "P11", "P12"],
    theme: "Process Management",
  },
  Pe1: {
    key: "Pe1",
    questions: ["Pe1", "Pe2", "Pe3", "Pe4"],
    theme: "People Goals",
  },
  Pe2: {
    key: "Pe2",
    questions: ["Pe5", "Pe6", "Pe7", "Pe8"],
    theme: "People Structure",
  },
  Pe3: {
    key: "Pe3",
    questions: ["Pe9", "Pe10", "Pe11", "Pe12"],
    theme: "People Management",
  },
};

/**
 * Maturity band definitions
 */
export interface MaturityBand {
  label: string;
  color: string;
  minAvg: number;
  maxAvg: number;
}

export const MATURITY_BANDS: MaturityBand[] = [
  { label: "Nascent", color: "#8e2a68", minAvg: 1, maxAvg: 2 },
  { label: "Emerging", color: "#b85f2e", minAvg: 2, maxAvg: 3 },
  { label: "Established", color: "#c59412", minAvg: 3, maxAvg: 4 },
  { label: "Advanced", color: "#2d7f71", minAvg: 4, maxAvg: 4.5 },
  { label: "Leading", color: "#2f6f2f", minAvg: 4.5, maxAvg: 5 },
];

/**
 * Get maturity band for a given average score
 */
export function getMaturityBand(avg: number): MaturityBand {
  if (avg < 2) return MATURITY_BANDS[0];
  if (avg < 3) return MATURITY_BANDS[1];
  if (avg < 4) return MATURITY_BANDS[2];
  if (avg < 4.5) return MATURITY_BANDS[3];
  return MATURITY_BANDS[4];
}

/**
 * Calculate score for a set of answers
 */
export interface ScoreResult {
  cells: Array<{
    cell: string;
    theme: string;
    avg: number;
    pct: number;
    label: string;
    color: string;
  }>;
  organisationGoals: number;
  organisationStructure: number;
  organisationManagement: number;
  processGoals: number;
  processStructure: number;
  processManagement: number;
  peopleGoals: number;
  peopleStructure: number;
  peopleManagement: number;
  organisationAvg: number;
  processAvg: number;
  peopleAvg: number;
  goalsAvg: number;
  structureAvg: number;
  managementAvg: number;
  overallAvg: number;
  organisationPct: number;
  processPct: number;
  peoplePct: number;
  goalsPct: number;
  structurePct: number;
  managementPct: number;
  overallPct: number;
}

export function calculateScore(answers: Record<string, number>): ScoreResult {
  // Calculate cell averages (3x3 grid)
  const cells = Object.entries(DIMENSION_CATEGORIES).map(([cellKey, category]) => {
    const avg = category.questions.reduce((sum, qCode) => sum + (answers[qCode] || 0), 0) / category.questions.length;
    const band = getMaturityBand(avg);
    const pct = ((avg - 1) / 4) * 100;
    return {
      cell: cellKey,
      theme: category.theme,
      avg,
      pct,
      label: band.label,
      color: band.color,
    };
  });

  // Calculate dimension averages (Organisation, Process, People)
  const organisationCells = cells.filter((c) => c.cell.startsWith("O"));
  const processCells = cells.filter((c) => c.cell.startsWith("P"));
  const peopleCells = cells.filter((c) => c.cell.startsWith("Pe"));

  const organisationAvg = organisationCells.reduce((sum, c) => sum + c.avg, 0) / organisationCells.length;
  const processAvg = processCells.reduce((sum, c) => sum + c.avg, 0) / processCells.length;
  const peopleAvg = peopleCells.reduce((sum, c) => sum + c.avg, 0) / peopleCells.length;

  // Calculate category averages (Goals, Structure, Management)
  const goalsCodes = SECTIONS[0].questions;
  const structureCodes = SECTIONS[1].questions;
  const managementCodes = SECTIONS[2].questions;

  const goalsAvg = goalsCodes.reduce((sum, qCode) => sum + (answers[qCode] || 0), 0) / goalsCodes.length;
  const structureAvg = structureCodes.reduce((sum, qCode) => sum + (answers[qCode] || 0), 0) / structureCodes.length;
  const managementAvg = managementCodes.reduce((sum, qCode) => sum + (answers[qCode] || 0), 0) / managementCodes.length;

  // Calculate overall average
  const overallAvg = cells.reduce((sum, c) => sum + c.avg, 0) / cells.length;

  // Convert to percentages
  const pctFromAvg = (avg: number) => ((avg - 1) / 4) * 100;

  return {
    cells,
    organisationGoals: cells.find((c) => c.cell === "O1")?.avg || 0,
    organisationStructure: cells.find((c) => c.cell === "O2")?.avg || 0,
    organisationManagement: cells.find((c) => c.cell === "O3")?.avg || 0,
    processGoals: cells.find((c) => c.cell === "P1")?.avg || 0,
    processStructure: cells.find((c) => c.cell === "P2")?.avg || 0,
    processManagement: cells.find((c) => c.cell === "P3")?.avg || 0,
    peopleGoals: cells.find((c) => c.cell === "Pe1")?.avg || 0,
    peopleStructure: cells.find((c) => c.cell === "Pe2")?.avg || 0,
    peopleManagement: cells.find((c) => c.cell === "Pe3")?.avg || 0,
    organisationAvg,
    processAvg,
    peopleAvg,
    goalsAvg,
    structureAvg,
    managementAvg,
    overallAvg,
    organisationPct: pctFromAvg(organisationAvg),
    processPct: pctFromAvg(processAvg),
    peoplePct: pctFromAvg(peopleAvg),
    goalsPct: pctFromAvg(goalsAvg),
    structurePct: pctFromAvg(structureAvg),
    managementPct: pctFromAvg(managementAvg),
    overallPct: pctFromAvg(overallAvg),
  };
}
