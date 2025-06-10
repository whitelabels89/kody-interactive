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
  const [emoji, setEmoji] = useState("😊");
  const [isComplete, setIsComplete] = useState(false);

  const backgroundColors = {
    blue: "bg-blue-500",
    green: "bg-green-500", 
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    pink: "bg-pink-500"
  };

  const emojiOptions = ["😊", "🤖", "😄", "😎", "🚀", "⚡", "💫", "🌟"];

  const handlePreview = () => {
    setIsComplete(true);
  };

  const handleComplete = () => {
    let stars = 1;
    if (robotName.length > 0 && statusMessage.length > 0) stars = 2;
    if (robotName !== "Kody" || statusMessage !== "Aktif" || backgroundColor !== "blue" || emoji !== "😊") stars = 3;
    
    onComplete(stars);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">🌐 Desain Wajah Kody</h3>
        <p className="text-gray-600">Buat tampilan visual untuk wajah Kody di layar!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Design Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Kontrol Desain
            </CardTitle>
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
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Monitor className="w-4 h-4 mr-2" />
              Preview Wajah
            </Button>
          </CardContent>
        </Card>

        {/* Live Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Monitor className="w-5 h-5 mr-2" />
              Layar Wajah Kody
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`rounded-2xl p-8 text-center text-white transition-all duration-300 ${backgroundColors[backgroundColor as keyof typeof backgroundColors]}`}>
              <div className="mb-4">
                <div className="text-6xl mb-4">{emoji}</div>
                <h1 className="text-3xl font-bold mb-2">Halo, aku {robotName}!</h1>
                <p className="text-xl opacity-90">Status: {statusMessage}</p>
              </div>
              
              {/* Robot visual elements */}
              <div className="flex justify-center space-x-4 mt-6">
                <div className="w-4 h-4 bg-white rounded-full opacity-80 animate-pulse"></div>
                <div className="w-4 h-4 bg-white rounded-full opacity-60 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-4 h-4 bg-white rounded-full opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
            </div>

            {/* HTML Code Preview */}
            <div className="mt-4 bg-gray-900 rounded-lg p-4 text-sm font-mono">
              <div className="text-green-400 mb-2">{"<!-- HTML Code -->"}</div>
              <div className="text-blue-300">{"<h1>"}</div>
              <div className="text-white ml-4">Halo, aku {robotName}!</div>
              <div className="text-blue-300">{"</h1>"}</div>
              <div className="text-blue-300">{"<p>"}</div>
              <div className="text-white ml-4">Status: {statusMessage}</div>
              <div className="text-blue-300">{"</p>"}</div>
              <div className="text-yellow-300 mt-2">{"/* CSS */"}</div>
              <div className="text-pink-300">background: {backgroundColor};</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Complete Button */}
      {isComplete && (
        <div className="text-center">
          <Button 
            onClick={handleComplete}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold text-lg"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Wajah Kody Siap!
          </Button>
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