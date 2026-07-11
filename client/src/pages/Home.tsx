import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { ArrowRight, BarChart3, Users, Activity, Lock } from "lucide-react";
import { AdminLoginModal } from "@/components/AdminLoginModal";
import { AdminPasswordChange } from "@/components/AdminPasswordChange";

export default function Home() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, loading } = useAuth();
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminPasswordChangeOpen, setAdminPasswordChangeOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminIsFirstLogin, setAdminIsFirstLogin] = useState(false);

  // Use effect to redirect authenticated users instead of render-phase navigation
  useEffect(() => {
    if (isAuthenticated && user && !loading) {
      navigate("/overview");
    }
  }, [isAuthenticated, user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render if authenticated (will redirect via effect)
  if (isAuthenticated && user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="w-full bg-slate-900 border-b border-slate-700 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-lg">PCL 3×3</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Sign In
            </Button>
            <Button
              onClick={() => setAdminLoginOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Admin
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div>
            <div className="inline-block bg-blue-500 bg-opacity-20 border border-blue-500 border-opacity-30 px-4 py-2 rounded-full mb-6">
              <span className="text-blue-300 text-sm font-semibold">Organizational Assessment</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Know exactly where your organisation stands
            </h1>

            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              The PCL 3×3 framework provides a comprehensive self-assessment of your organizational capabilities across nine key areas. Get clear, actionable insights in just 15-20 minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold group"
              >
                Start Assessment
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
                onClick={() => {
                  document.getElementById("framework")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="space-y-4">
            {[
              {
                icon: BarChart3,
                title: "3×3 Matrix",
                description: "Evaluate across 3 dimensions and 3 categories for comprehensive insights",
              },
              {
                icon: Users,
                title: "Multi-User",
                description: "Support for individual assessments with admin oversight and analytics",
              },
              {
                icon: Activity,
                title: "Full Tracking",
                description: "Complete activity logs and historical assessment records",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-slate-800 border-slate-700 p-6 hover:border-slate-600 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600 bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">{feature.title}</h3>
                      <p className="text-slate-400 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Framework Section */}
      <div id="framework" className="bg-slate-800 bg-opacity-50 border-t border-slate-700 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">The PCL 3×3 Framework</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              A comprehensive organizational assessment across three critical dimensions and nine capability areas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                dimension: "Organisation",
                color: "from-blue-600 to-blue-700",
                categories: ["Goals", "Structure", "Management"],
                description: "Strategic direction, structure, and management practices",
              },
              {
                dimension: "Process",
                color: "from-purple-600 to-purple-700",
                categories: ["Goals", "Structure", "Management"],
                description: "How work is designed, standardised, and continuously improved",
              },
              {
                dimension: "People",
                color: "from-green-600 to-green-700",
                categories: ["Goals", "Structure", "Management"],
                description: "Talent management, alignment, and capability development",
              },
            ].map((dim) => (
              <Card
                key={dim.dimension}
                className="bg-slate-900 border-slate-700 overflow-hidden hover:border-slate-600 transition-colors"
              >
                <div className={`bg-gradient-to-r ${dim.color} p-6`}>
                  <h3 className="text-2xl font-bold text-white">{dim.dimension}</h3>
                </div>
                <div className="p-6">
                  <p className="text-slate-300 text-sm mb-4">{dim.description}</p>
                  <div className="space-y-2">
                    {dim.categories.map((cat) => (
                      <div key={cat} className="flex items-center text-slate-300">
                        <span className="w-2 h-2 bg-slate-500 rounded-full mr-3"></span>
                        {cat}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to assess your organization?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Sign in to start your assessment. The process takes approximately 15-20 minutes and provides instant results with detailed insights.
          </p>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            size="lg"
            className="bg-white text-blue-600 hover:bg-slate-100 font-semibold"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Card>
      </div>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onLoginSuccess={(token, isFirstLogin) => {
          setAdminToken(token);
          setAdminIsFirstLogin(isFirstLogin);
          setAdminLoginOpen(false);

          // If first login, show password change dialog
          if (isFirstLogin) {
            setAdminPasswordChangeOpen(true);
          } else {
            // Navigate to admin console
            navigate("/admin-console", { state: { adminToken: token } });
          }
        }}
      />

      {/* Admin Password Change Modal */}
      {adminToken && (
        <AdminPasswordChange
          isOpen={adminPasswordChangeOpen}
          onClose={() => setAdminPasswordChangeOpen(false)}
          token={adminToken}
          onPasswordChanged={(newToken) => {
            setAdminToken(newToken);
            setAdminPasswordChangeOpen(false);
            navigate("/admin-console", { state: { adminToken: newToken } });
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900 bg-opacity-50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
          <p>&copy; 2026 PCL 3×3 Diagnostic Tool. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
