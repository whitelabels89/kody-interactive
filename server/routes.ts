import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertCertificateSchema, type GameState, type Achievement } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get game state for a user (default user ID 1 for demo)
  app.get("/api/game-state", async (req, res) => {
    try {
      const userId = 1; // Default user for demo
      const gameState = await storage.getGameState(userId);
      res.json(gameState);
    } catch (error) {
      console.error("Error fetching game state:", error);
      res.status(500).json({ message: "Failed to fetch game state" });
    }
  });

  // Update game state
  app.post("/api/game-state", async (req, res) => {
    try {
      const userId = 1; // Default user for demo
      const gameStateSchema = z.object({
        currentLevel: z.number().optional(),
        completedLevels: z.array(z.number()).optional(),
        totalStars: z.number().optional(),
        badges: z.array(z.string()).optional(),
        achievements: z.array(z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          icon: z.string(),
          earnedAt: z.string(),
          level: z.number(),
        })).optional(),
      });

      const gameState = gameStateSchema.parse(req.body);
      await storage.saveGameState(userId, gameState);
      
      const updatedState = await storage.getGameState(userId);
      res.json(updatedState);
    } catch (error) {
      console.error("Error updating game state:", error);
      res.status(500).json({ message: "Failed to update game state" });
    }
  });

  // Complete a level
  app.post("/api/complete-level", async (req, res) => {
    try {
      const userId = 1; // Default user for demo
      const schema = z.object({
        level: z.number(),
        stars: z.number().min(1).max(3),
        achievement: z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          icon: z.string(),
          earnedAt: z.string(),
          level: z.number(),
        }).optional(),
      });

      const { level, stars, achievement } = schema.parse(req.body);

      // Update level progress
      await storage.updateLevelProgress(userId, level, {
        completed: true,
        stars: stars,
      });

      // Get current game state
      const currentState = await storage.getGameState(userId);
      
      // Update game state
      const newCompletedLevels = [...currentState.completedLevels];
      if (!newCompletedLevels.includes(level)) {
        newCompletedLevels.push(level);
      }

      const newAchievements = [...currentState.achievements];
      if (achievement && !newAchievements.find(a => a.id === achievement.id)) {
        newAchievements.push(achievement);
      }

      const updatedGameState = {
        currentLevel: Math.max(currentState.currentLevel, level + 1),
        completedLevels: newCompletedLevels,
        totalStars: currentState.totalStars + stars,
        badges: achievement ? [...currentState.badges, achievement.title] : currentState.badges,
        achievements: newAchievements,
      };

      await storage.saveGameState(userId, updatedGameState);
      
      const finalState = await storage.getGameState(userId);
      res.json(finalState);
    } catch (error) {
      console.error("Error completing level:", error);
      res.status(500).json({ message: "Failed to complete level" });
    }
  });

  // Generate certificate
  app.post("/api/generate-certificate", async (req, res) => {
    try {
      const userId = 1; // Default user for demo
      const schema = z.object({
        studentName: z.string().min(1),
      });

      const { studentName } = schema.parse(req.body);

      // Get user progress
      const gameState = await storage.getGameState(userId);
      const levelProgress = await storage.getLevelProgress(userId);

      // Check if all levels are completed
      if (gameState.completedLevels.length < 5) {
        return res.status(400).json({ message: "All levels must be completed to generate certificate" });
      }

      // Create certificate data
      const certificateData = {
        studentName,
        completionDate: new Date().toISOString(),
        levels: [
          { level: 1, title: "Dunia Digital", completed: true, stars: levelProgress.find(lp => lp.level === 1)?.stars || 0 },
          { level: 2, title: "Negeri Pythonia", completed: true, stars: levelProgress.find(lp => lp.level === 2)?.stars || 0 },
          { level: 3, title: "Webtopia", completed: true, stars: levelProgress.find(lp => lp.level === 3)?.stars || 0 },
          { level: 4, title: "Applandia", completed: true, stars: levelProgress.find(lp => lp.level === 4)?.stars || 0 },
          { level: 5, title: "Robotron", completed: true, stars: levelProgress.find(lp => lp.level === 5)?.stars || 0 },
        ],
        totalStars: gameState.totalStars,
        badges: gameState.badges,
      };

      const certificate = await storage.createCertificate({
        userId,
        studentName,
        certificateData,
      });

      res.json(certificate);
    } catch (error) {
      console.error("Error generating certificate:", error);
      res.status(500).json({ message: "Failed to generate certificate" });
    }
  });

  // Execute Python code (simulation)
  app.post("/api/execute-python", async (req, res) => {
    try {
      const schema = z.object({
        code: z.string(),
      });

      const { code } = schema.parse(req.body);

      // Simple Python code simulation
      let output = "";
      let kodyResponse = "";
      let success = false;

      if (code.includes("power = 'on'") || code.includes('power = "on"')) {
        if (code.includes("if power == 'on'") || code.includes('if power == "on"')) {
          if (code.includes("print('Kody aktif!')") || code.includes('print("Kody aktif!")')) {
            output = "Kody aktif!";
            kodyResponse = "🤖 Beep beep! Sistem power aktif! Terima kasih sudah menghidupkan saya!";
            success = true;
          }
        }
      } else if (code.includes("move = 'maju'") || code.includes('move = "maju"')) {
        if (code.includes("if move == 'maju'") || code.includes('if move == "maju"')) {
          output = "Kody jalan!";
          kodyResponse = "🤖 Wah! Aku bisa bergerak! Terima kasih sudah mengajariku bergerak!";
          success = true;
        }
      }

      if (!success) {
        output = "# Periksa kode Anda. Pastikan menggunakan sintaks yang benar.";
        kodyResponse = "🤖 Hmm... sepertinya ada yang salah dengan instruksinya. Coba lagi ya!";
      }

      res.json({
        output,
        kodyResponse,
        success,
      });
    } catch (error) {
      console.error("Error executing Python code:", error);
      res.status(500).json({ message: "Failed to execute code" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
