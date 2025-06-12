import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Gamepad2, Keyboard } from "lucide-react";
import type { LevelData } from "@shared/schema";

interface ThreeDGameActivityProps {
  level: LevelData;
  onComplete: (stars: number) => void;
}

export default function ThreeDGameActivity({ level, onComplete }: ThreeDGameActivityProps) {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [gameLoaded, setGameLoaded] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [gameScore, setGameScore] = useState(0);

  useEffect(() => {
    if (gameContainerRef.current && !gameLoaded) {
      initializeThreeJSGame();
      setGameLoaded(true);
    }
  }, [gameLoaded]);

  const initializeThreeJSGame = () => {
    if (!gameContainerRef.current) return;

    const gameHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { margin: 0; padding: 0; overflow: hidden; background: #001122; font-family: Arial, sans-serif; }
          #gameCanvas { display: block; }
          #instructions { 
            position: absolute; top: 20px; left: 20px; color: #00ffff; 
            background: rgba(0,0,0,0.8); padding: 15px; border-radius: 10px;
            font-size: 14px; z-index: 100;
          }
          #score { 
            position: absolute; top: 20px; right: 20px; color: #ffff00; 
            background: rgba(0,0,0,0.8); padding: 15px; border-radius: 10px;
            font-size: 16px; font-weight: bold; z-index: 100;
          }
        </style>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
      </head>
      <body>
        <div id="instructions">
          🎮 <strong>Kontrol Kody Robot</strong><br>
          ↑ ↓ ← → atau WASD untuk bergerak<br>
          Kumpulkan kristal biru untuk skor!<br>
          Kompatibel dengan Makey Makey
        </div>
        <div id="score">Skor: <span id="scoreValue">0</span></div>
        
        <script>
          // Game variables
          let scene, camera, renderer, robot, crystals = [], walls = [];
          let keys = { up: false, down: false, left: false, right: false };
          let score = 0;
          let gameCompleted = false;

          // Initialize Three.js scene
          function init() {
            // Scene setup
            scene = new THREE.Scene();
            scene.fog = new THREE.Fog(0x001122, 50, 200);
            
            // Camera setup (third-person)
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 15, 20);
            camera.lookAt(0, 0, 0);
            
            // Renderer setup
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x001122);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            document.body.appendChild(renderer.domElement);
            
            // Lighting
            const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(50, 100, 50);
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = 2048;
            directionalLight.shadow.mapSize.height = 2048;
            scene.add(directionalLight);
            
            // Ground
            const groundGeometry = new THREE.PlaneGeometry(100, 100);
            const groundMaterial = new THREE.MeshLambertMaterial({ 
              color: 0x002244,
              transparent: true,
              opacity: 0.8
            });
            const ground = new THREE.Mesh(groundGeometry, groundMaterial);
            ground.rotation.x = -Math.PI / 2;
            ground.receiveShadow = true;
            scene.add(ground);
            
            // Grid pattern for futuristic look
            const gridHelper = new THREE.GridHelper(100, 20, 0x00ffff, 0x004466);
            scene.add(gridHelper);
            
            // Create robot (simple box character)
            const robotGeometry = new THREE.BoxGeometry(2, 3, 2);
            const robotMaterial = new THREE.MeshLambertMaterial({ color: 0xff6600 });
            robot = new THREE.Mesh(robotGeometry, robotMaterial);
            robot.position.set(0, 1.5, 0);
            robot.castShadow = true;
            scene.add(robot);
            
            // Robot eyes
            const eyeGeometry = new THREE.SphereGeometry(0.2, 8, 8);
            const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0x00ffff });
            const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            leftEye.position.set(-0.4, 0.5, 1.1);
            rightEye.position.set(0.4, 0.5, 1.1);
            robot.add(leftEye);
            robot.add(rightEye);
            
            // Create walls (city buildings)
            createWalls();
            
            // Create collectible crystals
            createCrystals();
            
            // Event listeners for controls (Makey Makey compatible)
            document.addEventListener('keydown', onKeyDown);
            document.addEventListener('keyup', onKeyUp);
            
            // Start game loop
            animate();
          }
          
          function createWalls() {
            const wallPositions = [
              [-20, 0, -20], [20, 0, -20], [-20, 0, 20], [20, 0, 20],
              [0, 0, -30], [0, 0, 30], [-30, 0, 0], [30, 0, 0]
            ];
            
            wallPositions.forEach(pos => {
              const wallGeometry = new THREE.BoxGeometry(4, 8, 4);
              const wallMaterial = new THREE.MeshLambertMaterial({ 
                color: 0x333366,
                transparent: true,
                opacity: 0.8
              });
              const wall = new THREE.Mesh(wallGeometry, wallMaterial);
              wall.position.set(pos[0], 4, pos[2]);
              wall.castShadow = true;
              scene.add(wall);
              walls.push(wall);
              
              // Add glowing effect
              const glowGeometry = new THREE.BoxGeometry(4.5, 8.5, 4.5);
              const glowMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x0066ff,
                transparent: true,
                opacity: 0.2
              });
              const glow = new THREE.Mesh(glowGeometry, glowMaterial);
              glow.position.copy(wall.position);
              scene.add(glow);
            });
          }
          
          function createCrystals() {
            const crystalPositions = [
              [10, 1, 10], [-10, 1, 10], [10, 1, -10], [-10, 1, -10],
              [15, 1, 0], [-15, 1, 0], [0, 1, 15], [0, 1, -15]
            ];
            
            crystalPositions.forEach(pos => {
              const crystalGeometry = new THREE.OctahedronGeometry(1);
              const crystalMaterial = new THREE.MeshLambertMaterial({ 
                color: 0x00ffff,
                transparent: true,
                opacity: 0.8
              });
              const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
              crystal.position.set(pos[0], pos[1], pos[2]);
              crystal.userData = { collected: false };
              scene.add(crystal);
              crystals.push(crystal);
            });
          }
          
          function onKeyDown(event) {
            switch(event.code) {
              case 'ArrowUp':
              case 'KeyW':
                keys.up = true;
                break;
              case 'ArrowDown':
              case 'KeyS':
                keys.down = true;
                break;
              case 'ArrowLeft':
              case 'KeyA':
                keys.left = true;
                break;
              case 'ArrowRight':
              case 'KeyD':
                keys.right = true;
                break;
            }
          }
          
          function onKeyUp(event) {
            switch(event.code) {
              case 'ArrowUp':
              case 'KeyW':
                keys.up = false;
                break;
              case 'ArrowDown':
              case 'KeyS':
                keys.down = false;
                break;
              case 'ArrowLeft':
              case 'KeyA':
                keys.left = false;
                break;
              case 'ArrowRight':
              case 'KeyD':
                keys.right = false;
                break;
            }
          }
          
          function updateRobot() {
            const speed = 0.3;
            
            if (keys.up) {
              robot.position.z -= speed;
              robot.rotation.y = 0;
            }
            if (keys.down) {
              robot.position.z += speed;
              robot.rotation.y = Math.PI;
            }
            if (keys.left) {
              robot.position.x -= speed;
              robot.rotation.y = Math.PI / 2;
            }
            if (keys.right) {
              robot.position.x += speed;
              robot.rotation.y = -Math.PI / 2;
            }
            
            // Keep robot in bounds
            robot.position.x = Math.max(-40, Math.min(40, robot.position.x));
            robot.position.z = Math.max(-40, Math.min(40, robot.position.z));
            
            // Update camera to follow robot (third-person)
            camera.position.x = robot.position.x;
            camera.position.z = robot.position.z + 20;
            camera.lookAt(robot.position.x, robot.position.y, robot.position.z);
          }
          
          function checkCollisions() {
            crystals.forEach(crystal => {
              if (!crystal.userData.collected) {
                const distance = robot.position.distanceTo(crystal.position);
                if (distance < 2) {
                  crystal.userData.collected = true;
                  crystal.visible = false;
                  score += 10;
                  document.getElementById('scoreValue').textContent = score;
                  
                  // Check if all crystals collected
                  if (crystals.every(c => c.userData.collected)) {
                    if (!gameCompleted) {
                      gameCompleted = true;
                      setTimeout(() => {
                        alert('🎉 Kody berhasil mengumpulkan semua kristal! Game selesai!');
                        // Send completion to parent
                        window.parent.postMessage({ type: 'gameComplete', score: score }, '*');
                      }, 500);
                    }
                  }
                }
              }
            });
          }
          
          function animate() {
            requestAnimationFrame(animate);
            
            updateRobot();
            checkCollisions();
            
            // Rotate crystals for visual effect
            crystals.forEach(crystal => {
              if (!crystal.userData.collected) {
                crystal.rotation.y += 0.02;
                crystal.position.y = 1 + Math.sin(Date.now() * 0.003 + crystal.position.x) * 0.2;
              }
            });
            
            renderer.render(scene, camera);
          }
          
          // Handle window resize
          window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
          });
          
          // Initialize game
          init();
        </script>
      </body>
      </html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '400px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '12px';
    iframe.srcdoc = gameHTML;
    
    // Listen for game completion
    window.addEventListener('message', (event) => {
      if (event.data.type === 'gameComplete') {
        setGameScore(event.data.score);
        setIsCompleted(true);
      }
    });

    gameContainerRef.current.appendChild(iframe);
  };

  const handleComplete = () => {
    const stars = gameScore >= 80 ? 3 : gameScore >= 50 ? 2 : 1;
    onComplete(stars);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">🎮 Dunia Robotron 3D</h3>
        <p className="text-gray-600">Kontrol robot Kody di dunia 3D futuristik! Kumpulkan kristal untuk menyelesaikan misi!</p>
      </div>

      {/* Game Instructions */}
      <Card className="hover-lift rainbow-border">
        <CardHeader>
          <CardTitle className="text-xl flex items-center animate-text-wave">
            <Gamepad2 className="w-5 h-5 mr-2 animate-bounce-slow" />
            Instruksi Permainan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Keyboard className="w-5 h-5 text-blue-500" />
                <span className="font-semibold">Kontrol:</span>
              </div>
              <div className="ml-8 space-y-2 text-sm">
                <div>↑ ↓ ← → atau WASD untuk bergerak</div>
                <div>🎯 Kompatibel dengan Makey Makey</div>
                <div>🔷 Kumpulkan kristal biru untuk skor</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-cyan-500 rounded-full animate-pulse"></div>
                <span className="font-semibold">Misi:</span>
              </div>
              <div className="ml-8 space-y-2 text-sm">
                <div>🤖 Kontrol robot Kody (kotak oranye)</div>
                <div>💎 Kumpulkan semua kristal (8 total)</div>
                <div>🏆 Dapatkan skor tinggi untuk bintang 3</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Container */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            🌌 Arena Robotron 3D
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            ref={gameContainerRef}
            className="w-full h-[400px] bg-gradient-to-br from-blue-900 to-indigo-900 rounded-lg flex items-center justify-center"
          >
            {!gameLoaded && (
              <div className="text-center text-white">
                <div className="animate-spin w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Memuat dunia 3D...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Completion Section */}
      {isCompleted && (
        <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-300 hover-lift">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl mb-4 animate-bounce">🎉</div>
              <h4 className="text-2xl font-bold text-green-700 mb-2">Misi Berhasil!</h4>
              <p className="text-lg text-green-600 mb-4">
                Kody telah menyelesaikan petualangan 3D! Skor: {gameScore}
              </p>
              
              <Button 
                onClick={handleComplete}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold interactive-btn hover-lift animate-heartbeat"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Selesaikan Petualangan! 🚀
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technical Info */}
      <Card className="bg-blue-50 border-2 border-blue-200">
        <CardContent className="pt-4">
          <h4 className="font-semibold text-blue-600 mb-2">💡 Info Teknis:</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <div>• Game menggunakan Three.js untuk rendering 3D real-time</div>
            <div>• Kontrol dirancang kompatibel dengan Makey Makey hardware</div>
            <div>• Kamera third-person mengikuti robot secara otomatis</div>
            <div>• Sistem scoring untuk evaluasi performa</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}