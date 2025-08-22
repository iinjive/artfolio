import { db } from "./db";
import { projects } from "@shared/schema";

// Abstract pattern for consistent thumbnails with Mark's color scheme
const abstractPattern = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnMSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iaHNsKDM2LCA0MiUsIDY1JSkiIHN0b3Atb3BhY2l0eT0iMC44Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSJoc2woMzYsIDQyJSwgNzUlKSIgc3RvcC1vcGFjaXR5PSIwLjQiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iaHNsKDI0MCwgMyUsIDglKSIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEwMCIgcj0iODAiIGZpbGw9InVybCgjZzEpIiBvcGFjaXR5PSIwLjMiLz48Y2lyY2xlIGN4PSI0NTAiIGN5PSIzMDAiIHI9IjYwIiBmaWxsPSJ1cmwoI2cxKSIgb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSIzMDAsMjAgNDAwLDEwMCAzMDAsMTgwIDIwMCwxMDAiIGZpbGw9InVybCgjZzEpIiBvcGFjaXR5PSIwLjI1Ii8+PC9zdmc+";

const sampleProjects = [
  {
    id: "cyberpunk-metropolis",
    title: "Cyberpunk Metropolis",
    software: "UE5 • Houdini • Substance",
    thumbnail: abstractPattern,
    description: "A sprawling cyberpunk cityscape featuring advanced lighting systems, procedural building generation, and atmospheric effects. This project showcases complex shader work and real-time rendering optimization for large-scale environments.",
    category: "environment",
    size: "large",
    content: JSON.stringify([
      { type: "text", content: "A sprawling cyberpunk cityscape featuring advanced lighting systems and procedural building generation.", order: 0 },
      { type: "image", content: abstractPattern, order: 1 },
      { type: "text", content: "This project showcases complex shader work and real-time rendering optimization for large-scale environments.", order: 2 }
    ])
  },
  {
    id: "mystical-woods",
    title: "Mystical Woods",
    software: "Blender • UE5",
    thumbnail: abstractPattern,
    description: "An enchanted forest environment with dynamic weather systems, procedural vegetation, and advanced lighting techniques creating an immersive magical atmosphere.",
    category: "environment",
    size: "medium",
    content: JSON.stringify([
      { type: "text", content: "An enchanted forest environment with dynamic weather systems and procedural vegetation.", order: 0 },
      { type: "image", content: abstractPattern, order: 1 }
    ])
  },
  {
    id: "station-alpha",
    title: "Station Alpha",
    software: "UE5 • Substance",
    thumbnail: abstractPattern,
    description: "A detailed sci-fi interior focusing on modular design principles, PBR materials, and optimized geometry for real-time applications.",
    category: "technical",
    size: "medium",
    content: JSON.stringify([
      { type: "image", content: abstractPattern, order: 0 },
      { type: "text", content: "A detailed sci-fi interior focusing on modular design principles and PBR materials.", order: 1 }
    ])
  },
  {
    id: "ancient-sands",
    title: "Ancient Sands",
    software: "Houdini • UE5 • World Machine",
    thumbnail: abstractPattern,
    description: "A vast desert landscape featuring procedural terrain generation, advanced erosion simulation, and dynamic sand systems.",
    category: "environment",
    size: "wide",
    content: JSON.stringify([
      { type: "text", content: "A vast desert landscape featuring procedural terrain generation and advanced erosion simulation.", order: 0 },
      { type: "image", content: abstractPattern, order: 1 },
      { type: "image", content: abstractPattern, order: 2 }
    ])
  },
  {
    id: "coral-gardens",
    title: "Coral Gardens",
    software: "Blender • UE5",
    thumbnail: abstractPattern,
    description: "An underwater scene showcasing complex shader work for subsurface scattering, caustics, and procedural coral generation.",
    category: "technical",
    size: "medium",
    content: JSON.stringify([
      { type: "image", content: abstractPattern, order: 0 },
      { type: "text", content: "An underwater scene showcasing complex shader work for subsurface scattering and caustics.", order: 1 },
      { type: "image", content: abstractPattern, order: 2 }
    ])
  },
  {
    id: "peak-serenity",
    title: "Peak Serenity",
    software: "World Machine • UE5",
    thumbnail: abstractPattern,
    description: "A mountainous landscape utilizing advanced terrain generation techniques and atmospheric rendering systems.",
    category: "environment",
    size: "medium",
    content: JSON.stringify([
      { type: "text", content: "A mountainous landscape utilizing advanced terrain generation techniques.", order: 0 },
      { type: "image", content: abstractPattern, order: 1 }
    ])
  }
];

async function seedProjects() {
  try {
    // Check if projects already exist
    const existingProjects = await db.select().from(projects);
    
    if (existingProjects.length === 0) {
      // Insert sample projects
      await db.insert(projects).values(sampleProjects);
      console.log("Sample projects created successfully");
    } else {
      console.log("Projects already exist");
    }
  } catch (error) {
    console.error("Failed to seed projects:", error);
    process.exit(1);
  }
}

// Run the seed function
seedProjects().then(() => {
  console.log("Project seeding complete");
  process.exit(0);
});