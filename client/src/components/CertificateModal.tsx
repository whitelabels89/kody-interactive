import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Award, Star } from 'lucide-react';

interface CertificateModalProps {
  onClose: () => void;
  gameState: {
    completedLevels: number[];
    totalStars: number;
    achievements: Array<{ title: string; earnedAt: string }>;
  };
}

export default function CertificateModal({ onClose, gameState }: CertificateModalProps) {
  const [studentName, setStudentName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!studentName.trim()) {
      alert('Silakan masukkan nama siswa terlebih dahulu');
      return;
    }

    setIsGenerating(true);
    
    // Create certificate canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 1200;
    canvas.height = 850;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1e40af');
    gradient.addColorStop(0.5, '#3b82f6');
    gradient.addColorStop(1, '#1e40af');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Inner border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SERTIFIKAT PRESTASI', canvas.width / 2, 180);

    // Subtitle
    ctx.font = '32px Arial';
    ctx.fillText('Achievement Workshop 5 Digital World', canvas.width / 2, 230);

    // Award text
    ctx.font = '24px Arial';
    ctx.fillText('Diberikan kepada:', canvas.width / 2, 300);

    // Student name
    ctx.font = 'bold 42px Arial';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(studentName.toUpperCase(), canvas.width / 2, 360);

    // Achievement text
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.fillText('Sebagai Pahlawan Digital yang telah berhasil menyelesaikan', canvas.width / 2, 420);
    ctx.fillText('Petualangan Kody dengan gemilang!', canvas.width / 2, 450);

    // Stats
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Level Diselesaikan: ${gameState.completedLevels.length}/6`, canvas.width / 2, 520);
    ctx.fillText(`Total Bintang: ${gameState.totalStars}`, canvas.width / 2, 560);
    ctx.fillText(`Achievement: ${gameState.achievements.length}`, canvas.width / 2, 600);

    // Date
    ctx.font = '18px Arial';
    const currentDate = new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    ctx.fillText(`Tanggal: ${currentDate}`, canvas.width / 2, 680);

    // Signature area
    ctx.font = '16px Arial';
    ctx.fillText('Digital Learning Platform', canvas.width / 2, 750);
    ctx.fillText('Petualangan Kody', canvas.width / 2, 780);

    // Download the certificate
    const link = document.createElement('a');
    link.download = `Sertifikat_${studentName.replace(/\s+/g, '_')}_Pahlawan_Digital.png`;
    link.href = canvas.toDataURL();
    link.click();

    setIsGenerating(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-500" />
            Sertifikat Pahlawan Digital
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Certificate preview */}
          <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white p-8 rounded-lg border-4 border-yellow-400">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">SERTIFIKAT PRESTASI</h2>
              <p className="text-lg">Achievement Workshop 5 Digital World</p>
              
              <div className="my-6">
                <p className="text-sm mb-2">Diberikan kepada:</p>
                <p className="text-2xl font-bold text-yellow-300">
                  {studentName || '[NAMA SISWA]'}
                </p>
              </div>
              
              <p className="text-sm">
                Sebagai Pahlawan Digital yang telah berhasil menyelesaikan<br />
                Petualangan Kody dengan gemilang!
              </p>
              
              <div className="flex justify-center gap-8 text-sm mt-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>Level: {gameState.completedLevels.length}/6</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>Bintang: {gameState.totalStars}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span>Achievement: {gameState.achievements.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Input form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="studentName">Nama Siswa</Label>
              <Input
                id="studentName"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Masukkan nama siswa..."
                className="mt-1"
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleDownload}
                disabled={!studentName.trim() || isGenerating}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                {isGenerating ? 'Membuat Sertifikat...' : 'Download Sertifikat'}
              </Button>
              <Button variant="outline" onClick={onClose}>
                Tutup
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}