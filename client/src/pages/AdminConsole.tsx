import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { format } from "date-fns";
import { LogOut, LogIn, FileText, Download, X, Lock } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminConsole() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { adminUser, adminToken, logout: adminLogout, isAuthenticated: isAdminAuthenticated } = useAdminAuth();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Determine if user is authenticated as admin (either via OAuth or admin login)
  const isAdmin = (user && user.role === "admin") || isAdminAuthenticated;

  // Use effect to redirect non-admin users instead of render-phase navigation
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  // Don't render if not admin (will redirect via effect)
  if (!isAdmin) {
    return null;
  }

  const getAllUsers = trpc.admin.getAllUsers.useQuery();
  const getUsersWithScores = trpc.admin.getUsersWithScores.useQuery();
  const getActivityLog = trpc.activity.getAll.useQuery({ limit: 500 });
  const getUserDetail = trpc.admin.getUserDetail.useQuery(
    { userId: selectedUserId! },
    { enabled: selectedUserId !== null }
  );

  const getActionIcon = (action: string) => {
    switch (action) {
      case "login":
        return <LogIn className="w-4 h-4 text-green-600" />;
      case "logout":
        return <LogOut className="w-4 h-4 text-red-600" />;
      case "assessment_submit":
        return <FileText className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      login: "Login",
      logout: "Logout",
      assessment_start: "Started Assessment",
      assessment_submit: "Submitted Assessment",
      answer_question: "Answered Question",
      save_draft: "Saved Draft",
      view_assessment: "Viewed Assessment",
    };
    return labels[action] || action;
  };

  const handleViewDetails = (userId: number) => {
    setSelectedUserId(userId);
    setShowDetailModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Console</h1>
            <p className="text-slate-600">Manage users, view assessments, and monitor activity</p>
            {isAdminAuthenticated && (
              <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Logged in as: <span className="font-semibold">{adminUser?.username}</span>
              </p>
            )}
          </div>
          <Button
            onClick={() => {
              if (isAdminAuthenticated) {
                adminLogout();
              }
              navigate("/");
            }}
            variant="outline"
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="activity">Activity Registry</TabsTrigger>
            <TabsTrigger value="users">Users & Scores</TabsTrigger>
          </TabsList>

          {/* Activity Registry Tab */}
          <TabsContent value="activity">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Activity Registry</h2>
              <p className="text-slate-600 mb-6">
                Complete log of all user activities including logins, logouts, and assessment submissions
              </p>

              {getActivityLog.isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner className="w-6 h-6" />
                </div>
              ) : getActivityLog.error ? (
                <div className="text-center py-12">
                  <p className="text-red-600">Failed to load activity log</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Time</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">User</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Action</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getActivityLog.data && getActivityLog.data.length > 0 ? (
                        getActivityLog.data.map((log, index) => (
                          <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-3 px-4 text-slate-600">
                              {format(new Date(log.timestamp), "MMM dd, HH:mm:ss")}
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-900">{log.userName}</td>
                            <td className="py-3 px-4 text-slate-600">{log.userEmail}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                {getActionIcon(log.action)}
                                <span className="font-medium text-slate-900">{getActionLabel(log.action)}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-600">{log.description}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-600">
                            No activity logs found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Users & Scores Tab */}
          <TabsContent value="users">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Users & Assessment Scores</h2>

              {getUsersWithScores.isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner className="w-6 h-6" />
                </div>
              ) : getUsersWithScores.error ? (
                <div className="text-center py-12">
                  <p className="text-red-600">Failed to load users</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Organisation</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Overall Score</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Assessments</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getUsersWithScores.data && getUsersWithScores.data.length > 0 ? (
                        getUsersWithScores.data.map((item) => (
                          <tr key={item.user.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-3 px-4 font-medium text-slate-900">{item.user.name}</td>
                            <td className="py-3 px-4 text-slate-600">{item.user.email}</td>
                            <td className="py-3 px-4 text-slate-600">{item.user.organisation || "—"}</td>
                            <td className="py-3 px-4">
                              {item.score ? (
                                <div className="font-bold text-slate-900">
                                  {parseFloat(item.score.overallAvg as any).toFixed(1)}/5.0
                                </div>
                              ) : (
                                <span className="text-slate-400">No score</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-slate-600">{item.assessmentCount}</td>
                            <td className="py-3 px-4">
                              <Button size="sm" variant="outline" onClick={() => handleViewDetails(item.user.id)}>
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-600">
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Detail Modal */}
      {showDetailModal && selectedUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">User Details</h2>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedUserId(null);
                }}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {getUserDetail.isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner className="w-6 h-6" />
                </div>
              ) : getUserDetail.error ? (
                <div className="text-center py-12">
                  <p className="text-red-600">Failed to load user details</p>
                </div>
              ) : getUserDetail.data ? (
                <div className="space-y-6">
                  {/* User Info */}
                  <div className="grid md:grid-cols-2 gap-4 pb-6 border-b border-slate-200">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Name</p>
                      <p className="font-semibold text-slate-900">{getUserDetail.data.user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Email</p>
                      <p className="font-semibold text-slate-900">{getUserDetail.data.user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Organisation</p>
                      <p className="font-semibold text-slate-900">{getUserDetail.data.user.organisation || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Role</p>
                      <p className="font-semibold text-slate-900 capitalize">{getUserDetail.data.user.role}</p>
                    </div>
                  </div>

                  {/* Assessments */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Assessments</h3>
                    <div className="space-y-4">
                      {getUserDetail.data.assessments.length === 0 ? (
                        <p className="text-slate-600">No assessments submitted</p>
                      ) : (
                        getUserDetail.data.assessments.map((item) => (
                          <Card key={item.assessment.id} className="p-4 bg-slate-50">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <p className="font-semibold text-slate-900">
                                  {format(new Date(item.assessment.submittedAt!), "MMM dd, yyyy HH:mm")}
                                </p>
                                <p className="text-sm text-slate-600">
                                  {item.assessment.organisation || "No organisation"}
                                </p>
                              </div>
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                PDF
                              </Button>
                            </div>

                            {item.score && (
                              <div className="space-y-4 mt-4 pt-4 border-t border-slate-200">
                                {/* Dimension Scores */}
                                <div>
                                  <p className="text-xs font-semibold text-slate-600 mb-2 uppercase">Dimension Scores</p>
                                  <div className="grid grid-cols-3 gap-3">
                                    {[
                                      { name: "Organisation", score: item.score.organisationAvg },
                                      { name: "Process", score: item.score.processAvg },
                                      { name: "People", score: item.score.peopleAvg },
                                    ].map((dim) => (
                                      <div key={dim.name} className="bg-white p-2 rounded border border-slate-200">
                                        <p className="text-xs text-slate-600">{dim.name}</p>
                                        <p className="font-bold text-slate-900">
                                          {parseFloat(dim.score as any).toFixed(1)}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Category Scores */}
                                <div>
                                  <p className="text-xs font-semibold text-slate-600 mb-2 uppercase">Category Scores</p>
                                  <div className="grid grid-cols-3 gap-3">
                                    {[
                                      { name: "Goals", score: item.score.goalsAvg },
                                      { name: "Structure", score: item.score.structureAvg },
                                      { name: "Management", score: item.score.managementAvg },
                                    ].map((cat) => (
                                      <div key={cat.name} className="bg-white p-2 rounded border border-slate-200">
                                        <p className="text-xs text-slate-600">{cat.name}</p>
                                        <p className="font-bold text-slate-900">
                                          {parseFloat(cat.score as any).toFixed(1)}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Overall Score */}
                                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                                  <p className="text-xs text-slate-600 mb-1">Overall Score</p>
                                  <p className="text-2xl font-bold text-slate-900">
                                    {parseFloat(item.score.overallAvg as any).toFixed(1)}/5.0
                                  </p>
                                </div>
                              </div>
                            )}
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
