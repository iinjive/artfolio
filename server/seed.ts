import { db } from "./db";
import { users, projects } from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

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
    id: "neon-district",
    title: "Neon District",
    software: "UE5 • Substance • Photoshop",
    thumbnail: abstractPattern,
    description: "A futuristic street scene with dynamic neon lighting, volumetric fog, and detailed urban architecture.",
    category: "environment",
    size: "wide",
    content: JSON.stringify([
      { type: "text", content: "A futuristic street scene with dynamic neon lighting and volumetric fog.", order: 0 },
      { type: "image", content: abstractPattern, order: 1 }
    ])
  }
];

async function seedAdmin() {
  try {
    // Check if admin user already exists
    const [existingAdmin] = await db.select().from(users).where(eq(users.username, "admin"));
    
    if (!existingAdmin) {
      // Create admin user with credentials: admin / admin
      const hashedPassword = await hashPassword("admin");
      
      await db.insert(users).values({
        username: "admin",
        password: hashedPassword
      });
      
      console.log("Admin user created successfully with username: admin, password: admin");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Failed to seed admin user:", error);
    throw error;
  }
}

async function seedProjects() {
  try {
    // Check if projects already exist
    const existingProjects = await db.select().from(projects);
    
    if (existingProjects.length === 0) {
      await db.insert(projects).values(sampleProjects);
      console.log(`${sampleProjects.length} sample projects created successfully`);
    } else {
      console.log("Projects already exist");
    }
  } catch (error) {
    console.error("Failed to seed projects:", error);
    throw error;
  }
}

// Run the seed functions
async function seed() {
  try {
    await seedAdmin();
    await seedProjects();
    console.log("Seeding complete");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();