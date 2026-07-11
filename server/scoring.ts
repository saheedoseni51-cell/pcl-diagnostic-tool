/**
 * Scoring utilities for PCL 3x3 assessment
 */

export interface Answer {
  dimensionIndex: number; // 0: Organisation, 1: Process, 2: People
  categoryIndex: number; // 0: Goals, 1: Structure, 2: Management
  score: number; // 1-5
}

export interface ScoringResult {
  // Dimension averages
  organisationAvg: number;
  processAvg: number;
  peopleAvg: number;

  // Category averages
  goalsAvg: number;
  structureAvg: number;
  managementAvg: number;

  // Section scores (9 sections)
  organisationGoals: string;
  organisationStructure: string;
  organisationManagement: string;
  processGoals: string;
  processStructure: string;
  processManagement: string;
  peopleGoals: string;
  peopleStructure: string;
  peopleManagement: string;

  // Overall average
  overallAvg: number;

  // Percentages
  goalsPct: string;
  structurePct: string;
  managementPct: string;
}

export function calculateScores(answers: Answer[]): ScoringResult {
  // Initialize accumulators for each section
  const sections: Record<string, number[]> = {
    organisationGoals: [],
    organisationStructure: [],
    organisationManagement: [],
    processGoals: [],
    processStructure: [],
    processManagement: [],
    peopleGoals: [],
    peopleStructure: [],
    peopleManagement: [],
  };

  // Group answers by section
  const dimensionNames = ["organisation", "process", "people"];
  const categoryNames = ["Goals", "Structure", "Management"];

  answers.forEach((answer) => {
    const sectionKey = `${dimensionNames[answer.dimensionIndex]}${categoryNames[answer.categoryIndex]}`;
    if (sectionKey in sections) {
      sections[sectionKey].push(answer.score);
    }
  });

  // Calculate section averages
  const sectionAverages: Record<string, number> = {};
  Object.entries(sections).forEach(([key, scores]) => {
    sectionAverages[key] = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  });

  // Calculate dimension averages
  const organisationAvg = (sectionAverages.organisationGoals + sectionAverages.organisationStructure + sectionAverages.organisationManagement) / 3;
  const processAvg = (sectionAverages.processGoals + sectionAverages.processStructure + sectionAverages.processManagement) / 3;
  const peopleAvg = (sectionAverages.peopleGoals + sectionAverages.peopleStructure + sectionAverages.peopleManagement) / 3;

  // Calculate category averages
  const goalsAvg = (sectionAverages.organisationGoals + sectionAverages.processGoals + sectionAverages.peopleGoals) / 3;
  const structureAvg = (sectionAverages.organisationStructure + sectionAverages.processStructure + sectionAverages.peopleStructure) / 3;
  const managementAvg = (sectionAverages.organisationManagement + sectionAverages.processManagement + sectionAverages.peopleManagement) / 3;

  // Calculate overall average
  const overallAvg = (organisationAvg + processAvg + peopleAvg) / 3;

  // Calculate percentages
  const goalsPct = Math.round((goalsAvg / 5) * 100).toString();
  const structurePct = Math.round((structureAvg / 5) * 100).toString();
  const managementPct = Math.round((managementAvg / 5) * 100).toString();

  return {
    organisationAvg,
    processAvg,
    peopleAvg,
    goalsAvg,
    structureAvg,
    managementAvg,
    organisationGoals: sectionAverages.organisationGoals.toFixed(1),
    organisationStructure: sectionAverages.organisationStructure.toFixed(1),
    organisationManagement: sectionAverages.organisationManagement.toFixed(1),
    processGoals: sectionAverages.processGoals.toFixed(1),
    processStructure: sectionAverages.processStructure.toFixed(1),
    processManagement: sectionAverages.processManagement.toFixed(1),
    peopleGoals: sectionAverages.peopleGoals.toFixed(1),
    peopleStructure: sectionAverages.peopleStructure.toFixed(1),
    peopleManagement: sectionAverages.peopleManagement.toFixed(1),
    overallAvg,
    goalsPct,
    structurePct,
    managementPct,
  };
}

export function getMaturityLevel(score: number): string {
  if (score < 2) return "Nascent";
  if (score < 3) return "Emerging";
  if (score < 4) return "Established";
  if (score < 4.5) return "Advanced";
  return "Leading";
}
