import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Project, InsertProject } from "@shared/schema";
import { Plus, Edit, Trash2, LogOut, Eye } from "lucide-react";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<InsertProject>>({
    title: "",
    software: "",
    image: "",
    description: "",
    category: "environment",
    size: "medium"
  });

  // Redirect if not logged in
  if (!user) {
    setLocation("/admin/login");
    return null;
  }

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const createMutation = useMutation({
    mutationFn: async (projectData: Omit<InsertProject, 'id'>) => {
      const res = await apiRequest("POST", "/api/projects", projectData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setIsCreateOpen(false);
      resetForm();
      toast({
        title: "Project created",
        description: "Your new project has been added to the portfolio.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create project",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<InsertProject>) => {
      const res = await apiRequest("PUT", `/api/projects/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setEditingProject(null);
      resetForm();
      toast({
        title: "Project updated",
        description: "Your changes have been saved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update project",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Project deleted",
        description: "The project has been removed from your portfolio.",
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

  const resetForm = () => {
    setProjectForm({
      title: "",
      software: "",
      image: "",
      description: "",
      category: "environment",
      size: "medium"
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectForm.title || !projectForm.software || !projectForm.image || !projectForm.description) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, ...projectForm });
    } else {
      createMutation.mutate(projectForm as Omit<InsertProject, 'id'>);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      software: project.software,
      image: project.image,
      description: project.description,
      category: project.category as "environment" | "technical",
      size: project.size as "medium" | "large" | "wide"
    });
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setLocation("/admin/login");
      }
    });
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-title font-bold text-slate-100">
            Portfolio Admin
          </h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setLocation("/")}
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
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Actions */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-title font-semibold text-slate-100">
            Projects ({projects.length})
          </h2>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  resetForm();
                  setEditingProject(null);
                }}
                data-testid="button-add-project"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-dark-800 border-dark-700">
              <DialogHeader>
                <DialogTitle className="text-slate-100 font-title">
                  {editingProject ? "Edit Project" : "Create New Project"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Title *</label>
                    <Input
                      value={projectForm.title}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-dark-700 border-dark-600 text-slate-100"
                      placeholder="Project title"
                      data-testid="input-title"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Software *</label>
                    <Input
                      value={projectForm.software}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, software: e.target.value }))}
                      className="bg-dark-700 border-dark-600 text-slate-100"
                      placeholder="e.g., UE5 • Houdini • Substance"
                      data-testid="input-software"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Image URL *</label>
                  <Input
                    value={projectForm.image}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, image: e.target.value }))}
                    className="bg-dark-700 border-dark-600 text-slate-100"
                    placeholder="https://example.com/image.jpg"
                    data-testid="input-image"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Category *</label>
                    <Select value={projectForm.category} onValueChange={(value) => setProjectForm(prev => ({ ...prev, category: value as "environment" | "technical" }))}>
                      <SelectTrigger className="bg-dark-700 border-dark-600 text-slate-100" data-testid="select-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="environment">Environment</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Size *</label>
                    <Select value={projectForm.size} onValueChange={(value) => setProjectForm(prev => ({ ...prev, size: value as "medium" | "large" | "wide" }))}>
                      <SelectTrigger className="bg-dark-700 border-dark-600 text-slate-100" data-testid="select-size">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        <SelectItem value="wide">Wide</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Description *</label>
                  <Textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-dark-700 border-dark-600 text-slate-100 min-h-[120px]"
                    placeholder="Detailed project description..."
                    data-testid="textarea-description"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateOpen(false);
                      setEditingProject(null);
                      resetForm();
                    }}
                    className="border-dark-600 text-slate-300 hover:bg-dark-700"
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save"
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? "Saving..."
                      : editingProject ? "Update Project" : "Create Project"
                    }
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="text-center text-slate-400 py-12">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center text-slate-400 py-12">
            No projects yet. Create your first one!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden"
                data-testid={`project-card-${project.id}`}
              >
                <Card className="bg-transparent border-none">
                  <div className="aspect-video">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      data-testid={`project-image-${project.id}`}
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-slate-100 font-title text-lg">
                      {project.title}
                    </CardTitle>
                    <p className="text-slate-400 text-sm">{project.software}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 text-sm line-clamp-3 mb-4">
                      {project.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-1">
                        <span className="px-2 py-1 bg-accent-500/20 text-accent-500 text-xs rounded">
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
                          onClick={() => {
                            handleEdit(project);
                            setIsCreateOpen(true);
                          }}
                          className="border-dark-600 text-slate-300 hover:bg-dark-700"
                          data-testid={`button-edit-${project.id}`}
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
                          data-testid={`button-delete-${project.id}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}