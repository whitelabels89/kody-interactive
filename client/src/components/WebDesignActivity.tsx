import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Monitor, CheckCircle } from "lucide-react";
import type { LevelData } from "@shared/schema";

interface WebDesignActivityProps {
  level: LevelData;
  onComplete: (stars: number) => void;
}

export default function WebDesignActivity({ level, onComplete }: WebDesignActivityProps) {
  const [robotName, setRobotName] = useState("Kody");
  const [statusMessage, setStatusMessage] = useState("Aktif");
  const [backgroundColor, setBackgroundColor] = useState("blue");
  const [emoji, setEmoji] = useState("🤖");
  const [isComplete, setIsComplete] = useState(false);

  const backgroundColors = {
    blue: "bg-blue-500",
    green: "bg-green-500", 
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    pink: "bg-pink-500"
  };

  const emojiOptions = ["🤖", "🚀", "⚡", "💫", "🌟", "🔋", "⚙️", "🎯"];

  const handlePreview = () => {
    setIsComplete(true);
  };

  const handleComplete = () => {
    let stars = 1;
    if (robotName.length > 0 && statusMessage.length > 0) stars = 2;
    if (robotName !== "Kody" || statusMessage !== "Aktif" || backgroundColor !== "blue" || emoji !== "🤖") stars = 3;
    
    onComplete(stars);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">🌐 Desain Wajah Kody</h3>
        <p className="text-gray-600">Buat tampilan visual untuk wajah Kody di layar!</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Design Controls */}
        <Card className="hover-lift rainbow-border">
          <CardHeader className="relative">
            <div className="absolute top-2 right-2">
              <div className="floating-icon text-lg">🎨</div>
            </div>
            <CardTitle className="text-xl flex items-center animate-text-wave">
              <Palette className="w-5 h-5 mr-2 animate-bounce-slow" />
              Kontrol Desain Interaktif
            </CardTitle>
            <div className="mt-2">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" style={{animationDelay: `${i * 0.1}s`}}></div>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="robotName">Nama Robot:</Label>
              <Input
                id="robotName"
                value={robotName}
                onChange={(e) => setRobotName(e.target.value)}
                placeholder="Masukkan nama robot"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="statusMessage">Pesan Status:</Label>
              <Input
                id="statusMessage"
                value={statusMessage}
                onChange={(e) => setStatusMessage(e.target.value)}
                placeholder="Masukkan status robot"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Warna Latar:</Label>
              <Select value={backgroundColor} onValueChange={setBackgroundColor}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih warna" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Biru</SelectItem>
                  <SelectItem value="green">Hijau</SelectItem>
                  <SelectItem value="purple">Ungu</SelectItem>
                  <SelectItem value="orange">Oranye</SelectItem>
                  <SelectItem value="pink">Pink</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Emoji Ekspresi:</Label>
              <div className="grid grid-cols-4 gap-2">
                {emojiOptions.map((emojiOption) => (
                  <Button
                    key={emojiOption}
                    variant={emoji === emojiOption ? "default" : "outline"}
                    onClick={() => setEmoji(emojiOption)}
                    className="h-12 text-2xl"
                  >
                    {emojiOption}
                  </Button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handlePreview}
              className="w-full interactive-btn bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover-lift"
            >
              <Monitor className="w-4 h-4 mr-2 animate-bounce-slow" />
              Preview Wajah ✨
            </Button>
            
            {/* Interactive Status Indicator */}
            <div className="mt-4 flex justify-center">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-gray-600">Siap untuk preview</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Live Preview */}
        <Card className="hover-lift">
          <CardHeader className="relative overflow-hidden">
            {/* Animated Tech Background */}
            <div className="absolute inset-0 matrix-bg opacity-30"></div>
            <div className="relative z-10">
              <CardTitle className="text-xl flex items-center animate-text-wave">
                <Monitor className="w-5 h-5 mr-2 animate-pulse" />
                Layar Wajah Kody
              </CardTitle>
              
              {/* Live Status Indicators */}
              <div className="flex gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">Live</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <span className="text-xs text-gray-500">Responsive</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <span className="text-xs text-gray-500">Interactive</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`rounded-2xl p-8 text-center text-white transition-all duration-300 ${backgroundColors[backgroundColor as keyof typeof backgroundColors]} robot-screen`}>
              {/* Robot Face with Blinking Eyes */}
              <div className="mb-4 relative">
                <div className="robot-face-container mb-6">
                  {/* Blinking Eyes */}
                  <div className="flex justify-center space-x-6 mb-4">
                    <div className="eye-container">
                      <div className="eye bg-white rounded-full w-8 h-8 flex items-center justify-center">
                        <div className="pupil bg-black rounded-full w-4 h-4 animate-eye-move"></div>
                      </div>
                      <div className="eyelid bg-white"></div>
                    </div>
                    <div className="eye-container">
                      <div className="eye bg-white rounded-full w-8 h-8 flex items-center justify-center">
                        <div className="pupil bg-black rounded-full w-4 h-4 animate-eye-move"></div>
                      </div>
                      <div className="eyelid bg-white"></div>
                    </div>
                  </div>
                  
                  {/* Animated Emoji Expression */}
                  <div className="text-6xl mb-4 emoji-bounce">{emoji}</div>
                </div>
                
                <h1 className="text-3xl font-bold mb-2 text-glow animate-text-wave">Halo, aku {robotName}!</h1>
                <p className="text-xl opacity-90 animate-fade-in-out">Status: {statusMessage}</p>
              </div>
              
              {/* Interactive Control Panel */}
              <div className="flex justify-center items-center space-x-6 mt-6">
                {/* Status Lights */}
                <div className="flex space-x-2">
                  <div className="indicator-light bg-green-400 rounded-full animate-pulse hover:scale-125 transition-transform cursor-pointer" title="System Active"></div>
                  <div className="indicator-light bg-yellow-400 rounded-full animate-pulse hover:scale-125 transition-transform cursor-pointer" style={{animationDelay: '0.5s'}} title="Processing"></div>
                  <div className="indicator-light bg-blue-400 rounded-full animate-pulse hover:scale-125 transition-transform cursor-pointer" style={{animationDelay: '1s'}} title="Online"></div>
                </div>
                
                {/* Interactive Buttons */}
                <div className="flex space-x-3">
                  <button className="interactive-btn bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:rotate-1">
                    🎵 Sound
                  </button>
                  <button className="interactive-btn bg-gradient-to-r from-green-400 to-blue-400 text-white px-4 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-rotate-1">
                    ⚡ Power
                  </button>
                </div>
              </div>
              
              {/* Progress Bars */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-medium text-gray-600 w-16">CPU:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="progress-bar bg-gradient-to-r from-blue-400 to-purple-500 h-full rounded-full animate-progress" style={{width: '75%'}}></div>
                  </div>
                  <span className="text-xs text-gray-500">75%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-medium text-gray-600 w-16">Memory:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="progress-bar bg-gradient-to-r from-green-400 to-teal-500 h-full rounded-full animate-progress" style={{width: '60%', animationDelay: '0.5s'}}></div>
                  </div>
                  <span className="text-xs text-gray-500">60%</span>
                </div>
              </div>
              
              {/* Enhanced Floating Elements */}
              <div className="floating-particles">
                <div className="particle particle-1"></div>
                <div className="particle particle-2"></div>
                <div className="particle particle-3"></div>
                <div className="particle particle-4"></div>
                <div className="particle particle-5"></div>
                <div className="particle particle-6"></div>
              </div>
              
              {/* Interactive Floating Icons */}
              <div className="absolute top-4 left-4">
                <div className="floating-icon text-2xl cursor-pointer hover:scale-125 transition-transform">🔧</div>
              </div>
              <div className="absolute bottom-4 right-4">
                <div className="floating-icon text-2xl cursor-pointer hover:scale-125 transition-transform" style={{animationDelay: '2s'}}>⚙️</div>
              </div>
              <div className="absolute top-1/2 left-2">
                <div className="floating-icon text-xl cursor-pointer hover:scale-125 transition-transform" style={{animationDelay: '1s'}}>🎯</div>
              </div>
            </div>

            {/* Interactive Dashboard Mini */}
            <div className="mt-4 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg p-4 hover-lift matrix-bg">
              <div className="grid grid-cols-3 gap-4 mb-4">
                {/* Mini Gauges */}
                <div className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <div className="w-full h-full rounded-full border-4 border-gray-600 relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-green-400 to-blue-500 animate-pulse" style={{height: '75%'}}></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">75%</div>
                  </div>
                  <div className="text-xs text-gray-300">Power</div>
                </div>
                
                <div className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <div className="w-full h-full rounded-full border-4 border-gray-600 relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-yellow-400 to-orange-500 animate-pulse" style={{height: '60%', animationDelay: '0.5s'}}></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">60%</div>
                  </div>
                  <div className="text-xs text-gray-300">Heat</div>
                </div>
                
                <div className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <div className="w-full h-full rounded-full border-4 border-gray-600 relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-purple-400 to-pink-500 animate-pulse" style={{height: '90%', animationDelay: '1s'}}></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">90%</div>
                  </div>
                  <div className="text-xs text-gray-300">Signal</div>
                </div>
              </div>
              
              {/* Interactive Control Grid */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {['🔵', '🟢', '🟡', '🔴'].map((color, i) => (
                  <button 
                    key={i}
                    className="w-12 h-12 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-xl transition-all duration-300 hover:scale-110 animate-heartbeat ml-[0px] mr-[0px]"
                    style={{animationDelay: `${i * 0.2}s`}}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* HTML Code Preview with Enhanced Animations */}
            <div className="mt-4 rainbow-border">
              <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono code-editor">
                <div className="text-green-400 mb-2 animate-type-writer glitch-text">{"<!-- HTML Interaktif -->"}</div>
                <div className="text-blue-300 animate-code-highlight">{"<div class=\"robot-dashboard\">"}</div>
                <div className="text-white ml-4 animate-fade-in-out">  <h1 className="animate-heartbeat">Halo, aku {robotName}!</h1></div>
                <div className="text-white ml-4 animate-fade-in-out">  <p className="glitch-text">Status: {statusMessage}</p></div>
                <div className="text-white ml-4 animate-fade-in-out">  <div className="progress-bars">...</div></div>
                <div className="text-blue-300">{"</div>"}</div>
                <div className="text-yellow-300 mt-2 animate-type-writer">{"/* CSS Magic ✨ */"}</div>
                <div className="text-pink-300 animate-code-highlight">animation: heartbeat 2s infinite;</div>
                <div className="text-cyan-300 animate-code-highlight">background: linear-gradient(45deg, rainbow...);</div>
                <div className="text-purple-300 animate-code-highlight">transform: scale(1.1) rotate(1deg);</div>
                <div className="text-green-300 animate-code-highlight">box-shadow: 0 0 20px rgba(magic);</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Enhanced Complete Section */}
      {isComplete && (
        <div className="text-center">
          <div className="mb-6 p-6 bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 rounded-2xl border-2 border-green-300 hover-lift rainbow-border">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="floating-icon text-3xl">🎉</div>
              <span className="text-2xl font-bold text-green-700 animate-text-wave glitch-text">Luar Biasa!</span>
              <div className="floating-icon text-3xl" style={{animationDelay: '1s'}}>✨</div>
            </div>
            <p className="text-lg text-green-600 animate-fade-in-out mb-4">
              Kamu berhasil membuat wajah robot yang sangat keren!
            </p>
            
            {/* Achievement Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 animate-heartbeat">HTML</div>
                <div className="text-xs text-gray-600">Struktur</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 animate-heartbeat" style={{animationDelay: '0.3s'}}>CSS</div>
                <div className="text-xs text-gray-600">Styling</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 animate-heartbeat" style={{animationDelay: '0.6s'}}>UI</div>
                <div className="text-xs text-gray-600">Design</div>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleComplete}
            className="interactive-btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white px-12 py-4 rounded-2xl font-bold text-xl hover-lift animate-heartbeat shadow-lg"
          >
            <CheckCircle className="w-6 h-6 mr-3 animate-bounce-slow" />
            Wajah Kody Siap! 🚀
          </Button>
          
          {/* Celebration Effects */}
          <div className="relative mt-6 h-12">
            <div className="floating-particles">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-3 h-3 rounded-full animate-bounce-slow"
                  style={{
                    left: `${5 + i * 7}%`,
                    backgroundColor: ['#fbbf24', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'][i % 5],
                    animationDelay: `${i * 0.15}s`,
                    top: `${Math.random() * 30}px`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Instructions */}
      <Card className="bg-blue-50 border-2 border-blue-200">
        <CardContent className="pt-4">
          <h4 className="font-semibold text-blue-600 mb-2">💡 Petunjuk:</h4>
          <div className="text-sm text-gray-700">
            Sesuaikan nama, status, warna latar, dan emoji untuk membuat wajah yang unik untuk Kody. 
            Lihat bagaimana perubahan Anda langsung muncul di layar robot! Ini mengajarkan dasar-dasar HTML dan CSS.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}