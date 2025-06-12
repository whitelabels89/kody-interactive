import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Smile, Volume2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, CheckCircle } from "lucide-react";
import type { LevelData } from "@shared/schema";

interface UIDesignActivityProps {
  level: LevelData;
  onComplete: (stars: number) => void;
}

interface ControlButton {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  action: string;
  isActive: boolean;
}

export default function UIDesignActivity({ level, onComplete }: UIDesignActivityProps) {
  const [controlButtons, setControlButtons] = useState<ControlButton[]>([
    { id: "walk", label: "Jalan", icon: <Play className="w-4 h-4" />, color: "bg-blue-500", action: "Kody berjalan maju!", isActive: false },
    { id: "smile", label: "Senyum", icon: <Smile className="w-4 h-4" />, color: "bg-green-500", action: "Kody tersenyum! 😊", isActive: false },
    { id: "hello", label: "Halo", icon: <Volume2 className="w-4 h-4" />, color: "bg-yellow-500", action: "Kody berkata: Halo semuanya!", isActive: false },
    { id: "up", label: "Naik", icon: <ArrowUp className="w-4 h-4" />, color: "bg-purple-500", action: "Kody bergerak ke atas!", isActive: false },
    { id: "down", label: "Turun", icon: <ArrowDown className="w-4 h-4" />, color: "bg-orange-500", action: "Kody bergerak ke bawah!", isActive: false },
    { id: "left", label: "Kiri", icon: <ArrowLeft className="w-4 h-4" />, color: "bg-pink-500", action: "Kody belok kiri!", isActive: false },
    { id: "right", label: "Kanan", icon: <ArrowRight className="w-4 h-4" />, color: "bg-indigo-500", action: "Kody belok kanan!", isActive: false },
    { id: "spin", label: "Putar", icon: <RotateCcw className="w-4 h-4" />, color: "bg-red-500", action: "Kody berputar 360°!", isActive: false },
    { id: "dance", label: "Menari", icon: <Play className="w-4 h-4" />, color: "bg-teal-500", action: "Kody menari dengan gembira! 💃", isActive: false },
    { id: "beep", label: "Beep", icon: <Volume2 className="w-4 h-4" />, color: "bg-cyan-500", action: "Kody berbunyi: Beep beep!", isActive: false }
  ]);

  const [selectedButtons, setSelectedButtons] = useState<string[]>([]);
  const [kodyResponse, setKodyResponse] = useState("Menunggu perintah...");
  const [kodyResponseClass, setKodyResponseClass] = useState("text-gray-600");
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const handleButtonSelect = (buttonId: string) => {
    if (selectedButtons.includes(buttonId)) {
      setSelectedButtons(selectedButtons.filter(id => id !== buttonId));
    } else if (selectedButtons.length < 6) {
      setSelectedButtons([...selectedButtons, buttonId]);
    }
  };

  const handleTestButton = (button: ControlButton) => {
    setKodyResponse(button.action);
    setKodyResponseClass("text-green-600 font-semibold");
    
    // Add to test results
    if (!testResults.includes(button.label)) {
      setTestResults([...testResults, button.label]);
    }

    // Mark button as active temporarily
    setControlButtons(prev => 
      prev.map(b => 
        b.id === button.id 
          ? { ...b, isActive: true }
          : { ...b, isActive: false }
      )
    );

    // Reset after animation
    setTimeout(() => {
      setControlButtons(prev => 
        prev.map(b => ({ ...b, isActive: false }))
      );
    }, 1000);
  };

  const handleCompleteUI = () => {
    let stars = 1;
    if (selectedButtons.length >= 2) stars = 2;
    if (selectedButtons.length >= 3 && testResults.length >= 3) stars = 3;
    
    setIsComplete(true);
    onComplete(stars);
  };

  const resetActivity = () => {
    setSelectedButtons([]);
    setTestResults([]);
    setKodyResponse("Menunggu perintah...");
    setKodyResponseClass("text-gray-600");
    setIsComplete(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">📱 Desain Tombol Kontrol</h3>
        <p className="text-gray-600">Rancang tombol yang mudah digunakan untuk mengontrol Kody!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Button Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Pilih Tombol Kontrol (Maksimal 6):</CardTitle>
            <div className="text-sm text-gray-600">
              Pilih tombol yang menurut kamu paling penting untuk mengontrol Kody
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {controlButtons.map((button) => {
              const isSelected = selectedButtons.includes(button.id);
              const canSelect = selectedButtons.length < 6 || isSelected;
              
              return (
                <div
                  key={button.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : canSelect 
                        ? 'border-gray-200 hover:border-gray-300 bg-white' 
                        : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                  } ${button.isActive ? 'animate-pulse bg-green-100' : ''}`}
                  onClick={() => canSelect && handleButtonSelect(button.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${button.color} rounded-lg flex items-center justify-center text-white`}>
                        {button.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{button.label}</div>
                        <div className="text-sm text-gray-500">{button.action}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Control Panel Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Panel Kontrol Kody:</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Enhanced Interactive Panel */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 min-h-[300px] hover-lift rainbow-border">
              {/* Status Header */}
              <div className="text-center mb-4">
                <h4 className="text-white font-semibold mb-2 animate-text-wave">Kontrol Kody</h4>
                <div className="flex justify-center items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="text-green-400 text-sm">Status: Siap menerima perintah</div>
                </div>
                
                {/* Connection Indicators */}
                <div className="flex justify-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-1 h-3 bg-blue-400 rounded animate-bounce-slow" style={{animationDelay: `${i * 0.1}s`}}></div>
                  ))}
                </div>
              </div>
              
              {/* Interactive Button Grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {selectedButtons.map((buttonId) => {
                  const button = controlButtons.find(b => b.id === buttonId)!;
                  return (
                    <Button
                      key={button.id}
                      onClick={() => handleTestButton(button)}
                      className={`${button.color} hover:opacity-80 text-white font-semibold py-4 rounded-xl transition-all duration-300 interactive-btn hover-lift animate-heartbeat shadow-lg ${
                        button.isActive ? 'scale-105 ring-4 ring-white ring-opacity-50' : ''
                      }`}
                      style={{animationDelay: `${selectedButtons.indexOf(buttonId) * 0.2}s`}}
                    >
                      <div className="flex flex-col items-center">
                        <span className="mb-1 text-lg floating-icon">{button.icon}</span>
                        <span className="text-xs">{button.label}</span>
                      </div>
                    </Button>
                  );
                })}
              </div>

              {/* Quick Action Bar */}
              {selectedButtons.length > 0 && (
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-center gap-2">
                    <Button onClick={() => setSelectedButtons([])} variant="outline" size="sm" className="text-white border-gray-600 hover:bg-gray-700">
                      Reset All
                    </Button>
                    <Button onClick={handleCompleteUI} variant="outline" size="sm" className="text-green-400 border-green-400 hover:bg-green-400 hover:text-black">
                      Test Panel
                    </Button>
                  </div>
                </div>
              )}

              {selectedButtons.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  <div className="floating-icon text-3xl mb-2">🎮</div>
                  <p>Pilih tombol dari daftar di sebelah kiri</p>
                  <p className="text-sm mt-1">Maksimal 6 tombol kontrol</p>
                </div>
              )}
            </div>

            {/* Kody Response */}
            <Card className="bg-green-50 border-2 border-green-200">
              <CardContent className="pt-4">
                <h4 className="font-semibold text-green-600 mb-2">🤖 Respons Kody:</h4>
                <div className={kodyResponseClass}>
                  {kodyResponse}
                </div>
              </CardContent>
            </Card>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Tombol yang Sudah Diuji:</h4>
                <div className="flex flex-wrap gap-2">
                  {testResults.map((result, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-600">
                      ✓ {result}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="text-center space-x-4">
        <Button 
          onClick={handleCompleteUI}
          disabled={selectedButtons.length === 0}
          className={`px-8 py-3 rounded-xl font-semibold text-lg ${
            selectedButtons.length > 0 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Selesaikan UI
        </Button>
        
        <Button 
          variant="outline" 
          onClick={resetActivity}
          className="px-6 py-3 rounded-xl font-semibold"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset
        </Button>
      </div>

      {/* Instructions */}
      <Card className="bg-blue-50 border-2 border-blue-200">
        <CardContent className="pt-4">
          <h4 className="font-semibold text-blue-600 mb-2">💡 Petunjuk:</h4>
          <div className="text-sm text-gray-700">
            Pilih 3 tombol yang menurut kamu paling penting untuk mengontrol robot. Pikirkan tentang kemudahan penggunaan 
            dan fungsi yang paling sering dipakai. Setelah memilih, coba test setiap tombol untuk melihat responnya!
          </div>
        </CardContent>
      </Card>
    </div>
  );
}