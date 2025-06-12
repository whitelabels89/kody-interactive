import type { Achievement } from "@shared/schema";

export const achievementTemplates = {
  level1: {
    id: "power-on-engineer",
    title: "Power On Engineer",
    description: "Berhasil memperbaiki sistem power Kody!",
    icon: "🔧",
    level: 1,
  },
  level2: {
    id: "coding-master-mini",
    title: "Koding Master Mini", 
    description: "Berhasil menulis kode Python pertama!",
    icon: "🐍",
    level: 2,
  },
  level3: {
    id: "robot-face-designer",
    title: "Desainer Wajah Robot",
    description: "Berhasil mendesain wajah untuk Kody!",
    icon: "🎨",
    level: 3,
  },  
  level4: {
    id: "button-builder",
    title: "Tukang Rakit Tombol",
    description: "Berhasil membuat tombol kontrol!",
    icon: "📱",
    level: 4,
  },
  level5: {
    id: "robot-master-control",
    title: "Master Kontrol Robot", 
    description: "Berhasil mengontrol pergerakan Kody!",
    icon: "🤖",
    level: 5, 
  },
};

export function createAchievement(templateKey: keyof typeof achievementTemplates): Achievement {
  const template = achievementTemplates[templateKey];
  return {
    ...template,
    earnedAt: new Date().toISOString(),
  };
}

export const allAchievements = Object.values(achievementTemplates);
