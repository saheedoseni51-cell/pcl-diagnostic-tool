import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Download, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Lightbulb } from "lucide-react";
import html2pdf from "html2pdf.js";

export default function Results() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const getLatestSubmitted = trpc.assessment.getLatestSubmitted.useQuery();
  const getDetails = trpc.assessment.getWithDetails.useQuery(
    { assessmentId: getLatestSubmitted.data?.id || "" },
    { enabled: !!getLatestSubmitted.data?.id }
  );
  const getRecommendations = trpc.recommendations.getForLatestAssessment.useQuery();

  const assessment = getLatestSubmitted.data;
  const details = getDetails.data;
  const score = details?.score;
  const recommendations = getRecommendations.data;

  useEffect(() => {
    if (getLatestSubmitted.isLoading === false && !assessment) {
      toast.error("No assessment found. Please complete an assessment first.");
      navigate("/assessment");
    }
  }, [getLatestSubmitted.isLoading, assessment, navigate]);

  const handleDownloadPDF = async () => {
    if (!assessment || !score) {
      toast.error("Assessment data not available");
      return;
    }

    setIsGeneratingPDF(true);
    try {
      const element = document.getElementById("pdf-content");
      if (!element) {
        toast.error("PDF content not found");
        return;
      }

      const opt: any = {
        margin: 10,
        filename: `PCL-Assessment-${assessment.participantName || "Result"}-${new Date().toISOString().split("T")[0]}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
      };

      html2pdf().set(opt).from(element).save();
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      toast.error("Failed to generate PDF");
      console.error(error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (getLatestSubmitted.isLoading || getDetails.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">No Assessment Found</h1>
          <p className="text-slate-600 mb-6">Please complete an assessment first to view results.</p>
          <Button onClick={() => navigate("/assessment")} className="bg-blue-600 hover:bg-blue-700">
            Start Assessment
          </Button>
        </div>
      </div>
    );
  }

  if (!score) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Score Data Not Available</h1>
          <p className="text-slate-600 mb-6">Unable to load assessment scores. Please try again.</p>
          <Button onClick={() => navigate("/assessment")} className="bg-blue-600 hover:bg-blue-700">
            Back to Assessment
          </Button>
        </div>
      </div>
    );
  }

  const dimensionLabels = ["Organisation", "Process", "People"];
  const categoryLabels = ["Goals", "Structure", "Management"];

  // Build heatmap data from score object
  const heatmapData = [
    [
      {
        label: "Org Goals",
        score: parseFloat(score.organisationGoals as any),
        pct: parseFloat(score.goalsPct as any) / 100,
      },
      {
        label: "Org Structure",
        score: parseFloat(score.organisationStructure as any),
        pct: parseFloat(score.structurePct as any) / 100,
      },
      {
        label: "Org Management",
        score: parseFloat(score.organisationManagement as any),
        pct: parseFloat(score.managementPct as any) / 100,
      },
    ],
    [
      { label: "Process Goals", score: parseFloat(score.processGoals as any), pct: parseFloat(score.goalsPct as any) / 100 },
      {
        label: "Process Structure",
        score: parseFloat(score.processStructure as any),
        pct: parseFloat(score.structurePct as any) / 100,
      },
      {
        label: "Process Management",
        score: parseFloat(score.processManagement as any),
        pct: parseFloat(score.managementPct as any) / 100,
      },
    ],
    [
      { label: "People Goals", score: parseFloat(score.peopleGoals as any), pct: parseFloat(score.goalsPct as any) / 100 },
      {
        label: "People Structure",
        score: parseFloat(score.peopleStructure as any),
        pct: parseFloat(score.structurePct as any) / 100,
      },
      {
        label: "People Management",
        score: parseFloat(score.peopleManagement as any),
        pct: parseFloat(score.managementPct as any) / 100,
      },
    ],
  ];

  const getColorClass = (score: number) => {
    if (score < 2) return "bg-red-400";
    if (score < 3) return "bg-orange-400";
    if (score < 4) return "bg-yellow-400";
    if (score < 4.5) return "bg-green-400";
    return "bg-emerald-600";
  };

  const getMaturityLevel = (score: number) => {
    if (score < 2) return "Nascent";
    if (score < 3) return "Emerging";
    if (score < 4) return "Established";
    if (score < 4.5) return "Advanced";
    return "Leading";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-red-500 bg-red-50";
      case "medium":
        return "border-l-4 border-yellow-500 bg-yellow-50";
      case "low":
        return "border-l-4 border-green-500 bg-green-50";
      default:
        return "border-l-4 border-slate-500 bg-slate-50";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "medium":
        return <Lightbulb className="w-5 h-5 text-yellow-600" />;
      case "low":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      default:
        return <Lightbulb className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Assessment Results</h1>
            <p className="text-slate-600">
              {assessment.participantName || user?.name || "Assessment"} • {assessment.organisation || "Organisation"}
            </p>
          </div>
          <Button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isGeneratingPDF ? <Spinner className="w-4 h-4 mr-2" /> : <Download className="w-4 h-4 mr-2" />}
            Download PDF
          </Button>
        </div>

        {/* PDF Content */}
        <div id="pdf-content">
          {/* 3x3 Heatmap */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">PCL 3×3 Capability Heatmap</h2>

            <div className="overflow-x-auto mb-8">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold text-slate-700 bg-slate-100 border border-slate-200">
                      Dimension
                    </th>
                    {categoryLabels.map((cat) => (
                      <th
                        key={cat}
                        className="p-3 text-center text-sm font-semibold text-slate-700 bg-slate-100 border border-slate-200"
                      >
                        {cat}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heatmapData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="p-3 font-semibold text-slate-900 bg-slate-50 border border-slate-200">
                        {dimensionLabels[rowIndex]}
                      </td>
                      {row.map((cell, colIndex) => (
                        <td
                          key={colIndex}
                          className={`p-4 text-center border border-slate-200 ${getColorClass(cell.score)} bg-opacity-30`}
                        >
                          <div className="text-center">
                            <div className="text-2xl font-bold text-slate-900 mb-1">{cell.score.toFixed(1)}</div>
                            <div className="text-xs font-semibold text-slate-700">{getMaturityLevel(cell.score)}</div>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Maturity Legend */}
            <div className="pt-6 border-t border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">Maturity Scale</h3>
              <div className="grid grid-cols-5 gap-4">
                {[
                  { level: "Nascent", range: "1.0-1.9", color: "bg-red-400" },
                  { level: "Emerging", range: "2.0-2.9", color: "bg-orange-400" },
                  { level: "Established", range: "3.0-3.9", color: "bg-yellow-400" },
                  { level: "Advanced", range: "4.0-4.4", color: "bg-green-400" },
                  { level: "Leading", range: "4.5-5.0", color: "bg-emerald-600" },
                ].map((band) => (
                  <div key={band.level} className="text-center">
                    <div className={`${band.color} h-12 rounded-lg mb-2`}></div>
                    <div className="text-xs font-semibold text-slate-900">{band.level}</div>
                    <div className="text-xs text-slate-600">{band.range}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Summary Scores */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Dimension Scores */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Dimension Scores</h3>
              <div className="space-y-4">
                {[
                  { name: "Organisation", score: parseFloat(score.organisationAvg as any) },
                  { name: "Process", score: parseFloat(score.processAvg as any) },
                  { name: "People", score: parseFloat(score.peopleAvg as any) },
                ].map((dim) => (
                  <div key={dim.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">{dim.name}</span>
                      <span className="text-lg font-bold text-slate-900">{dim.score.toFixed(1)}/5.0</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(dim.score / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Category Scores */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Category Scores</h3>
              <div className="space-y-4">
                {[
                  { name: "Goals", score: parseFloat(score.goalsAvg as any) },
                  { name: "Structure", score: parseFloat(score.structureAvg as any) },
                  { name: "Management", score: parseFloat(score.managementAvg as any) },
                ].map((cat) => (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">{cat.name}</span>
                      <span className="text-lg font-bold text-slate-900">{cat.score.toFixed(1)}/5.0</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${(cat.score / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Overall Score */}
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 mb-8">
            <div className="text-center">
              <p className="text-slate-600 mb-2">Overall Capability Score</p>
              <div className="text-5xl font-bold text-slate-900 mb-2">
                {parseFloat(score.overallAvg as any).toFixed(1)}/5.0
              </div>
              <p className="text-slate-600">{getMaturityLevel(parseFloat(score.overallAvg as any))} Maturity Level</p>
            </div>
          </Card>
        </div>

        {/* Personalized Recommendations */}
        {recommendations && recommendations.recommendations && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Personalized Recommendations</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {recommendations.recommendations.map((rec, index) => {
                const categoryKey = `${rec.dimension}-${rec.category}`;
                const isExpanded = expandedCategory === categoryKey;

                return (
                  <Card
                    key={index}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setExpandedCategory(isExpanded ? null : categoryKey)}
                  >
                    <div className={`p-6 ${getPriorityColor(rec.recommendations[0]?.priority || "low")}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          {getPriorityIcon(rec.recommendations[0]?.priority || "low")}
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-900">
                              {rec.dimension} • {rec.category}
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">
                              Current Score: <span className="font-semibold">{rec.currentScore.toFixed(1)}/5.0</span> •{" "}
                              <span className="font-semibold">{rec.maturityLevel}</span>
                            </p>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-600 flex-shrink-0" />
                        )}
                      </div>

                      {isExpanded && rec.recommendations[0] && (
                        <div className="mt-4 pt-4 border-t border-slate-300">
                          <h4 className="font-semibold text-slate-900 mb-2">{rec.recommendations[0].title}</h4>
                          <p className="text-sm text-slate-700 mb-4">{rec.recommendations[0].description}</p>

                          <div className="mb-4">
                            <h5 className="text-sm font-semibold text-slate-900 mb-2">Action Items:</h5>
                            <ul className="space-y-2">
                              {rec.recommendations[0].actionItems.map((item, i) => (
                                <li key={i} className="flex gap-2 text-sm text-slate-700">
                                  <span className="text-slate-400 flex-shrink-0">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>
                              <strong>Priority:</strong> {rec.recommendations[0].priority.charAt(0).toUpperCase() + rec.recommendations[0].priority.slice(1)}
                            </span>
                            <span>
                              <strong>Timeframe:</strong> {rec.recommendations[0].timeframe}
                            </span>
                          </div>

                          {rec.nextLevelGuidance && (
                            <div className="mt-4 p-3 bg-white bg-opacity-50 rounded border border-slate-300">
                              <p className="text-xs text-slate-700">
                                <strong>Next Level:</strong> {rec.nextLevelGuidance}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button variant="outline" onClick={() => navigate("/assessment")}>
            Take Another Assessment
          </Button>
          <Button variant="outline" onClick={() => navigate("/overview")}>
            Back to Overview
          </Button>
        </div>
      </div>
    </div>
  );
}
