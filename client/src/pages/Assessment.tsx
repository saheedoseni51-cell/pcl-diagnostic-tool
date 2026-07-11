import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { PCL_QUESTIONS, SECTIONS } from "@shared/pcl-questions";
import { toast } from "sonner";

export default function Assessment() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createDraft = trpc.assessment.createDraft.useMutation();
  const getDraft = trpc.assessment.getDraft.useQuery();
  const saveAnswers = trpc.assessment.saveAnswers.useMutation();
  const submit = trpc.assessment.submit.useMutation();

  // Initialize or load draft
  useEffect(() => {
    const init = async () => {
      if (!user) return;

      try {
        // Check if there's an existing draft
        if (getDraft.data) {
          setAssessmentId(getDraft.data.id);
          // Load answers from draft (would need to fetch them)
        } else {
          // Create new draft
          const result = await createDraft.mutateAsync({
            participantName: user.name || undefined,
            organisation: user.organisation || undefined,
          });
          setAssessmentId(result.id);
        }
      } catch (error) {
        toast.error("Failed to initialize assessment");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [user, getDraft.data, createDraft]);

  const handleAnswerChange = (questionCode: string, score: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionCode]: score,
    }));

    // Auto-save after a short delay
    const timer = setTimeout(() => {
      if (assessmentId) {
        saveAnswers.mutate({
          assessmentId,
          answers: { ...answers, [questionCode]: score },
        });
      }
    }, 1000);

    return () => clearTimeout(timer);
  };

  const handleSubmit = async () => {
    if (!assessmentId) {
      toast.error("Assessment not initialized");
      return;
    }

    const answeredCount = Object.keys(answers).length;
    if (answeredCount !== 36) {
      toast.error(`Please answer all 36 questions. (${answeredCount}/36 answered)`);
      return;
    }

    setIsSubmitting(true);
    try {
      await submit.mutateAsync({ assessmentId });
      toast.success("Assessment submitted successfully!");
      navigate("/results");
    } catch (error) {
      toast.error("Failed to submit assessment");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !assessmentId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  const section = SECTIONS[currentSection];
  const sectionQuestions = PCL_QUESTIONS.filter((q) => section.questions.includes(q.code));
  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / 36) * 100;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">PCL 3×3 Assessment</h1>
          <p className="text-slate-600">
            Section {currentSection + 1} of {SECTIONS.length}: {section.key}
          </p>
        </div>

        {/* Progress */}
        <Card className="mb-8 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-700">
              Progress: {answeredCount} / 36 questions answered
            </span>
            <span className="text-sm text-slate-600">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </Card>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {sectionQuestions.map((question) => (
            <Card key={question.code} className="p-6 hover:shadow-md transition-shadow">
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-wider">
                      {question.code}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">{question.title}</h3>
                  </div>
                  <span className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                    {question.dimension}
                  </span>
                </div>
                <p className="text-slate-600 text-sm">{question.description}</p>
              </div>

              {/* Radio Options */}
              <RadioGroup
                value={answers[question.code]?.toString() || ""}
                onValueChange={(value) => handleAnswerChange(question.code, parseInt(value))}
              >
                <div className="space-y-3">
                  {question.options.map((option, index) => {
                    const score = index + 1;
                    const isSelected = answers[question.code] === score;
                    return (
                      <div
                        key={score}
                        className={`flex items-start space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <RadioGroupItem value={score.toString()} id={`${question.code}-${score}`} className="mt-1" />
                        <Label
                          htmlFor={`${question.code}-${score}`}
                          className="flex-1 cursor-pointer text-slate-700"
                        >
                          <span className="font-semibold text-blue-600 mr-2">
                            {String.fromCharCode(64 + score)}.
                          </span>
                          {option}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>
            </Card>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
          >
            Previous Section
          </Button>

          <div className="flex items-center gap-2">
            {SECTIONS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSection(index)}
                className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                  index === currentSection
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentSection === SECTIONS.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={answeredCount !== 36 || isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting ? <Spinner className="w-4 h-4 mr-2" /> : null}
              Submit Assessment
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentSection(Math.min(SECTIONS.length - 1, currentSection + 1))}
            >
              Next Section
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
