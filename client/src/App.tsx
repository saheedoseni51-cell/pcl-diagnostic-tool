import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Overview from "./pages/Overview";
import Assessment from "./pages/Assessment";
import Results from "./pages/Results";
import AdminConsole from "./pages/AdminConsole";
import { useAuth } from "./_core/hooks/useAuth";

function Router() {
  const { user, isAuthenticated } = useAuth();

  return (
    <Switch>
      {/* Public routes */}
      <Route path={"/"} component={Home} />

      {/* Protected routes - require authentication */}
      {isAuthenticated && (
        <>
          <Route path={"/overview"} component={Overview} />
          <Route path={"/assessment"} component={Assessment} />
          <Route path={"/results"} component={Results} />

          {/* Admin-only routes */}
          {user?.role === "admin" && <Route path={"/admin"} component={AdminConsole} />}
        </>
      )}

      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
