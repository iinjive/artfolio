import { motion } from "framer-motion";
import UnrealIcon from "../../../Unreal_icon.svg";
import HoudiniIcon from "../../../Houdini_icon.svg";
import BlenderIcon from "../../../Blender_icon.svg";
import SubstanceIcon from "../../../Substance_icon.svg";
import MayaIcon from "../../../3ds_icon.svg";
import ZBrushIcon from "../../../Zbrush_icon.svg";

export default function AboutSection() {
  const skills = [
    { name: "Unreal Engine", icon: UnrealIcon, color: "text-accent-500" },
    { name: "Houdini", icon: HoudiniIcon, color: "text-blue-500" },
    { name: "Blender", icon: BlenderIcon, color: "text-orange-500" },
    { name: "Substance", icon: SubstanceIcon, color: "text-green-500" },
    { name: "Maya", icon: MayaIcon, color: "text-purple-500" },
    { name: "ZBrush", icon: ZBrushIcon, color: "text-red-500" }
  ];

  return (
    <section id="about" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Text Content - Asymmetrical Layout */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 lg:col-start-1"
          >
            <h2 className="text-4xl md:text-5xl font-title font-bold mb-8 text-slate-100" data-testid="text-about-title">
              About
            </h2>
            <div className="space-y-6 text-slate-300 text-lg leading-relaxed">
              <p data-testid="text-about-description-1">
                Mark Raevski is a seasoned technical and environment artist with over 8 years of experience crafting immersive digital worlds and optimizing complex visual systems. His expertise spans from procedural environment generation to advanced shader development.
              </p>
              <p data-testid="text-about-description-2">
                Specializing in real-time rendering pipelines, Mark has contributed to numerous AAA game productions and architectural visualizations, consistently pushing the boundaries of what's possible in interactive media.
              </p>
            </div>
            
            {/* Skills Grid - Icons Only */}
            <div className="flex justify-between gap-4 mt-12">
              {skills.map((skill, index) => (
                <motion.div 
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className="glass-effect rounded-xl p-4 flex items-center justify-center hover:bg-glass-border transition-all cursor-pointer w-16 h-16"
                  data-testid={`skill-${skill.name.toLowerCase().replace(' ', '-')}`}
                >
                  <img 
                    src={skill.icon} 
                    alt={skill.name}
                    className={`w-8 h-8 ${skill.color}`}
                    style={{ filter: 'brightness(0) saturate(100%) invert(1)' }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image - Offset positioning */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-4 lg:col-start-9"
          >
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1000" 
                alt="Mark Raevski - Professional Portrait" 
                className="rounded-2xl shadow-2xl w-full object-cover h-96 lg:h-[500px]"
                data-testid="img-professional-portrait"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/30 via-transparent to-transparent rounded-2xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
