import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import PuzzleActivity from "./PuzzleActivity";
import CodeEditor from "./CodeEditor";
import WebDesignActivity from "./WebDesignActivity";
import UIDesignActivity from "./UIDesignActivity";
import RobotControlActivity from "./RobotControlActivity";
import type { LevelData, Achievement } from "@shared/schema";

interface ActivityModalProps {
  level: LevelData;
  onClose: () => void;
  onComplete: (levelId: number, stars: number, achievement?: Achievement) => void;
}

export default function ActivityModal({ level, onClose, onComplete }: ActivityModalProps) {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleActivityComplete = async (stars: number) => {
    setIsCompleting(true);
    
    // Create achievement based on level
    const achievement: Achievement = {
      id: `level-${level.id}-complete`,
      title: getAchievementTitle(level.id),
      description: getAchievementDescription(level.id),
      icon: getAchievementIcon(level.id),
      earnedAt: new Date().toISOString(),
      level: level.id,
    };

    await onComplete(level.id, stars, achievement);
    setIsCompleting(false);
  };

  const getAchievementTitle = (levelId: number): string => {
    const titles = {
      1: "Power On Engineer",
      2: "Koding Master Mini", 
      3: "Desainer Wajah Robot",
      4: "Ahli Tombol",
      5: "Master Kontrol Robot"
    };
    return titles[levelId as keyof typeof titles] || "Pahlawan Digital";
  };

  const getAchievementDescription = (levelId: number): string => {
    const descriptions = {
      1: "Berhasil memperbaiki sistem power Kody!",
      2: "Berhasil menulis kode Python pertama!",
      3: "Berhasil mendesain wajah untuk Kody!",
      4: "Berhasil membuat tombol kontrol!",
      5: "Berhasil mengontrol pergerakan Kody!"
    };
    return descriptions[levelId as keyof typeof descriptions] || "Menyelesaikan tantangan!";
  };

  const getAchievementIcon = (levelId: number): string => {
    const icons = {
      1: "🔧",
      2: "🐍",
      3: "🎨", 
      4: "📱",
      5: "🤖"
    };
    return icons[levelId as keyof typeof icons] || "🏆";
  };

  const renderActivity = () => {
    switch (level.type) {
      case 'puzzle':
        return <PuzzleActivity level={level} onComplete={handleActivityComplete} />;
      case 'code':
        return <CodeEditor level={level} onComplete={handleActivityComplete} />;
      case 'design':
        return <WebDesignActivity level={level} onComplete={handleActivityComplete} />;
      case 'ui':
        return <UIDesignActivity level={level} onComplete={handleActivityComplete} />;
      case 'robot':
        return <RobotControlActivity level={level} onComplete={handleActivityComplete} />;
      default:
        return <div>Aktivitas tidak ditemukan</div>;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-gray-800 flex items-center justify-between">
            {level.title}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8">
          {renderActivity()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
