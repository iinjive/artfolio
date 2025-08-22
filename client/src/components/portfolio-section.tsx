import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";

export default function PortfolioSection() {
  const [, setLocation] = useLocation();
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  if (isLoading) {
    return (
      <section className="py-20 px-6" id="portfolio">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-title font-bold mb-16 text-slate-100 text-center">
            Featured Work
          </h2>
          <div className="text-center text-slate-400">Loading projects...</div>
        </div>
      </section>
    );
  }

  const getGridClasses = (size: string) => {
    switch (size) {
      case "large":
        return "lg:col-span-2 lg:row-span-2";
      case "wide":
        return "md:col-span-2";
      default:
        return "";
    }
  };

  const getHeightClass = (size: string) => {
    switch (size) {
      case "large":
        return "h-80 lg:h-full";
      case "wide":
        return "h-64";
      default:
        return "h-64";
    }
  };

  return (
    <section id="portfolio" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-title font-bold mb-16 text-slate-100 text-center"
          data-testid="text-portfolio-title"
        >
          Featured Work
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className={`portfolio-card ${getGridClasses(project.size)} relative group cursor-pointer overflow-hidden rounded-2xl`}
              onClick={() => setLocation(`/project/${project.id}`)}
              data-testid={`card-project-${project.id}`}
            >
              <img 
                src={project.thumbnail} 
                alt={project.title} 
                className={`w-full ${getHeightClass(project.size)} object-cover transition-all duration-500 group-hover:blur-md group-hover:brightness-50 group-hover:contrast-75`}
                data-testid={`img-project-${project.id}`}
              />
              <motion.div 
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-dark-800/60 backdrop-blur-sm transition-all duration-300 flex items-center justify-center"
              >
                <div className="text-center text-white">
                  <h3 className="text-xl md:text-2xl font-bold mb-2" data-testid={`text-title-${project.id}`}>
                    {project.title}
                  </h3>
                  <p className="text-sm opacity-90" data-testid={`text-software-${project.id}`}>
                    {project.software}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
