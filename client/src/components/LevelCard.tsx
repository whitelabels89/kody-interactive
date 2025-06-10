import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Star, CheckCircle, Clock } from "lucide-react";
import type { LevelData } from "@shared/schema";

interface LevelCardProps {
  level: LevelData;
  onClick: () => void;
}

const colorClasses = {
  blue: {
    bg: "bg-blue-500",
    border: "border-blue-500",
    text: "text-blue-500",
    gradient: "from-blue-500 to-blue-600"
  },
  green: {
    bg: "bg-green-500", 
    border: "border-green-500",
    text: "text-green-500",
    gradient: "from-green-500 to-green-600"
  },
  orange: {
    bg: "bg-orange-500",
    border: "border-orange-500", 
    text: "text-orange-500",
    gradient: "from-orange-500 to-orange-600"
  },
  purple: {
    bg: "bg-purple-500",
    border: "border-purple-500",
    text: "text-purple-500", 
    gradient: "from-purple-500 to-purple-600"
  },
  red: {
    bg: "bg-red-500",
    border: "border-red-500",
    text: "text-red-500",
    gradient: "from-red-500 to-red-600"
  }
};

const typeIcons = {
  puzzle: "🧩",
  code: "💻", 
  design: "🎨",
  ui: "📱",
  robot: "🤖"
};

export default function LevelCard({ level, onClick }: LevelCardProps) {
  const colors = colorClasses[level.color as keyof typeof colorClasses];
  const isClickable = !level.isLocked;

  return (
    <Card 
      className={`level-card transition-all duration-300 cursor-pointer border-4 ${colors.border} ${
        isClickable ? 'hover:shadow-xl hover:-translate-y-2' : 'opacity-60 cursor-not-allowed'
      }`}
      onClick={isClickable ? onClick : undefined}
    >
      <CardContent className="p-8">
        <div className="text-center">
          <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-r ${colors.gradient} rounded-2xl flex items-center justify-center text-white text-3xl transform transition-transform duration-200 ${
            isClickable ? 'hover:rotate-12' : ''
          }`}>
            <span>{level.icon}</span>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-3">{level.title}</h3>
          <h4 className={`text-lg font-semibold ${colors.text} mb-4`}>"{level.subtitle}"</h4>
          
          {/* Level Image */}
          <img 
            src={`https://images.unsplash.com/photo-${level.id === 1 ? '1581091226825' : level.id === 2 ? '1551650975' : level.id === 3 ? '1509062522246' : level.id === 4 ? '1551650975' : '1546776230'}-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200`}
            alt={`${level.title} educational content`}
            className="w-full h-32 object-cover rounded-xl mb-4 opacity-80"
          />
          
          <p className="text-gray-600 mb-4">{level.description}</p>
          
          <div className="flex justify-between items-center mb-4">
            <Badge variant={level.isCompleted ? "default" : level.isLocked ? "secondary" : "outline"} 
                   className={level.isCompleted ? "bg-green-100 text-green-600" : level.isLocked ? "bg-gray-100 text-gray-500" : "bg-blue-100 text-blue-600"}>
              {level.isCompleted ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Selesai
                </>
              ) : level.isLocked ? (
                <>
                  <Lock className="w-4 h-4 mr-1" />
                  Terkunci
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 mr-1" />
                  Sedang Aktif
                </>
              )}
            </Badge>
            
            <div className={`${colors.text} font-semibold flex items-center`}>
              <span className="mr-1">{typeIcons[level.type]}</span>
              {level.type === 'puzzle' ? 'Puzzle' : 
               level.type === 'code' ? 'Coding' :
               level.type === 'design' ? 'Desain' :
               level.type === 'ui' ? 'UI/UX' : 'Kontrol'}
            </div>
          </div>

          {/* Stars */}
          {level.isCompleted && (
            <div className="flex justify-center mb-4">
              {[1, 2, 3].map((star) => (
                <Star 
                  key={star}
                  className={`w-5 h-5 ${star <= level.stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
          )}
          
          <div className="text-sm text-gray-500">
            💡 <strong>Yang Dipelajari:</strong> {level.skills.join(', ')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
