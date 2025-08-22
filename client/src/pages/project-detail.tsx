import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import type { Project } from "@shared/schema";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });
  
  const project = projects.find((p: Project) => p.id === id);
  
  // Parse content blocks from JSON string
  let contentBlocks: any[] = [];
  try {
    const parsed = project?.content ? JSON.parse(project.content) : [];
    contentBlocks = Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    contentBlocks = [];
  }
  const sortedBlocks = contentBlocks.sort((a: any, b: any) => a.order - b.order);

  // Calculate how many other projects to show based on overall page content length
  const calculateOtherProjectsCount = () => {
    const totalBlocks = sortedBlocks.length;
    
    // Calculate weighted content length including all block types
    const totalContentWeight = sortedBlocks.reduce((total, block) => {
      switch (block.type) {
        case 'text':
          return total + (block.content?.length || 0);
        case 'image':
          // Each image counts as equivalent to 200 characters of text
          return total + 200;
        case 'video':
          // Each video counts as equivalent to 300 characters of text  
          return total + 300;
        case 'title':
          // Each title counts as equivalent to 100 characters of text
          return total + 100;
        default:
          return total;
      }
    }, 0);
    
    // If no content or very minimal, show 0
    if (totalBlocks === 0 || totalContentWeight < 150) return 0;
    
    // If minimal content, show 1
    if (totalBlocks <= 2 || totalContentWeight < 400) return 1;
    
    // If moderate content, show 2
    if (totalBlocks <= 4 || totalContentWeight < 800) return 2;
    
    // If good content, show 3
    if (totalBlocks <= 6 || totalContentWeight < 1200) return 3;
    
    // If lots of content, show maximum 4
    return 4;
  };

  const otherProjectsCount = calculateOtherProjectsCount();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-title font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-dark-900 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-title font-bold mb-4">Project Not Found</h1>
          <button
            onClick={() => {
              setLocation('/');
              setTimeout(() => {
                const portfolioSection = document.getElementById('portfolio');
                if (portfolioSection) {
                  portfolioSection.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}
            className="text-accent-500 hover:text-accent-400 transition-colors cursor-pointer" 
            data-testid="button-back-to-portfolio"
          >
            ← Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100">
      <nav className="fixed top-0 left-0 right-0 z-40 glass-effect">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-end items-center">
          <button
            onClick={() => {
              // Navigate to home, then scroll to portfolio after navigation
              setLocation('/');
              setTimeout(() => {
                const portfolioSection = document.getElementById('portfolio');
                if (portfolioSection) {
                  portfolioSection.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}
            className="text-accent-500 hover:text-accent-400 transition-colors cursor-pointer" 
            data-testid="button-back-to-portfolio"
          >
            ← Back to Portfolio
          </button>
        </div>
      </nav>

      <main className="pt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto px-6 py-12"
        >
          {/* Project Hero */}
          <div className="mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-title font-bold mb-4 text-gradient"
              data-testid="text-project-title"
            >
              {project.title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl font-title text-slate-400 mb-8"
              data-testid="text-project-software"
            >
              {project.software}
            </motion.p>
          </div>

          {/* Project Image */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <img 
              src={project.thumbnail} 
              alt={project.title} 
              className="w-full h-96 md:h-[600px] object-cover rounded-2xl shadow-2xl"
              data-testid="img-project-hero"
            />
          </motion.div>

          {/* Project Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-3 gap-12"
          >
            <div className="md:col-span-2">
              <h2 className="text-3xl font-title font-bold mb-6 text-slate-100">Project Overview</h2>
              
              {/* Dynamic Content Blocks */}
              {sortedBlocks.length > 0 && (
                <div className="space-y-8">
                  {sortedBlocks.map((block: any, index: number) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    >
                      {block.type === 'title' && (
                        <div className="mb-6">
                          <h3 className="text-2xl font-title font-bold text-slate-100">{block.content}</h3>
                        </div>
                      )}
                      {block.type === 'text' && (
                        <div className="prose prose-invert max-w-none">
                          <p className="text-lg text-slate-300 leading-relaxed">{block.content}</p>
                        </div>
                      )}
                      {block.type === 'image' && (
                        <div className="mb-6">
                          <img 
                            src={block.content} 
                            alt={`Project content ${index + 1}`}
                            className="w-full rounded-lg shadow-lg"
                          />
                        </div>
                      )}
                      {block.type === 'video' && (
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
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="text-xl font-title font-bold mb-4 text-slate-100">Project Info</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-slate-400 block text-sm">Category</span>
                    <span className="text-slate-100 capitalize" data-testid="text-project-category">{project.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-sm">Software Used</span>
                    <span className="text-slate-100" data-testid="text-project-tools">{project.software}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-sm">Role</span>
                    <span className="text-slate-100">Lead Technical Artist</span>
                  </div>
                </div>
              </div>

              {/* Other Projects Section */}
              {otherProjectsCount > 0 && projects.filter(p => p.id !== project.id).length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-title font-bold text-slate-100 pl-6">Other Projects</h3>
                  <div className="space-y-4">
                    {projects
                      .filter(p => p.id !== project.id)
                      .slice(0, otherProjectsCount)
                      .map((otherProject, index) => (
                        <motion.div
                          key={otherProject.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setLocation(`/project/${otherProject.id}`)}
                          className="glass-effect rounded-2xl p-0 relative group cursor-pointer overflow-hidden aspect-square"
                        >
                          <img 
                            src={otherProject.thumbnail} 
                            alt={otherProject.title} 
                            className="w-full h-full object-cover transition-all duration-500 group-hover:blur-md group-hover:brightness-50 group-hover:contrast-75"
                          />
                          <motion.div 
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            className="absolute inset-0 bg-dark-800/60 backdrop-blur-sm transition-all duration-300 flex items-center justify-center p-6"
                          >
                            <div className="text-center text-white">
                              <h4 className="text-lg font-title font-bold mb-2">
                                {otherProject.title}
                              </h4>
                              <p className="text-sm opacity-90 mb-3">
                                {otherProject.software}
                              </p>
                              <div className="space-y-1 text-xs opacity-75">
                                <div className="capitalize">{otherProject.category}</div>
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
