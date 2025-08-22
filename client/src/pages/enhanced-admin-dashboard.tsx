import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Project } from "@shared/schema";
import { Plus, Edit, Trash2, LogOut, Eye } from "lucide-react";

export default function EnhancedAdminDashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect if not logged in
  if (!user) {
    setLocation("/admin/login");
    return null;
  }

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Project deleted",
        description: "The project has been removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete project",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    // Simple logout by redirecting to login
    setLocation("/admin/login");
  };

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-title font-bold text-slate-100">Admin Dashboard</h1>
              <p className="text-slate-400 text-sm">Welcome back, {user.username}</p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  window.open('/', '_blank');
                }}
                className="border-dark-600 text-slate-300 hover:bg-dark-700"
                data-testid="button-view-site"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Site
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-dark-600 text-slate-300 hover:bg-dark-700"
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Actions */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-title font-semibold text-slate-100">
            Projects ({projects.length})
          </h2>
          <Button
            onClick={() => setLocation("/admin/editor")}
            data-testid="button-add-project"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="text-center text-slate-400 py-12">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center text-slate-400 py-12">
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p>Create your first project to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="group bg-dark-800 rounded-xl border border-dark-700 overflow-hidden hover:border-accent-500/30 transition-all duration-300"
                data-testid={`card-project-${project.id}`}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      const fallback = target.nextElementSibling as HTMLDivElement;
                      target.style.display = 'none';
                      fallback.style.display = 'flex';
                    }}
                  />
                  <div className="hidden h-full w-full items-center justify-center bg-dark-700 text-slate-400">
                    <span className="text-sm">No image</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-title font-semibold text-slate-100 truncate" data-testid={`title-${project.id}`}>
                        {project.title}
                      </h3>
                      <p className="text-sm text-slate-400 truncate" data-testid={`software-${project.id}`}>
                        {project.software}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <span className="px-2 py-1 bg-accent-500/20 text-accent-400 text-xs rounded capitalize">
                        {project.category}
                      </span>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                        {project.size}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setLocation(`/admin/editor/${project.id}`)}
                        className="border-accent-600 text-accent-400 hover:bg-accent-600/10"
                        data-testid={`button-edit-${project.id}`}
                        title="Edit Project"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this project?")) {
                            deleteMutation.mutate(project.id);
                          }
                        }}
                        className="border-red-600 text-red-400 hover:bg-red-600/10"
                        disabled={deleteMutation.isPending}
                        data-testid={`button-delete-${project.id}`}
                        title="Delete Project"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}