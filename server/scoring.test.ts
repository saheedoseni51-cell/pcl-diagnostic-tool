import { describe, it, expect } from "vitest";
import { calculateScores, getMaturityLevel } from "./scoring";

describe("Scoring Logic", () => {
  describe("calculateScores", () => {
    it("should calculate correct dimension averages from answers", () => {
      const answers = [
        // Organisation dimension
        { dimensionIndex: 0, categoryIndex: 0, score: 5 }, // Org Goals
        { dimensionIndex: 0, categoryIndex: 0, score: 4 },
        { dimensionIndex: 0, categoryIndex: 0, score: 3 },
        { dimensionIndex: 0, categoryIndex: 1, score: 5 }, // Org Structure
        { dimensionIndex: 0, categoryIndex: 1, score: 5 },
        { dimensionIndex: 0, categoryIndex: 1, score: 5 },
        { dimensionIndex: 0, categoryIndex: 2, score: 2 }, // Org Management
        { dimensionIndex: 0, categoryIndex: 2, score: 2 },
        { dimensionIndex: 0, categoryIndex: 2, score: 2 },
        // Process dimension
        { dimensionIndex: 1, categoryIndex: 0, score: 4 }, // Process Goals
        { dimensionIndex: 1, categoryIndex: 0, score: 4 },
        { dimensionIndex: 1, categoryIndex: 0, score: 4 },
        { dimensionIndex: 1, categoryIndex: 1, score: 3 }, // Process Structure
        { dimensionIndex: 1, categoryIndex: 1, score: 3 },
        { dimensionIndex: 1, categoryIndex: 1, score: 3 },
        { dimensionIndex: 1, categoryIndex: 2, score: 3 }, // Process Management
        { dimensionIndex: 1, categoryIndex: 2, score: 3 },
        { dimensionIndex: 1, categoryIndex: 2, score: 3 },
        // People dimension
        { dimensionIndex: 2, categoryIndex: 0, score: 5 }, // People Goals
        { dimensionIndex: 2, categoryIndex: 0, score: 5 },
        { dimensionIndex: 2, categoryIndex: 0, score: 5 },
        { dimensionIndex: 2, categoryIndex: 1, score: 4 }, // People Structure
        { dimensionIndex: 2, categoryIndex: 1, score: 4 },
        { dimensionIndex: 2, categoryIndex: 1, score: 4 },
        { dimensionIndex: 2, categoryIndex: 2, score: 4 }, // People Management
        { dimensionIndex: 2, categoryIndex: 2, score: 4 },
        { dimensionIndex: 2, categoryIndex: 2, score: 4 },
      ];

      const scores = calculateScores(answers);

      // Verify dimension averages
      // Organisation: (4 + 5 + 2) / 3 = 3.67
      expect(scores.organisationAvg).toBeCloseTo(3.67, 1);
      // Process: (4 + 3 + 3) / 3 = 3.33
      expect(scores.processAvg).toBeCloseTo(3.33, 1);
      // People: (5 + 4 + 4) / 3 = 4.33
      expect(scores.peopleAvg).toBeCloseTo(4.33, 1);

      // Verify category averages
      // Goals: (4 + 4 + 5) / 3 = 4.33
      expect(scores.goalsAvg).toBeCloseTo(4.33, 1);
      // Structure: (5 + 3 + 4) / 3 = 4.0
      expect(scores.structureAvg).toBeCloseTo(4.0, 1);
      // Management: (2 + 3 + 4) / 3 = 3.0
      expect(scores.managementAvg).toBeCloseTo(3.0, 1);

      // Verify overall average
      // (3.67 + 3.33 + 4.33) / 3 = 3.78
      expect(scores.overallAvg).toBeCloseTo(3.78, 1);
    });

    it("should calculate section scores correctly", () => {
      const answers = [
        // All 5s for one section
        { dimensionIndex: 0, categoryIndex: 0, score: 5 },
        { dimensionIndex: 0, categoryIndex: 0, score: 5 },
        { dimensionIndex: 0, categoryIndex: 0, score: 5 },
        // All 1s for other sections
        { dimensionIndex: 0, categoryIndex: 1, score: 1 },
        { dimensionIndex: 0, categoryIndex: 1, score: 1 },
        { dimensionIndex: 0, categoryIndex: 1, score: 1 },
        { dimensionIndex: 0, categoryIndex: 2, score: 1 },
        { dimensionIndex: 0, categoryIndex: 2, score: 1 },
        { dimensionIndex: 0, categoryIndex: 2, score: 1 },
        // Fill remaining dimensions with 3s
        { dimensionIndex: 1, categoryIndex: 0, score: 3 },
        { dimensionIndex: 1, categoryIndex: 0, score: 3 },
        { dimensionIndex: 1, categoryIndex: 0, score: 3 },
        { dimensionIndex: 1, categoryIndex: 1, score: 3 },
        { dimensionIndex: 1, categoryIndex: 1, score: 3 },
        { dimensionIndex: 1, categoryIndex: 1, score: 3 },
        { dimensionIndex: 1, categoryIndex: 2, score: 3 },
        { dimensionIndex: 1, categoryIndex: 2, score: 3 },
        { dimensionIndex: 1, categoryIndex: 2, score: 3 },
        { dimensionIndex: 2, categoryIndex: 0, score: 3 },
        { dimensionIndex: 2, categoryIndex: 0, score: 3 },
        { dimensionIndex: 2, categoryIndex: 0, score: 3 },
        { dimensionIndex: 2, categoryIndex: 1, score: 3 },
        { dimensionIndex: 2, categoryIndex: 1, score: 3 },
        { dimensionIndex: 2, categoryIndex: 1, score: 3 },
        { dimensionIndex: 2, categoryIndex: 2, score: 3 },
        { dimensionIndex: 2, categoryIndex: 2, score: 3 },
        { dimensionIndex: 2, categoryIndex: 2, score: 3 },
      ];

      const scores = calculateScores(answers);

      // Organisation Goals should be 5.0
      expect(scores.organisationGoals).toBe("5.0");
      // Organisation Structure should be 1.0
      expect(scores.organisationStructure).toBe("1.0");
      // Organisation Management should be 1.0
      expect(scores.organisationManagement).toBe("1.0");
    });

    it("should handle edge cases with minimum scores", () => {
      const answers = Array(27)
        .fill(null)
        .map((_, i) => ({
          dimensionIndex: Math.floor(i / 9),
          categoryIndex: Math.floor((i % 9) / 3),
          score: 1,
        }));

      const scores = calculateScores(answers);

      expect(scores.overallAvg).toBe(1.0);
      expect(scores.organisationAvg).toBe(1.0);
      expect(scores.processAvg).toBe(1.0);
      expect(scores.peopleAvg).toBe(1.0);
    });

    it("should handle edge cases with maximum scores", () => {
      const answers = Array(27)
        .fill(null)
        .map((_, i) => ({
          dimensionIndex: Math.floor(i / 9),
          categoryIndex: Math.floor((i % 9) / 3),
          score: 5,
        }));

      const scores = calculateScores(answers);

      expect(scores.overallAvg).toBe(5.0);
      expect(scores.organisationAvg).toBe(5.0);
      expect(scores.processAvg).toBe(5.0);
      expect(scores.peopleAvg).toBe(5.0);
    });
  });

  describe("getMaturityLevel", () => {
    it("should return correct maturity level for Nascent (1.0-1.9)", () => {
      expect(getMaturityLevel(1.0)).toBe("Nascent");
      expect(getMaturityLevel(1.5)).toBe("Nascent");
      expect(getMaturityLevel(1.9)).toBe("Nascent");
    });

    it("should return correct maturity level for Emerging (2.0-2.9)", () => {
      expect(getMaturityLevel(2.0)).toBe("Emerging");
      expect(getMaturityLevel(2.5)).toBe("Emerging");
      expect(getMaturityLevel(2.9)).toBe("Emerging");
    });

    it("should return correct maturity level for Established (3.0-3.9)", () => {
      expect(getMaturityLevel(3.0)).toBe("Established");
      expect(getMaturityLevel(3.5)).toBe("Established");
      expect(getMaturityLevel(3.9)).toBe("Established");
    });

    it("should return correct maturity level for Advanced (4.0-4.4)", () => {
      expect(getMaturityLevel(4.0)).toBe("Advanced");
      expect(getMaturityLevel(4.2)).toBe("Advanced");
      expect(getMaturityLevel(4.4)).toBe("Advanced");
    });

    it("should return correct maturity level for Leading (4.5-5.0)", () => {
      expect(getMaturityLevel(4.5)).toBe("Leading");
      expect(getMaturityLevel(4.7)).toBe("Leading");
      expect(getMaturityLevel(5.0)).toBe("Leading");
    });
  });

  describe("Score percentages", () => {
    it("should calculate correct percentage values", () => {
      const answers = Array(27)
        .fill(null)
        .map((_, i) => ({
          dimensionIndex: Math.floor(i / 9),
          categoryIndex: Math.floor((i % 9) / 3),
          score: 3.5,
        }));

      const scores = calculateScores(answers);

      // 3.5 / 5.0 = 0.7 = 70%
      const expectedPct = Math.round((3.5 / 5) * 100);
      expect(parseInt(scores.goalsPct)).toBe(expectedPct);
      expect(parseInt(scores.structurePct)).toBe(expectedPct);
      expect(parseInt(scores.managementPct)).toBe(expectedPct);
    });
  });
});
