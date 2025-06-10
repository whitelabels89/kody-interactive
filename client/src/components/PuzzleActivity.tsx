import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Power, Monitor, Eye, Zap, CheckCircle } from "lucide-react";
import type { LevelData } from "@shared/schema";

interface PuzzleActivityProps {
  level: LevelData;
  onComplete: (stars: number) => void;
}

interface RobotPart {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const robotParts: RobotPart[] = [
  {
    id: "power-button",
    name: "Tombol ON/OFF",
    description: "Untuk menghidupkan Kody",
    icon: <Power className="w-6 h-6" />,
    color: "bg-blue-500"
  },
  {
    id: "screen",
    name: "Layar Wajah", 
    description: "Untuk menampilkan ekspresi",
    icon: <Monitor className="w-6 h-6" />,
    color: "bg-green-500"
  },
  {
    id: "sensor",
    name: "Sensor Mata",
    description: "Untuk melihat sekitar", 
    icon: <Eye className="w-6 h-6" />,
    color: "bg-orange-500"
  }
];

export default function PuzzleActivity({ level, onComplete }: PuzzleActivityProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [droppedParts, setDroppedParts] = useState<Set<string>>(new Set());
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleDragStart = (e: React.DragEvent, partId: string) => {
    setDraggedItem(partId);
    e.dataTransfer.setData("text/plain", partId);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropZone: string) => {
    e.preventDefault();
    const partId = e.dataTransfer.getData("text/plain");
    
    if (partId === dropZone) {
      const newDroppedParts = new Set(droppedParts);
      newDroppedParts.add(partId);
      setDroppedParts(newDroppedParts);
      
      // Check if all parts are placed
      if (newDroppedParts.size === robotParts.length) {
        setIsCompleted(true);
      }
    }
  };

  const handleTestRobot = async () => {
    if (!isCompleted) return;
    
    setIsAnimating(true);
    
    // Simulate robot activation
    setTimeout(() => {
      setIsAnimating(false);
      onComplete(3); // Award 3 stars for successful completion
    }, 2000);
  };

  const resetPuzzle = () => {
    setDroppedParts(new Set());
    setIsCompleted(false);
    setIsAnimating(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">🧩 Pasang Bagian Robot Kody</h3>
        <p className="text-gray-600">Seret dan letakkan bagian-bagian ini ke tempat yang tepat di tubuh Kody!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Robot Parts */}
        <Card>
          <CardHeader>
            <CardTitle>Bagian-bagian Robot:</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {robotParts.map((part) => {
              const isUsed = droppedParts.has(part.id);
              return (
                <div
                  key={part.id}
                  className={`p-4 rounded-xl shadow-md cursor-move hover:shadow-lg transition-all duration-200 border-2 border-dashed border-gray-300 ${
                    isUsed ? 'opacity-50 pointer-events-none' : 'hover:border-blue-300'
                  } ${draggedItem === part.id ? 'opacity-50' : ''}`}
                  draggable={!isUsed}
                  onDragStart={(e) => handleDragStart(e, part.id)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${part.color} rounded-lg flex items-center justify-center text-white`}>
                      {part.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{part.name}</div>
                      <div className="text-sm text-gray-500">{part.description}</div>
                    </div>
                    {isUsed && <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Robot Body Drop Zone */}
        <Card>
          <CardHeader>
            <CardTitle>Tubuh Kody:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 rounded-2xl p-6 border-2 border-dashed border-gray-300 min-h-[400px] relative">
              {/* Robot outline with drop zones */}
              <div className={`relative mx-auto w-48 h-64 bg-gray-200 rounded-3xl flex flex-col items-center justify-center border-2 border-gray-300 transition-all duration-200 ${
                isCompleted ? 'bg-green-100 border-green-300' : ''
              } ${isAnimating ? 'animate-pulse' : ''}`}>
                
                {/* Head area - Screen */}
                <div 
                  className={`w-20 h-20 rounded-full mb-4 border-2 border-dashed flex items-center justify-center transition-all duration-200 ${
                    droppedParts.has('screen') ? 'bg-green-500 border-green-500' : 'bg-gray-300 border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'screen')}
                >
                  {droppedParts.has('screen') ? (
                    <Monitor className="w-8 h-8 text-white" />
                  ) : (
                    <span className="text-xs text-gray-500 text-center">Layar<br/>Wajah</span>
                  )}
                </div>
                
                {/* Body area - Power Button */}
                <div 
                  className={`w-16 h-16 rounded-lg mb-4 border-2 border-dashed flex items-center justify-center transition-all duration-200 ${
                    droppedParts.has('power-button') ? 'bg-blue-500 border-blue-500' : 'bg-gray-300 border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'power-button')}
                >
                  {droppedParts.has('power-button') ? (
                    <Power className="w-6 h-6 text-white" />
                  ) : (
                    <span className="text-xs text-gray-500 text-center">Tombol<br/>Power</span>
                  )}
                </div>
                
                {/* Sensor area */}
                <div 
                  className={`w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-200 ${
                    droppedParts.has('sensor') ? 'bg-orange-500 border-orange-500' : 'bg-gray-300 border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'sensor')}
                >
                  {droppedParts.has('sensor') ? (
                    <Eye className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-xs text-gray-500 text-center">Sensor</span>
                  )}
                </div>

                {/* Success indicator */}
                {isCompleted && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="text-center space-x-4">
        <Button 
          onClick={handleTestRobot}
          disabled={!isCompleted || isAnimating}
          className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${
            isCompleted 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isAnimating ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Menyalakan...
            </>
          ) : isCompleted ? (
            <>
              <Zap className="w-5 h-5 mr-2" />
              Nyalakan Kody!
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2" />
              Pasang Semua Bagian Dulu
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={resetPuzzle}
          className="px-6 py-3 rounded-xl font-semibold"
        >
          Reset Puzzle
        </Button>
      </div>

      {/* Instructions */}
      <Card className="bg-blue-50 border-2 border-blue-200">
        <CardContent className="pt-4">
          <h4 className="font-semibold text-blue-600 mb-2">💡 Petunjuk:</h4>
          <div className="text-sm text-gray-700">
            Seret setiap bagian robot ke tempat yang tepat di tubuh Kody. Pastikan semua bagian terpasang dengan benar 
            sebelum menyalakan Kody!
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
