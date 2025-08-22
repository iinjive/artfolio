import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Project, InsertProject } from "@shared/schema";
import { 
  Plus, Edit, Trash2, LogOut, Eye, GripVertical, X, Image, Video, Type, Heading,
  Save, ArrowLeft, Palette, Layout, Monitor, Smartphone, Tablet 
} from "lucide-react";

type ContentBlock = {
  type: "image" | "video" | "text" | "title";
  content: string;
  order: number;
};

interface RealTimeProjectEditorProps {
  projectId?: string;
}

export default function RealTimeProjectEditor({ projectId }: RealTimeProjectEditorProps) {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [projectForm, setProjectForm] = useState({
    title: "",
    software: "",
    thumbnail: "",
    category: "environment" as "environment" | "technical",
    size: "medium" as "medium" | "large" | "wide",
    content: [] as ContentBlock[]
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Redirect if not logged in
  if (!user) {
    setLocation("/admin/login");
    return null;
  }

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const currentProject = projectId ? projects.find(p => p.id === projectId) : null;

  useEffect(() => {
    if (currentProject) {
      let parsedContent: ContentBlock[] = [];
      try {
        parsedContent = JSON.parse(currentProject.content || "[]");
      } catch (e) {
        parsedContent = [];
      }
      
      setProjectForm({
        title: currentProject.title,
        software: currentProject.software,
        thumbnail: currentProject.thumbnail,
        category: currentProject.category as "environment" | "technical",
        size: currentProject.size as "medium" | "large" | "wide",
        content: Array.isArray(parsedContent) ? parsedContent : []
      });
    }
  }, [currentProject]);

  const updateMutation = useMutation({
    mutationFn: async (data: { id: string; content: ContentBlock[] } & Partial<InsertProject>) => {
      const { id, content, ...rest } = data;
      const dataToSend = {
        ...rest,
        content: JSON.stringify(content)
      };
      const res = await apiRequest("PUT", `/api/projects/${id}`, dataToSend);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      toast({
        title: "Project saved",
        description: "Your changes have been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Save failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (projectData: Omit<InsertProject, 'id'> & { content: ContentBlock[] }) => {
      const { content, ...rest } = projectData;
      const dataToSend = {
        ...rest,
        content: JSON.stringify(content)
      };
      const res = await apiRequest("POST", "/api/projects", dataToSend);
      return await res.json();
    },
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      setLocation(`/admin/editor/${newProject.id}`);
      toast({
        title: "Project created",
        description: "Your new project has been created and saved.",
      });
    },
  });

  // Auto-save functionality disabled - manual save only
  // const triggerAutoSave = () => {
  //   if (autoSaveTimeoutRef.current) {
  //     clearTimeout(autoSaveTimeoutRef.current);
  //   }

  //   autoSaveTimeoutRef.current = setTimeout(() => {
  //     if (hasUnsavedChanges && projectForm.title && currentProject) {
  //       updateMutation.mutate({
  //         id: currentProject.id,
  //         ...projectForm,
  //       description: "Project details and content are managed through dynamic content blocks.", // Hidden field for schema compatibility
  //       content: projectForm.content
  //       });
  //     }
  //   }, 1000); // Auto-save after 1 second of inactivity
  // };

  const updateForm = (updates: Partial<typeof projectForm>) => {
    setProjectForm(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
    // triggerAutoSave(); // Disabled - manual save only
  };

  const addContentBlock = (type: "image" | "video" | "text" | "title") => {
    const newBlock: ContentBlock = {
      type,
      content: "",
      order: projectForm.content.length
    };
    updateForm({
      content: [...projectForm.content, newBlock]
    });
  };

  const updateContentBlock = (index: number, content: string) => {
    const updatedContent = (projectForm.content || []).map((block, i) => 
      i === index ? { ...block, content } : block
    );
    updateForm({ content: updatedContent });
  };

  const removeContentBlock = (index: number) => {
    const updatedContent = projectForm.content
      .filter((_, i) => i !== index)
      .map((block, i) => ({ ...block, order: i }));
    updateForm({ content: updatedContent });
  };

  const moveContentBlock = (fromIndex: number, toIndex: number) => {
    const newContent = [...projectForm.content];
    const [movedItem] = newContent.splice(fromIndex, 1);
    newContent.splice(toIndex, 0, movedItem);
    const reorderedContent = newContent.map((block, i) => ({ ...block, order: i }));
    updateForm({ content: reorderedContent });
  };

  const handleManualSave = () => {
    if (!projectForm.title || !projectForm.software || !projectForm.thumbnail) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (currentProject) {
      updateMutation.mutate({
        id: currentProject.id,
        ...projectForm,
        description: "Project details and content are managed through dynamic content blocks.", // Hidden field for schema compatibility
      } as any);
    } else {
      createMutation.mutate({
        ...projectForm,
        description: "Project details and content are managed through dynamic content blocks.", // Hidden field for schema compatibility
      } as any);
    }
  };

  const getPreviewWidth = () => {
    switch (previewDevice) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      case 'desktop': return 'max-w-6xl';
    }
  };

  const renderPreview = () => {
    return (
      <div className={`mx-auto px-6 py-12 transition-all duration-300 ${getPreviewWidth()}`}>
        {/* Project Hero */}
        <div className="mb-12">
          <motion.h1 
            className="text-5xl md:text-7xl font-title font-bold mb-4 text-gradient"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {projectForm.title || "Untitled Project"}
          </motion.h1>
          <motion.p 
            className="text-xl font-title text-slate-400 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {projectForm.software || "Software not specified"}
          </motion.p>
        </div>

        {/* Project Image */}
        {projectForm.thumbnail && (
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <img 
              src={projectForm.thumbnail} 
              alt={projectForm.title} 
              className="w-full h-96 md:h-[600px] object-cover rounded-2xl shadow-2xl"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </motion.div>
        )}

        {/* Project Content */}
        <motion.div 
          className="grid md:grid-cols-3 gap-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="md:col-span-2">
            <h2 className="text-3xl font-title font-bold mb-6 text-slate-100">Project Overview</h2>
            
            {/* Dynamic Content Blocks */}
            {projectForm.content.length > 0 && (
              <div className="space-y-8">
                <AnimatePresence>
                  {(projectForm.content || []).map((block, index) => (
                    <motion.div 
                      key={`${block.type}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {block.type === 'title' && block.content && (
                        <div className="mb-6">
                          <h3 className="text-2xl font-title font-bold text-slate-100">{block.content}</h3>
                        </div>
                      )}
                      {block.type === 'text' && block.content && (
                        <div className="prose prose-invert max-w-none">
                          <p className="text-lg text-slate-300 leading-relaxed">{block.content}</p>
                        </div>
                      )}
                      {block.type === 'image' && block.content && (
                        <div className="mb-6">
                          <img 
                            src={block.content} 
                            alt={`Project content ${index + 1}`}
                            className="w-full rounded-lg shadow-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      {block.type === 'video' && block.content && (
                        <div className="mb-6">
                          <video 
                            src={block.content} 
                            controls 
                            className="w-full rounded-lg shadow-lg"
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-xl font-title font-bold mb-4 text-slate-100">Project Info</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-slate-400 block text-sm">Category</span>
                  <span className="text-slate-100 capitalize">{projectForm.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-sm">Software Used</span>
                  <span className="text-slate-100">{projectForm.software || "Not specified"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-sm">Size</span>
                  <span className="text-slate-100 capitalize">{projectForm.size}</span>
                </div>
              </div>
            </div>

            {/* Other Projects Section */}
            {projects.filter(p => p.id !== currentProject?.id).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-title font-bold text-slate-100">Other Projects</h3>
                <div className="grid grid-cols-2 gap-3">
                  {projects
                    .filter(p => p.id !== currentProject?.id)
                    .slice(0, Math.min(projects.filter(p => p.id !== currentProject?.id).length, 4))
                    .map((project) => (
                      <div key={project.id} className="group cursor-pointer">
                        <div className="aspect-square w-full overflow-hidden rounded-lg bg-dark-700">
                          <img
                            src={project.thumbnail}
                            alt={project.title}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                            }}
                          />
                          <div className="hidden h-full w-full items-center justify-center bg-dark-700 text-slate-400">
                            <span className="text-xs">No image</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <h4 className="text-sm font-medium text-slate-200 truncate">{project.title}</h4>
                          <p className="text-xs text-slate-400 truncate">{project.software}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setLocation("/admin")}
              className="border-dark-600 text-slate-300 hover:bg-dark-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
            <h1 className="text-xl font-title font-bold">
              {currentProject ? `Edit: ${currentProject.title}` : "Create New Project"}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Device Preview Toggle */}
            <div className="flex items-center bg-dark-700 rounded-lg p-1">
              <Button
                size="sm"
                variant={previewDevice === 'desktop' ? 'default' : 'ghost'}
                onClick={() => setPreviewDevice('desktop')}
                className="p-2"
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={previewDevice === 'tablet' ? 'default' : 'ghost'}
                onClick={() => setPreviewDevice('tablet')}
                className="p-2"
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={previewDevice === 'mobile' ? 'default' : 'ghost'}
                onClick={() => setPreviewDevice('mobile')}
                className="p-2"
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>

            {/* Save Status */}
            <div className="flex items-center text-sm text-slate-400">
              {hasUnsavedChanges ? (
                <span className="text-yellow-400">● Unsaved changes - click Save to save</span>
              ) : lastSaved ? (
                <span className="text-green-400">✓ Saved {lastSaved.toLocaleTimeString()}</span>
              ) : null}
            </div>

            {/* Manual Save */}
            <Button
              onClick={handleManualSave}
              disabled={updateMutation.isPending || createMutation.isPending}
              className="flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateMutation.isPending || createMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 h-[calc(100vh-80px)]">
        {/* Editor Panel */}
        <div className="border-r border-dark-700 overflow-y-auto p-6">
          <div className="space-y-6 max-w-2xl">
            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="text-lg font-title font-semibold mb-4">Basic Information</h2>
              
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Title *</label>
                <Input
                  value={projectForm.title}
                  onChange={(e) => updateForm({ title: e.target.value })}
                  className="bg-dark-700 border-dark-600 text-slate-100"
                  placeholder="Enter project title..."
                />
              </div>
              
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Software *</label>
                <Input
                  value={projectForm.software}
                  onChange={(e) => updateForm({ software: e.target.value })}
                  className="bg-dark-700 border-dark-600 text-slate-100"
                  placeholder="e.g., UE5 • Houdini • Substance"
                />
              </div>
              
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Thumbnail URL *</label>
                <Input
                  value={projectForm.thumbnail}
                  onChange={(e) => updateForm({ thumbnail: e.target.value })}
                  className="bg-dark-700 border-dark-600 text-slate-100"
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Category *</label>
                  <Select 
                    value={projectForm.category} 
                    onValueChange={(value) => updateForm({ category: value as "environment" | "technical" })}
                  >
                    <SelectTrigger className="bg-dark-700 border-dark-600 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="environment">Environment</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Size *</label>
                  <Select 
                    value={projectForm.size} 
                    onValueChange={(value) => updateForm({ size: value as "medium" | "large" | "wide" })}
                  >
                    <SelectTrigger className="bg-dark-700 border-dark-600 text-slate-100">
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
              
            </div>

            {/* Content Blocks */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-title font-semibold">Content Blocks</h2>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addContentBlock("title")}
                    className="border-dark-600 text-slate-300 hover:bg-dark-700"
                  >
                    <Heading className="w-3 h-3 mr-1" />
                    Title
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addContentBlock("text")}
                    className="border-dark-600 text-slate-300 hover:bg-dark-700"
                  >
                    <Type className="w-3 h-3 mr-1" />
                    Text
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addContentBlock("image")}
                    className="border-dark-600 text-slate-300 hover:bg-dark-700"
                  >
                    <Image className="w-3 h-3 mr-1" />
                    Image
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addContentBlock("video")}
                    className="border-dark-600 text-slate-300 hover:bg-dark-700"
                  >
                    <Video className="w-3 h-3 mr-1" />
                    Video
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {(projectForm.content || []).map((block, index) => (
                    <motion.div
                      key={`${block.type}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-start space-x-3 p-4 bg-dark-700 rounded-lg border border-dark-600"
                    >
                      <div className="flex items-center space-x-2 mt-1">
                        <GripVertical className="w-4 h-4 text-slate-500 cursor-move" />
                        {block.type === 'title' && <Heading className="w-4 h-4 text-purple-400" />}
                        {block.type === 'image' && <Image className="w-4 h-4 text-blue-400" />}
                        {block.type === 'video' && <Video className="w-4 h-4 text-red-400" />}
                        {block.type === 'text' && <Type className="w-4 h-4 text-green-400" />}
                        <span className="text-xs text-slate-400 capitalize">{block.type}</span>
                      </div>
                      
                      <div className="flex-1">
                        {block.type === "text" ? (
                          <Textarea
                            value={block.content}
                            onChange={(e) => updateContentBlock(index, e.target.value)}
                            className="bg-dark-600 border-dark-500 text-slate-100 min-h-[80px] resize-none"
                            placeholder="Enter text content..."
                          />
                        ) : block.type === "title" ? (
                          <Input
                            value={block.content}
                            onChange={(e) => updateContentBlock(index, e.target.value)}
                            className="bg-dark-600 border-dark-500 text-slate-100"
                            placeholder="Enter title text..."
                          />
                        ) : (
                          <Input
                            value={block.content}
                            onChange={(e) => updateContentBlock(index, e.target.value)}
                            className="bg-dark-600 border-dark-500 text-slate-100"
                            placeholder={`Enter ${block.type} URL...`}
                          />
                        )}
                      </div>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeContentBlock(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10 mt-1"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {projectForm.content.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <Layout className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No content blocks yet</p>
                    <p className="text-xs">Add text, images, or videos to build your project page</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-dark-900 overflow-y-auto">
          <div className="sticky top-0 bg-dark-800/95 backdrop-blur-sm border-b border-dark-700 px-6 py-3">
            <h2 className="text-sm font-medium text-slate-300">Live Preview</h2>
          </div>
          <div className="min-h-screen bg-dark-900">
            {renderPreview()}
          </div>
        </div>
      </div>
    </div>
  );
}