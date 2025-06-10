import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Play, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, CheckCircle, Zap } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { LevelData } from "@shared/schema";

interface RobotControlActivityProps {
  level: LevelData;
  onComplete: (stars: number) => void;
}

interface RobotPosition {
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
}

export default function RobotControlActivity({ level, onComplete }: RobotControlActivityProps) {
  const [code, setCode] = useState(`# Kontrol lengkap untuk Kody
# Gunakan semua yang sudah dipelajari!

# 1. Nyalakan power
power = "on"
if power == "on":
    print("Kody aktif!")

# 2. Set gerakan
move = "maju"
if move == "maju":
    print("Kody jalan!")
else:
    print("Kody berhenti...")

# Tambahkan perintah lainnya!`);

  const [robotPosition, setRobotPosition] = useState<RobotPosition>({ x: 2, y: 2, direction: 'up' });
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [kodyResponse, setKodyResponse] = useState("Menunggu instruksi lengkap...");
  const [kodyResponseClass, setKodyResponseClass] = useState("text-gray-600");
  const [isSimulating, setIsSimulating] = useState(false);

  const tasks = [
    { id: "power", label: "Nyalakan Power", code: 'power = "on"', completed: false },
    { id: "movement", label: "Kontrol Gerakan", code: 'move = "maju"', completed: false },
    { id: "expression", label: "Tampilkan Ekspresi", code: 'expression = "senyum"', completed: false },
    { id: "sound", label: "Buat Suara", code: 'sound = "beep"', completed: false }
  ];

  const executePython = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest("POST", "/api/execute-python", { code });
      return response.json() as Promise<{ output: string; kodyResponse: string; success: boolean }>;
    },
    onSuccess: (result) => {
      setKodyResponse(result.kodyResponse);
      setKodyResponseClass(result.success ? "text-green-600 font-semibold" : "text-gray-600");
      
      // Check completed tasks
      const newCompletedTasks = [];
      if (code.includes('power = "on"') && code.includes('if power == "on"')) {
        newCompletedTasks.push("power");
      }
      if (code.includes('move = "maju"') && code.includes('if move == "maju"')) {
        newCompletedTasks.push("movement");
      }
      if (code.includes('expression')) {
        newCompletedTasks.push("expression");
      }
      if (code.includes('sound')) {
        newCompletedTasks.push("sound");
      }
      
      setCompletedTasks(newCompletedTasks);
      
      if (result.success && newCompletedTasks.length >= 2) {
        setIsSimulating(true);
        simulateRobotMovement();
      }
    }
  });

  const simulateRobotMovement = () => {
    let step = 0;
    const movements = [
      { x: 2, y: 1, direction: 'up' as const },
      { x: 3, y: 1, direction: 'right' as const },
      { x: 3, y: 2, direction: 'down' as const },
      { x: 2, y: 2, direction: 'left' as const }
    ];

    const interval = setInterval(() => {
      if (step < movements.length) {
        setRobotPosition(movements[step]);
        step++;
      } else {
        clearInterval(interval);
        setIsSimulating(false);
        
        // Complete the level based on performance
        let stars = 1;
        if (completedTasks.length >= 2) stars = 2;
        if (completedTasks.length >= 4) stars = 3;
        
        setTimeout(() => onComplete(stars), 1000);
      }
    }, 800);
  };

  const handleManualControl = (direction: 'up' | 'down' | 'left' | 'right') => {
    setRobotPosition(prev => {
      let newX = prev.x;
      let newY = prev.y;
      
      switch (direction) {
        case 'up': newY = Math.max(0, prev.y - 1); break;
        case 'down': newY = Math.min(4, prev.y + 1); break;
        case 'left': newX = Math.max(0, prev.x - 1); break;
        case 'right': newX = Math.min(4, prev.x + 1); break;
      }
      
      return { x: newX, y: newY, direction };
    });
  };

  const resetActivity = () => {
    setRobotPosition({ x: 2, y: 2, direction: 'up' });
    setCompletedTasks([]);
    setKodyResponse("Menunggu instruksi lengkap...");
    setKodyResponseClass("text-gray-600");
    setIsSimulating(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">🤖 Kontrol Robot Kody</h3>
        <p className="text-gray-600">Gabungkan semua yang telah dipelajari untuk mengontrol Kody sepenuhnya!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Editor Python Lengkap:</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-900 rounded-xl p-4">
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 bg-transparent text-green-400 resize-none outline-none border-none focus:ring-0 font-mono text-sm"
                placeholder="# Tulis kode lengkap untuk mengontrol Kody"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => executePython.mutate(code)}
                disabled={executePython.isPending || isSimulating}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                {executePython.isPending ? "Menjalankan..." : "Jalankan Semua"}
              </Button>
              <Button variant="outline" onClick={resetActivity}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            {/* Task Checklist */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700">Tugas yang Harus Diselesaikan:</h4>
              {tasks.map((task) => {
                const isCompleted = completedTasks.includes(task.id);
                return (
                  <div key={task.id} className={`flex items-center justify-between p-2 rounded-lg ${
                    isCompleted ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <span className={`text-sm ${isCompleted ? 'text-green-700' : 'text-gray-600'}`}>
                      {task.label}
                    </span>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        {task.code}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Robot Simulation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Simulasi Kody:</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Robot Grid */}
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="grid grid-cols-5 gap-2 mb-4">
                {Array.from({ length: 25 }, (_, i) => {
                  const x = i % 5;
                  const y = Math.floor(i / 5);
                  const isRobotHere = robotPosition.x === x && robotPosition.y === y;
                  
                  return (
                    <div
                      key={i}
                      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                        isRobotHere 
                          ? 'bg-blue-500 border-blue-600 scale-110' 
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      {isRobotHere && (
                        <div className={`text-white text-xl transform transition-transform duration-300 ${
                          isSimulating ? 'animate-bounce' : ''
                        }`}>
                          {robotPosition.direction === 'up' ? '⬆️' : 
                           robotPosition.direction === 'down' ? '⬇️' :
                           robotPosition.direction === 'left' ? '⬅️' : '➡️'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Manual Controls */}
              <div className="text-center">
                <h5 className="font-semibold text-gray-700 mb-2">Kontrol Manual:</h5>
                <div className="grid grid-cols-3 gap-2 max-w-32 mx-auto">
                  <div></div>
                  <Button 
                    size="sm" 
                    onClick={() => handleManualControl('up')}
                    disabled={isSimulating}
                    variant="outline"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <div></div>
                  <Button 
                    size="sm" 
                    onClick={() => handleManualControl('left')}
                    disabled={isSimulating}
                    variant="outline"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleManualControl('down')}
                    disabled={isSimulating}
                    variant="outline"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleManualControl('right')}
                    disabled={isSimulating}
                    variant="outline"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Kody Status */}
            <Card className="bg-green-50 border-2 border-green-200">
              <CardContent className="pt-4">
                <h4 className="font-semibold text-green-600 mb-2">🤖 Status Kody:</h4>
                <div className={kodyResponseClass}>
                  {kodyResponse}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Posisi: ({robotPosition.x}, {robotPosition.y}) | Arah: {robotPosition.direction}
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">
                Tugas Selesai: {completedTasks.length}/4
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(completedTasks.length / 4) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="bg-blue-50 border-2 border-blue-200">
        <CardContent className="pt-4">
          <h4 className="font-semibold text-blue-600 mb-2">💡 Petunjuk Level Terakhir:</h4>
          <div className="text-sm text-gray-700">
            Ini adalah level terakhir! Gunakan semua yang telah dipelajari - kontrol power, gerakan, tampilan, dan suara. 
            Tulis kode Python yang lengkap untuk mengendalikan Kody sepenuhnya. Selesaikan minimal 2 tugas untuk melanjutkan.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}