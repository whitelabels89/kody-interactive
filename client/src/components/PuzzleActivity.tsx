import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Power, Monitor, Eye, Zap, CheckCircle, Cpu, Battery, Wifi } from "lucide-react";
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
    id: "head",
    name: "Kepala Robot",
    description: "Bagian kepala dengan mata LED",
    icon: <div className="w-8 h-8 bg-gray-300 rounded-t-full border-2 border-gray-400 relative">
            <div className="absolute top-2 left-1 w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="absolute top-2 right-1 w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>,
    color: "bg-gray-500"
  },
  {
    id: "body",
    name: "Badan Robot", 
    description: "Badan utama dengan panel kontrol",
    icon: <div className="w-8 h-10 bg-gray-200 border-2 border-gray-400 relative">
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-green-400 rounded"></div>
            <div className="absolute bottom-1 left-1 w-2 h-2 bg-red-400 rounded-full"></div>
            <div className="absolute bottom-1 right-1 w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>,
    color: "bg-blue-500"
  },
  {
    id: "arms",
    name: "Lengan Robot",
    description: "Lengan untuk bergerak dan mengangkat", 
    icon: <div className="flex items-center">
            <div className="w-3 h-6 bg-gray-300 border border-gray-400 rounded-l"></div>
            <div className="w-3 h-6 bg-gray-300 border border-gray-400 rounded-r"></div>
          </div>,
    color: "bg-orange-500"
  },
  {
    id: "legs",
    name: "Kaki Robot",
    description: "Kaki untuk berjalan dan bergerak", 
    icon: <div className="flex justify-center">
            <div className="w-2 h-6 bg-gray-300 border border-gray-400 rounded mr-1"></div>
            <div className="w-2 h-6 bg-gray-300 border border-gray-400 rounded"></div>
          </div>,
    color: "bg-purple-500"
  },
  {
    id: "antenna",
    name: "Antena WiFi",
    description: "Untuk komunikasi dan internet", 
    icon: <div className="relative">
            <div className="w-1 h-4 bg-gray-400 mx-auto"></div>
            <div className="w-3 h-1 bg-gray-400 rounded-full mx-auto"></div>
          </div>,
    color: "bg-green-500"
  },
  {
    id: "power",
    name: "Baterai Daya",
    description: "Sumber tenaga untuk hidup", 
    icon: <Battery className="w-6 h-6" />,
    color: "bg-red-500"
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

        {/* Robot Assembly Area */}
        <Card>
          <CardHeader>
            <CardTitle>Rakit Robot Kody:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-b from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-dashed border-gray-300 min-h-[500px] relative">
              {/* Robot assembly structure */}
              <div className={`relative mx-auto w-56 h-80 transition-all duration-500 ${
                isCompleted ? 'animate-bounce' : ''
              } ${isAnimating ? 'animate-pulse' : ''}`}>
                
                {/* Antenna Drop Zone */}
                <div className="flex justify-center mb-2">
                  <div 
                    className={`w-12 h-8 border-2 border-dashed rounded flex items-center justify-center transition-all duration-200 ${
                      droppedParts.has('antenna') ? 'bg-green-500 border-green-500' : 'bg-gray-200 border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'antenna')}
                  >
                    {droppedParts.has('antenna') ? (
                      <div className="relative">
                        <div className="w-1 h-4 bg-white mx-auto"></div>
                        <div className="w-3 h-1 bg-white rounded-full mx-auto"></div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 text-center">Antena</span>
                    )}
                  </div>
                </div>

                {/* Head Drop Zone */}
                <div className="flex justify-center mb-3">
                  <div 
                    className={`w-24 h-24 rounded-t-full border-2 border-dashed flex items-center justify-center transition-all duration-200 ${
                      droppedParts.has('head') ? 'bg-gray-300 border-gray-500' : 'bg-gray-100 border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'head')}
                  >
                    {droppedParts.has('head') ? (
                      <div className="w-16 h-16 bg-gray-400 rounded-t-full border-2 border-gray-500 relative">
                        <div className="absolute top-4 left-3 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                        <div className="absolute top-4 right-3 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gray-600 rounded"></div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 text-center">Kepala<br/>Robot</span>
                    )}
                  </div>
                </div>

                {/* Arms and Body Section */}
                <div className="flex justify-center items-start mb-3">
                  {/* Left Arm */}
                  <div 
                    className={`w-8 h-16 rounded border-2 border-dashed flex items-center justify-center mr-2 transition-all duration-200 ${
                      droppedParts.has('arms') ? 'bg-gray-300 border-gray-500' : 'bg-gray-100 border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'arms')}
                  >
                    {droppedParts.has('arms') ? (
                      <div className="w-6 h-12 bg-gray-400 border border-gray-500 rounded flex flex-col">
                        <div className="w-full h-4 bg-gray-500 rounded-t"></div>
                        <div className="w-full h-8 bg-gray-400"></div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 text-center transform -rotate-90">Lengan</span>
                    )}
                  </div>

                  {/* Body */}
                  <div 
                    className={`w-20 h-24 rounded border-2 border-dashed flex items-center justify-center transition-all duration-200 ${
                      droppedParts.has('body') ? 'bg-blue-200 border-blue-500' : 'bg-gray-100 border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'body')}
                  >
                    {droppedParts.has('body') ? (
                      <div className="w-16 h-20 bg-blue-300 border-2 border-blue-500 rounded relative">
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-green-400 rounded animate-pulse"></div>
                        <div className="absolute top-6 left-2 w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="absolute top-6 right-2 w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-blue-500 rounded"></div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 text-center">Badan<br/>Robot</span>
                    )}
                  </div>

                  {/* Right Arm (same as left but mirrored) */}
                  <div className={`w-8 h-16 rounded border-2 border-dashed flex items-center justify-center ml-2 transition-all duration-200 ${
                    droppedParts.has('arms') ? 'bg-gray-300 border-gray-500' : 'bg-gray-100 border-gray-400'
                  }`}>
                    {droppedParts.has('arms') ? (
                      <div className="w-6 h-12 bg-gray-400 border border-gray-500 rounded flex flex-col">
                        <div className="w-full h-4 bg-gray-500 rounded-t"></div>
                        <div className="w-full h-8 bg-gray-400"></div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 text-center transform -rotate-90">Lengan</span>
                    )}
                  </div>
                </div>

                {/* Power/Battery Zone */}
                <div className="flex justify-center mb-3">
                  <div 
                    className={`w-16 h-8 rounded border-2 border-dashed flex items-center justify-center transition-all duration-200 ${
                      droppedParts.has('power') ? 'bg-red-200 border-red-500' : 'bg-gray-100 border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'power')}
                  >
                    {droppedParts.has('power') ? (
                      <Battery className="w-6 h-6 text-red-600" />
                    ) : (
                      <span className="text-xs text-gray-500 text-center">Baterai</span>
                    )}
                  </div>
                </div>

                {/* Legs Drop Zone */}
                <div className="flex justify-center">
                  <div 
                    className={`w-16 h-20 border-2 border-dashed flex items-center justify-center transition-all duration-200 ${
                      droppedParts.has('legs') ? 'bg-purple-200 border-purple-500' : 'bg-gray-100 border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'legs')}
                  >
                    {droppedParts.has('legs') ? (
                      <div className="flex justify-center space-x-1">
                        <div className="w-3 h-16 bg-purple-400 border border-purple-600 rounded flex flex-col">
                          <div className="w-full h-6 bg-purple-500 rounded-t"></div>
                          <div className="w-full h-6 bg-purple-400"></div>
                          <div className="w-full h-4 bg-gray-600 rounded-b"></div>
                        </div>
                        <div className="w-3 h-16 bg-purple-400 border border-purple-600 rounded flex flex-col">
                          <div className="w-full h-6 bg-purple-500 rounded-t"></div>
                          <div className="w-full h-6 bg-purple-400"></div>
                          <div className="w-full h-4 bg-gray-600 rounded-b"></div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 text-center">Kaki<br/>Robot</span>
                    )}
                  </div>
                </div>

                {/* Success indicator with animated eyes */}
                {isCompleted && (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg animate-bounce">
                      <CheckCircle className="w-6 h-6 inline mr-2" />
                      Robot Kody Siap!
                    </div>
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
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isAnimating ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              🤖 Robot Kody Menyala...
            </>
          ) : isCompleted ? (
            <>
              <Zap className="w-5 h-5 mr-2" />
              ⚡ Hidupkan Robot Kody!
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2" />
              Rakit Semua Bagian Dulu
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
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardContent className="pt-4">
          <h4 className="font-semibold text-blue-600 mb-2">🤖 Petunjuk Merakit Robot:</h4>
          <div className="text-sm text-gray-700 space-y-2">
            <p>• <strong>Seret dan lepas</strong> setiap bagian robot ke area yang tepat di tubuh Kody</p>
            <p>• <strong>Urutan pemasangan:</strong> Antena → Kepala → Lengan → Badan → Baterai → Kaki</p>
            <p>• Setelah semua bagian terpasang, klik <strong>"Hidupkan Robot Kody!"</strong></p>
            <p>• Lihat mata Kody berkedip dan robot siap beraksi! ⚡</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
