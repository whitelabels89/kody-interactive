import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import type { Achievement } from "@shared/schema";

interface AchievementModalProps {
  achievement: Achievement;
  onClose: () => void;
}

export default function AchievementModal({ achievement, onClose }: AchievementModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="text-center p-4">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Selamat!</h2>
            <p className="text-lg text-gray-600">Kamu berhasil mendapatkan lencana baru!</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-6 mb-6">
            <div className="text-white">
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <div className="font-bold text-xl mb-2">{achievement.title}</div>
              <div className="text-sm opacity-90">{achievement.description}</div>
            </div>
          </div>
          
          <Button 
            onClick={onClose}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold"
          >
            Lanjutkan Petualangan!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
