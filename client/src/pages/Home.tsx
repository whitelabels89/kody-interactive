import { useState, useEffect } from "react";
import { Volume2, VolumeX, Play, Info, HelpCircle, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameState } from "@/hooks/useGameState";
import LevelCard from "@/components/LevelCard";
import ActivityModal from "@/components/ActivityModal";
import AchievementModal from "@/components/AchievementModal";
import CertificateModal from "@/components/CertificateModal";
import ProgressBar from "@/components/ProgressBar";
import { levelsData } from "@/lib/levels";
import type { LevelData, Achievement } from "@shared/schema";
import headerImage from "@assets/header_1749711972120.jpg";

export default function Home() {
  const { gameState, updateGameState, completeLevel } = useGameState();
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<LevelData | null>(null);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  const scrollToLevels = () => {
    document.getElementById('levels')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLevelComplete = async (levelId: number, stars: number, achievement?: Achievement) => {
    await completeLevel(levelId, stars, achievement);
    setSelectedLevel(null);
    
    if (achievement) {
      setShowAchievement(achievement);
    }
  };

  const progressPercentage = (gameState.completedLevels.length / 6) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-orange-50">
      {/* Navigation Header */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🤖</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">Petualangan Kody</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-500">⭐</span>
                <span className="text-sm font-semibold text-gray-600">{gameState.totalStars} Bintang</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-purple-500">🏆</span>
                <span className="text-sm font-semibold text-gray-600">{gameState.badges.length} Lencana</span>
              </div>
            </div>
            
            <Button variant="destructive" className="font-semibold">
              <HelpCircle className="w-4 h-4 mr-2" />
              Bantuan
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Story Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-500 via-green-500 to-orange-500 py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white rounded-full animate-bounce-slow"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border-4 border-white rounded-lg rotate-45 animate-pulse-soft"></div>
          <div className="absolute bottom-20 left-1/3 w-12 h-12 border-4 border-white rounded-full animate-float"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="mb-8 flex justify-center">
              <img 
                src={headerImage} 
                alt="Team of young digital explorers with tablets ready for adventure" 
                className="w-full max-w-4xl h-64 object-cover rounded-3xl robot-shadow hover-lift" 
              />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-lg">
              Selamatkan <span className="story-text">Kody!</span>
            </h1>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto">
              <p className="text-lg md:text-xl text-white leading-relaxed font-semibold">
                ⚡ <strong>Petir besar menyambar dunia digital!</strong> Semua robot lumpuh, sistem mati, dan... 
                Kody—robot kecil penjelajah—ikut terkena dampaknya! Tapi tunggu... sinyal Kody masih menyala kecil!
              </p>
              <p className="text-lg md:text-xl text-white leading-relaxed font-semibold mt-4">
                🔧 Ia butuh bantuan dari tim teknisi cilik... <strong>yaitu kamu!</strong> 
                Mari jelajahi 5 dunia ajaib untuk memperbaiki Kody!
              </p>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={scrollToLevels}
                size="lg"
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-2xl"
              >
                <Play className="w-6 h-6 mr-3" />
                Mulai Petualangan!
              </Button>
              
              {gameState.completedLevels.length > 0 && (
                <Button 
                  onClick={() => setShowCertificate(true)}
                  size="lg"
                  className="bg-yellow-500 text-white px-8 py-4 rounded-2xl font-black text-xl hover:bg-yellow-600 transform hover:scale-105 transition-all duration-200 shadow-2xl"
                >
                  <Award className="w-6 h-6 mr-3" />
                  Sertifikat
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Audio Control */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setAudioEnabled(!audioEnabled)}
          size="lg"
          className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-200"
        >
          {audioEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </Button>
      </div>

      {/* Progress Overview */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Perjalanan Penyelamatan</h2>
            <ProgressBar 
              percentage={progressPercentage} 
              currentLevel={gameState.currentLevel} 
              totalLevels={7}
            />
          </div>
        </div>
      </section>

      {/* Levels Section */}
      <section id="levels" className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-center text-gray-800 mb-4">5 Dunia Perbaikan Kody</h2>
          <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Setiap dunia mengajarkan keterampilan teknologi berbeda. Kumpulkan semua bagian untuk menghidupkan Kody kembali!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {levelsData.map((level) => {
              const isCompleted = gameState.completedLevels.includes(level.id);
              const isLocked = level.id > gameState.currentLevel;
              
              return (
                <LevelCard
                  key={level.id}
                  level={{
                    ...level,
                    isCompleted,
                    isLocked,
                    stars: 0 // TODO: Get from level progress
                  }}
                  onClick={() => !isLocked && setSelectedLevel(level)}
                />
              );
            })}
          </div>

          {/* Achievement Badges */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-100">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Kemajuan Keseluruhan</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {gameState.achievements.map((achievement, index) => (
                  <div key={achievement.id} className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center ${
                      achievement ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-200'
                    }`}>
                      <span className={`text-xl ${achievement ? 'text-white' : 'text-gray-400'}`}>
                        {achievement?.icon || '🏆'}
                      </span>
                    </div>
                    <div className={`text-sm font-semibold ${achievement ? 'text-gray-600' : 'text-gray-400'}`}>
                      {achievement?.title || `Lencana ${index + 1}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certificate Preview */}
      <section className="py-16 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black mb-6">🏆 Achievement Workshop 5 Digital World</h2>
          <p className="text-xl mb-8 opacity-90">
            Selesaikan semua 6 level untuk mendapatkan sertifikat resmi sebagai "Pahlawan Digital" dengan nama kustommu!
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-8">
            <div className="bg-white text-gray-800 rounded-2xl p-8 transform hover:scale-105 transition-transform duration-200">
              <div className="border-4 border-purple-500 rounded-xl p-6">
                <h3 className="text-2xl font-bold mb-4 text-purple-500">ACHIEVEMENT WORKSHOP 5 DIGITAL WORLD</h3>
                <p className="text-lg mb-4">Diberikan kepada</p>
                <div className="text-3xl font-black text-blue-500 border-b-2 border-gray-300 pb-2 mb-4">
                  PAHLAWAN DIGITAL
                </div>
                <p className="text-base mb-6">
                  Telah berhasil menyelamatkan robot Kody dan menguasai 5 keterampilan teknologi: 
                  Digital Literacy, Python Programming, Web Design, UI/UX, dan Robotics Control
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <div className="text-sm text-gray-600">Tanggal:</div>
                    <div className="font-semibold">{new Date().toLocaleDateString('id-ID')}</div>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl">🤖</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-gray-800 mb-6">Siap Jadi Pahlawan Digital?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Kody menunggu bantuanmu! Mulai petualangan dan pelajari teknologi dengan cara yang seru dan interaktif.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={scrollToLevels}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-4 rounded-2xl font-black text-xl hover:from-blue-600 hover:to-green-600 transform hover:scale-105 transition-all duration-200 shadow-2xl"
            >
              <Play className="w-6 h-6 mr-3" />
              Mulai Sekarang!
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-blue-500 text-blue-500 px-8 py-4 rounded-2xl font-bold text-xl hover:bg-blue-500 hover:text-white transition-all duration-200"
            >
              <Info className="w-6 h-6 mr-3" />
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </div>
      </section>

      {/* Modals */}
      {selectedLevel && (
        <ActivityModal
          level={selectedLevel}
          onClose={() => setSelectedLevel(null)}
          onComplete={handleLevelComplete}
        />
      )}

      {showAchievement && (
        <AchievementModal
          achievement={showAchievement}
          onClose={() => setShowAchievement(null)}
        />
      )}

      {showCertificate && (
        <CertificateModal
          gameState={gameState}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
}
