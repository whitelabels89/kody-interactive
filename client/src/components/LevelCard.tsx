import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Star, CheckCircle, Clock } from "lucide-react";
import type { LevelData } from "@shared/schema";

const getWorldGradient = (levelId: number): string => {
  const gradients = {
    1: "from-blue-600 via-indigo-600 to-purple-600", // Digital World - Tech colors
    2: "from-green-600 via-emerald-600 to-teal-600", // Pythonia - Nature/Snake colors
    3: "from-orange-500 via-red-500 to-pink-500",    // Webtopia - Creative colors
    4: "from-purple-600 via-violet-600 to-indigo-600", // Applandia - UI colors
    5: "from-red-600 via-orange-600 to-yellow-500",   // Robotron - Robot/Fire colors
    6: "from-cyan-500 via-blue-500 to-indigo-600"    // 3D Robotron - Futuristic colors
  };
  return gradients[levelId as keyof typeof gradients] || "from-gray-400 to-gray-600";
};

const getWorldMainIcon = (levelId: number): string => {
  const icons = {
    1: "🌐", // Digital World
    2: "🐍", // Pythonia (Snake)
    3: "🏰", // Webtopia (Castle/Web)
    4: "📱", // Applandia (Apps)
    5: "🤖", // Robotron (Robot)
    6: "🎮"  // 3D Robotron (Game)
  };
  return icons[levelId as keyof typeof icons] || "⭐";
};

const getWorldTagline = (levelId: number): string => {
  const taglines = {
    1: "Dunia Digital Menanti",
    2: "Negeri Bahasa Pemrograman",
    3: "Kerajaan Desain Web",
    4: "Kota Aplikasi",
    5: "Planet Robot",
    6: "Dimensi 3D Futuristik"
  };
  return taglines[levelId as keyof typeof taglines] || "Dunia Misterius";
};

const getWorldPattern = (levelId: number): React.ReactNode => {
  const patterns = {
    1: ( // Digital circuits pattern
      <div className="grid grid-cols-8 gap-1 w-full h-full">
        {Array.from({length: 64}, (_, i) => (
          <div key={i} className={`w-1 h-1 ${i % 3 === 0 ? 'bg-white' : 'bg-transparent'} rounded-full`} />
        ))}
      </div>
    ),
    2: ( // Python/code pattern with floating keywords
      <div className="relative w-full h-full overflow-hidden">
        <div className="absolute top-2 left-2 text-white text-xs opacity-40 animate-pulse">def</div>
        <div className="absolute top-6 right-4 text-white text-xs opacity-30 animate-pulse" style={{animationDelay: '0.5s'}}>if</div>
        <div className="absolute bottom-8 left-6 text-white text-xs opacity-40 animate-pulse" style={{animationDelay: '1s'}}>for</div>
        <div className="absolute bottom-4 right-2 text-white text-xs opacity-30 animate-pulse" style={{animationDelay: '1.5s'}}>print</div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs opacity-50 animate-pulse" style={{animationDelay: '2s'}}>python</div>
        <div className="absolute top-4 left-1/2 text-white text-xs opacity-30 animate-pulse" style={{animationDelay: '2.5s'}}>class</div>
      </div>
    ),
    3: ( // Web design wireframe pattern
      <div className="grid grid-cols-6 gap-1 w-full h-full p-2">
        {Array.from({length: 18}, (_, i) => (
          <div key={i} className={`bg-white rounded opacity-30 ${i % 4 === 0 ? 'col-span-2' : ''}`} 
               style={{height: `${i % 3 === 0 ? '8px' : i % 5 === 0 ? '12px' : '4px'}`}} />
        ))}
      </div>
    ),
    4: ( // UI elements pattern with app icons
      <div className="flex flex-wrap gap-1 w-full h-full items-center justify-center p-2">
        <div className="w-4 h-4 bg-white rounded opacity-40"></div>
        <div className="w-3 h-3 bg-white rounded-full opacity-30"></div>
        <div className="w-6 h-2 bg-white rounded opacity-40"></div>
        <div className="w-2 h-5 bg-white rounded opacity-30"></div>
        <div className="w-5 h-3 bg-white rounded opacity-40"></div>
        <div className="w-3 h-4 bg-white rounded opacity-30"></div>
        <div className="w-4 h-2 bg-white rounded opacity-40"></div>
      </div>
    ),
    5: ( // Robot/mechanical gear pattern
      <div className="relative w-full h-full overflow-hidden">
        <div className="absolute top-2 left-2 w-6 h-6 border-2 border-white rounded-full opacity-20 animate-spin" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-2 border-white rounded-full opacity-30 animate-spin" style={{animationDuration: '2s', animationDirection: 'reverse'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 border-2 border-white rounded-full opacity-25 animate-spin" style={{animationDuration: '4s'}}></div>
        <div className="grid grid-cols-4 gap-1 w-full h-full p-2 opacity-20">
          {Array.from({length: 8}, (_, i) => (
            <div key={i} className="bg-white rounded" style={{height: '6px'}} />
          ))}
        </div>
      </div>
    ),
    6: ( // 3D futuristic grid pattern
      <div className="relative w-full h-full overflow-hidden">
        <div className="grid grid-cols-6 gap-px w-full h-full opacity-30">
          {Array.from({length: 36}, (_, i) => (
            <div key={i} className={`bg-white ${i % 7 === 0 ? 'animate-pulse' : ''}`} style={{height: '2px'}} />
          ))}
        </div>
        <div className="absolute top-2 right-2 text-white text-xs opacity-60 animate-bounce">3D</div>
        <div className="absolute bottom-2 left-2 text-white text-xs opacity-60 animate-pulse">VR</div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white rounded-lg opacity-30 animate-spin" style={{animationDuration: '5s'}}></div>
      </div>
    )
  };
  return patterns[levelId as keyof typeof patterns] || null;
};

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
  },
  cyan: {
    bg: "bg-cyan-500",
    border: "border-cyan-500",
    text: "text-cyan-500",
    gradient: "from-cyan-500 to-cyan-600"
  }
};

const typeIcons = {
  puzzle: "🧩",
  code: "💻", 
  design: "🎨",
  ui: "📱",
  robot: "🤖",
  "3dgame": "🎮"
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
          
          {/* World Illustration */}
          <div className={`w-full h-32 rounded-xl mb-4 bg-gradient-to-br ${getWorldGradient(level.id)} flex items-center justify-center relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-20">
              {getWorldPattern(level.id)}
            </div>
            <div className="relative z-10 text-center text-white">
              <div className="text-4xl mb-2">{getWorldMainIcon(level.id)}</div>
              <div className="text-xs font-semibold opacity-90">{getWorldTagline(level.id)}</div>
            </div>
          </div>
          
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
               level.type === 'ui' ? 'UI/UX' : 
               level.type === '3dgame' ? '3D Game' : 'Kontrol'}
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