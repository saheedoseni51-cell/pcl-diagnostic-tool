import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Overview() {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const dimensions = [
    {
      title: "Organisation",
      description: "How the organisation is structured, governed, and managed",
      categories: ["Goals", "Structure", "Management"],
      color: "from-blue-600 to-blue-700",
    },
    {
      title: "Process",
      description: "How work is designed, executed, and continuously improved",
      categories: ["Goals", "Structure", "Management"],
      color: "from-purple-600 to-purple-700",
    },
    {
      title: "People",
      description: "How talent is developed, aligned, and engaged",
      categories: ["Goals", "Structure", "Management"],
      color: "from-green-600 to-green-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6" style={{backgroundColor: '#05021d'}}>
            <div className="inline-block bg-white bg-opacity-20 px-4 py-2 rounded-lg mb-4">
              <span className="text-sm font-semibold" style={{color: '#ffffff'}}>PCL 3×3 Diagnostic Tool</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Know exactly where your organisation stands
          </h1>
          <p className="text-lg text-slate-200 max-w-2xl mb-8">
            A comprehensive self-assessment framework that evaluates your organisation across three critical dimensions and nine key capability areas. Get clear, actionable insights in minutes.
          </p>
          <Button
            onClick={() => navigate("/assessment")}
            size="lg"
            className="bg-white text-slate-900 hover:bg-slate-100 font-semibold"
          >
            Start Assessment
          </Button>
        </div>
      </div>

      {/* Framework Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-slate-900">The PCL 3×3 Framework</h2>
          <p className="text-slate-600 max-w-3xl mb-8">
            The framework evaluates your organisation across three critical dimensions, each with three capability categories. This creates a comprehensive 3×3 matrix that reveals your strengths and development areas.
          </p>
        </div>

        {/* Dimensions Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {dimensions.map((dimension) => (
            <Card key={dimension.title} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`bg-gradient-to-r ${dimension.color} text-white p-6`}>
                <h3 className="text-2xl font-bold mb-2">{dimension.title}</h3>
                <p className="text-sm opacity-90">{dimension.description}</p>
              </div>
              <div className="p-6">
                <h4 className="font-semibold text-slate-900 mb-3">Capability Categories:</h4>
                <ul className="space-y-2">
                  {dimension.categories.map((cat) => (
                    <li key={cat} className="flex items-center text-slate-700">
                      <span className="w-2 h-2 bg-slate-400 rounded-full mr-3"></span>
                      {cat}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        {/* Matrix Explanation */}
        <Card className="bg-slate-50 p-8 mb-12">
          <h3 className="text-2xl font-bold mb-4 text-slate-900">Understanding the 3×3 Matrix</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">The Three Dimensions:</h4>
              <ul className="space-y-3 text-slate-700">
                <li>
                  <strong>Organisation:</strong> Strategic direction, structure, and management practices
                </li>
                <li>
                  <strong>Process:</strong> How work is designed, standardised, and continuously improved
                </li>
                <li>
                  <strong>People:</strong> Talent management, alignment, and capability development
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">The Three Categories:</h4>
              <ul className="space-y-3 text-slate-700">
                <li>
                  <strong>Goals:</strong> Purpose clarity and strategic alignment
                </li>
                <li>
                  <strong>Structure:</strong> Design, roles, and governance
                </li>
                <li>
                  <strong>Management:</strong> Execution, monitoring, and continuous improvement
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Maturity Levels */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-slate-900">Maturity Levels</h3>
          <p className="text-slate-600 mb-6">
            Each question is scored on a 5-point scale representing your maturity level:
          </p>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { level: "Nascent", color: "bg-red-600", desc: "Ad hoc, inconsistent" },
              { level: "Emerging", color: "bg-orange-600", desc: "Some structure" },
              { level: "Established", color: "bg-yellow-600", desc: "Defined processes" },
              { level: "Advanced", color: "bg-green-600", desc: "Optimised practices" },
              { level: "Leading", color: "bg-emerald-700", desc: "Best-in-class" },
            ].map((band) => (
              <div key={band.level} className="text-center">
                <div className={`${band.color} text-white rounded-lg p-4 mb-2 h-16 flex items-center justify-center font-bold`}>
                  {band.level}
                </div>
                <p className="text-sm text-slate-600">{band.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 text-center">
          <h3 className="text-2xl font-bold mb-3 text-slate-900">Ready to assess your organisation?</h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            The assessment takes approximately 15-20 minutes and provides instant results with a detailed heatmap view of your capabilities across all nine areas.
          </p>
          <Button
            onClick={() => navigate("/assessment")}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            Start Assessment Now
          </Button>
        </Card>
      </div>
    </div>
  );
}
