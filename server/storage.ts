import { 
  users, 
  progress, 
  levelProgress, 
  certificates,
  type User, 
  type InsertUser,
  type Progress,
  type InsertProgress,
  type LevelProgress,
  type InsertLevelProgress,
  type Certificate,
  type InsertCertificate,
  type Achievement,
  type GameState
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Progress methods
  getProgress(userId: number): Promise<Progress | undefined>;
  createProgress(progress: InsertProgress): Promise<Progress>;
  updateProgress(userId: number, updates: Partial<Progress>): Promise<Progress>;
  
  // Level progress methods
  getLevelProgress(userId: number): Promise<LevelProgress[]>;
  updateLevelProgress(userId: number, level: number, data: Partial<LevelProgress>): Promise<LevelProgress>;
  
  // Certificate methods
  getCertificate(userId: number): Promise<Certificate | undefined>;
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
  
  // Game state methods
  getGameState(userId: number): Promise<GameState>;
  saveGameState(userId: number, gameState: Partial<GameState>): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private progress: Map<number, Progress>;
  private levelProgress: Map<string, LevelProgress>;
  private certificates: Map<number, Certificate>;
  private currentUserId: number;
  private currentProgressId: number;
  private currentLevelProgressId: number;
  private currentCertificateId: number;

  constructor() {
    this.users = new Map();
    this.progress = new Map();
    this.levelProgress = new Map();
    this.certificates = new Map();
    this.currentUserId = 1;
    this.currentProgressId = 1;
    this.currentLevelProgressId = 1;
    this.currentCertificateId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProgress(userId: number): Promise<Progress | undefined> {
    return Array.from(this.progress.values()).find(p => p.userId === userId);
  }

  async createProgress(insertProgress: InsertProgress): Promise<Progress> {
    const id = this.currentProgressId++;
    const progressData: Progress = {
      ...insertProgress,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.progress.set(id, progressData);
    return progressData;
  }

  async updateProgress(userId: number, updates: Partial<Progress>): Promise<Progress> {
    const existing = await this.getProgress(userId);
    if (!existing) {
      throw new Error('Progress not found');
    }
    
    const updated: Progress = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.progress.set(existing.id, updated);
    return updated;
  }

  async getLevelProgress(userId: number): Promise<LevelProgress[]> {
    return Array.from(this.levelProgress.values()).filter(lp => lp.userId === userId);
  }

  async updateLevelProgress(userId: number, level: number, data: Partial<LevelProgress>): Promise<LevelProgress> {
    const key = `${userId}-${level}`;
    const existing = this.levelProgress.get(key);
    
    if (existing) {
      const updated: LevelProgress = {
        ...existing,
        ...data,
        completedAt: data.completed ? new Date() : existing.completedAt,
      };
      this.levelProgress.set(key, updated);
      return updated;
    } else {
      const id = this.currentLevelProgressId++;
      const newLevelProgress: LevelProgress = {
        id,
        userId,
        level,
        completed: false,
        stars: 0,
        completedAt: null,
        ...data,
      };
      this.levelProgress.set(key, newLevelProgress);
      return newLevelProgress;
    }
  }

  async getCertificate(userId: number): Promise<Certificate | undefined> {
    return Array.from(this.certificates.values()).find(c => c.userId === userId);
  }

  async createCertificate(insertCertificate: InsertCertificate): Promise<Certificate> {
    const id = this.currentCertificateId++;
    const certificate: Certificate = {
      ...insertCertificate,
      id,
      issuedAt: new Date(),
    };
    this.certificates.set(id, certificate);
    return certificate;
  }

  async getGameState(userId: number): Promise<GameState> {
    const progressData = await this.getProgress(userId);
    const levelProgressData = await this.getLevelProgress(userId);
    
    if (!progressData) {
      // Return default game state for new users
      return {
        currentLevel: 1,
        completedLevels: [],
        totalStars: 0,
        badges: [],
        achievements: [],
        audioEnabled: true,
      };
    }

    return {
      currentLevel: progressData.currentLevel,
      completedLevels: progressData.completedLevels,
      totalStars: progressData.totalStars,
      badges: progressData.badges,
      achievements: progressData.achievements,
      audioEnabled: true,
    };
  }

  async saveGameState(userId: number, gameState: Partial<GameState>): Promise<void> {
    const existing = await this.getProgress(userId);
    
    if (existing) {
      await this.updateProgress(userId, {
        currentLevel: gameState.currentLevel ?? existing.currentLevel,
        completedLevels: gameState.completedLevels ?? existing.completedLevels,
        totalStars: gameState.totalStars ?? existing.totalStars,
        badges: gameState.badges ?? existing.badges,
        achievements: gameState.achievements ?? existing.achievements,
      });
    } else {
      await this.createProgress({
        userId,
        currentLevel: gameState.currentLevel ?? 1,
        completedLevels: gameState.completedLevels ?? [],
        totalStars: gameState.totalStars ?? 0,
        badges: gameState.badges ?? [],
        achievements: gameState.achievements ?? [],
      });
    }
  }
}

export const storage = new MemStorage();
