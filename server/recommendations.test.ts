import { describe, it, expect } from "vitest";
import { getRecommendations, getAllRecommendations } from "@shared/recommendations";

/**
 * Helper function to determine maturity level from score
 * (mirrors the logic in getRecommendations)
 */
function getMaturityLevel(score: number) {
  if (score < 2) return "Nascent";
  if (score < 3) return "Emerging";
  if (score < 4) return "Established";
  if (score < 4.5) return "Advanced";
  return "Leading";
}

describe("Recommendations Engine", () => {
  describe("Maturity Level Mapping", () => {
    it("should correctly map scores to maturity levels", () => {
      expect(getMaturityLevel(1.0)).toBe("Nascent");
      expect(getMaturityLevel(1.9)).toBe("Nascent");
      expect(getMaturityLevel(2.0)).toBe("Emerging");
      expect(getMaturityLevel(2.9)).toBe("Emerging");
      expect(getMaturityLevel(3.0)).toBe("Established");
      expect(getMaturityLevel(3.9)).toBe("Established");
      expect(getMaturityLevel(4.0)).toBe("Advanced");
      expect(getMaturityLevel(4.4)).toBe("Advanced");
      expect(getMaturityLevel(4.5)).toBe("Leading");
      expect(getMaturityLevel(5.0)).toBe("Leading");
    });
  });

  describe("getRecommendations", () => {
    it("should return recommendations for Nascent level Organisation-Goals", () => {
      const rec = getRecommendations("Goals", "Organisation", "Nascent", 1.5);

      expect(rec).toBeDefined();
      expect(rec.category).toBe("Goals");
      expect(rec.dimension).toBe("Organisation");
      expect(rec.maturityLevel).toBe("Nascent");
      expect(rec.currentScore).toBe(1.5);
      expect(rec.recommendations.length).toBeGreaterThan(0);
      expect(rec.recommendations[0].title).toBeDefined();
      expect(rec.recommendations[0].description).toBeDefined();
      expect(rec.recommendations[0].actionItems.length).toBeGreaterThan(0);
      expect(rec.recommendations[0].priority).toBe("high");
    });

    it("should return recommendations for Emerging level Process-Structure", () => {
      const rec = getRecommendations("Structure", "Process", "Emerging", 2.5);

      expect(rec.maturityLevel).toBe("Emerging");
      expect(rec.recommendations[0].priority).toBe("high");
    });

    it("should return recommendations for Established level People-Management", () => {
      const rec = getRecommendations("Management", "People", "Established", 3.5);

      expect(rec.maturityLevel).toBe("Established");
      expect(rec.recommendations[0].priority).toBe("medium");
    });

    it("should return recommendations for Advanced level Organisation-Structure", () => {
      const rec = getRecommendations("Structure", "Organisation", "Advanced", 4.2);

      expect(rec.maturityLevel).toBe("Advanced");
      expect(rec.recommendations[0].priority).toBe("medium");
    });

    it("should return recommendations for Leading level Process-Goals", () => {
      const rec = getRecommendations("Goals", "Process", "Leading", 4.8);

      expect(rec.maturityLevel).toBe("Leading");
      expect(rec.recommendations[0].priority).toBe("low");
    });

    it("should include next level guidance for non-Leading levels", () => {
      const rec = getRecommendations("Goals", "Organisation", "Nascent", 1.5);

      expect(rec.nextLevelGuidance).toBeDefined();
      expect(rec.nextLevelGuidance).toContain("Emerging");
    });

    it("should not include next level guidance for Leading level", () => {
      const rec = getRecommendations("Goals", "Organisation", "Leading", 4.8);

      expect(rec.nextLevelGuidance).toBeUndefined();
    });
  });

  describe("getAllRecommendations", () => {
    it("should return recommendations for all 9 categories", () => {
      const scores = {
        organisationGoals: 1.5,
        organisationStructure: 2.5,
        organisationManagement: 3.5,
        processGoals: 4.0,
        processStructure: 4.2,
        processManagement: 4.5,
        peopleGoals: 2.0,
        peopleStructure: 3.0,
        peopleManagement: 4.8,
      };

      const allRecs = getAllRecommendations(scores);

      expect(allRecs.length).toBe(9);

      // Check Organisation-Goals (Nascent)
      const orgGoals = allRecs.find((r) => r.dimension === "Organisation" && r.category === "Goals");
      expect(orgGoals).toBeDefined();
      expect(orgGoals!.maturityLevel).toBe("Nascent");

      // Check Process-Goals (Advanced)
      const procGoals = allRecs.find((r) => r.dimension === "Process" && r.category === "Goals");
      expect(procGoals).toBeDefined();
      expect(procGoals!.maturityLevel).toBe("Advanced");

      // Check People-Management (Leading)
      const peopleManagement = allRecs.find((r) => r.dimension === "People" && r.category === "Management");
      expect(peopleManagement).toBeDefined();
      expect(peopleManagement!.maturityLevel).toBe("Leading");
    });

    it("should correctly map all scores to maturity levels", () => {
      const scores = {
        organisationGoals: 1.0,
        organisationStructure: 2.0,
        organisationManagement: 3.0,
        processGoals: 4.0,
        processStructure: 4.5,
        processManagement: 5.0,
        peopleGoals: 1.5,
        peopleStructure: 2.5,
        peopleManagement: 3.5,
      };

      const allRecs = getAllRecommendations(scores);

      const maturityMap: Record<string, string> = {};
      allRecs.forEach((rec) => {
        maturityMap[`${rec.dimension}-${rec.category}`] = rec.maturityLevel;
      });

      expect(maturityMap["Organisation-Goals"]).toBe("Nascent");
      expect(maturityMap["Organisation-Structure"]).toBe("Emerging");
      expect(maturityMap["Organisation-Management"]).toBe("Established");
      expect(maturityMap["Process-Goals"]).toBe("Advanced");
      expect(maturityMap["Process-Structure"]).toBe("Leading");
      expect(maturityMap["Process-Management"]).toBe("Leading");
      expect(maturityMap["People-Goals"]).toBe("Nascent");
      expect(maturityMap["People-Structure"]).toBe("Emerging");
      expect(maturityMap["People-Management"]).toBe("Established");
    });

    it("should have recommendations for each category and level", () => {
      const scores = {
        organisationGoals: 2.5,
        organisationStructure: 2.5,
        organisationManagement: 2.5,
        processGoals: 2.5,
        processStructure: 2.5,
        processManagement: 2.5,
        peopleGoals: 2.5,
        peopleStructure: 2.5,
        peopleManagement: 2.5,
      };

      const allRecs = getAllRecommendations(scores);

      allRecs.forEach((rec) => {
        expect(rec.recommendations.length).toBeGreaterThan(0);
        expect(rec.recommendations[0].title).toBeDefined();
        expect(rec.recommendations[0].description).toBeDefined();
        expect(rec.recommendations[0].actionItems.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Recommendation content quality", () => {
    it("should have actionable items with specific guidance", () => {
      const rec = getRecommendations("Goals", "Organisation", "Nascent", 1.5);

      rec.recommendations[0].actionItems.forEach((item) => {
        expect(item.length).toBeGreaterThan(10); // Ensure items are detailed
        expect(item).toMatch(/[A-Z]/); // Ensure proper capitalization
      });
    });

    it("should have appropriate priority levels based on maturity", () => {
      const nascent = getRecommendations("Goals", "Organisation", "Nascent", 1.5);
      const emerging = getRecommendations("Goals", "Organisation", "Emerging", 2.5);
      const established = getRecommendations("Goals", "Organisation", "Established", 3.5);
      const advanced = getRecommendations("Goals", "Organisation", "Advanced", 4.2);
      const leading = getRecommendations("Goals", "Organisation", "Leading", 4.8);

      expect(nascent.recommendations[0].priority).toBe("high");
      expect(emerging.recommendations[0].priority).toBe("high");
      expect(established.recommendations[0].priority).toBe("medium");
      expect(advanced.recommendations[0].priority).toBe("medium");
      expect(leading.recommendations[0].priority).toBe("low");
    });

    it("should have realistic timeframes", () => {
      const rec = getRecommendations("Goals", "Organisation", "Nascent", 1.5);

      expect(rec.recommendations[0].timeframe).toMatch(/months|Ongoing/);
    });
  });
});
