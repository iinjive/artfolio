import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import Home from "@/pages/home";
import ProjectDetail from "@/pages/project-detail";
import NotFound from "@/pages/not-found";
import AdminLogin from "@/pages/admin-login";
import EnhancedAdminDashboard from "@/pages/enhanced-admin-dashboard";
import RealTimeProjectEditor from "@/pages/real-time-project-editor";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/project/:id" component={ProjectDetail} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/editor/:id" component={({ params }) => <RealTimeProjectEditor projectId={params.id} />} />
      <Route path="/admin/editor" component={() => <RealTimeProjectEditor />} />
      <Route path="/admin" component={EnhancedAdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
