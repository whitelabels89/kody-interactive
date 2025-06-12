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
          body { 
            margin: 0; padding: 0; overflow: hidden; 
            background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%); 
            font-family: 'Comic Sans MS', Arial, sans-serif; 
            user-select: none;
          }
          #gameCanvas { display: block; outline: none; }
          #instructions { 
            position: absolute; top: 20px; left: 20px; color: #ffffff; 
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4); 
            padding: 15px; border-radius: 20px;
            font-size: 14px; z-index: 100; font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            border: 3px solid #ffffff;
          }
          #score { 
            position: absolute; top: 20px; right: 20px; color: #ffffff; 
            background: linear-gradient(45deg, #ffeaa7, #fab1a0); 
            padding: 15px; border-radius: 20px;
            font-size: 18px; font-weight: bold; z-index: 100;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            border: 3px solid #ffffff;
          }
          .emoji { font-size: 20px; }
        </style>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
      </head>
      <body>
        <div id="instructions">
          <span class="emoji">🤖</span> <strong>Petualangan Kody di Dunia 3D!</strong><br>
          <span class="emoji">🎮</span> Gunakan ↑↓←→ atau WASD<br>
          <span class="emoji">💎</span> Kumpulkan semua kristal ajaib!
        </div>
        <div id="score"><span class="emoji">🌟</span> Kristal: <span id="scoreValue">0</span>/8</div>
        
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
            
            // Bright, colorful lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffff88, 1.0);
            directionalLight.position.set(50, 100, 50);
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = 2048;
            directionalLight.shadow.mapSize.height = 2048;
            scene.add(directionalLight);
            
            // Rainbow colored ground
            const groundGeometry = new THREE.PlaneGeometry(100, 100);
            const groundMaterial = new THREE.MeshLambertMaterial({ 
              color: 0x90EE90,
              transparent: true,
              opacity: 0.9
            });
            const ground = new THREE.Mesh(groundGeometry, groundMaterial);
            ground.rotation.x = -Math.PI / 2;
            ground.receiveShadow = true;
            scene.add(ground);
            
            // Colorful grid pattern
            const gridHelper = new THREE.GridHelper(100, 20, 0xff69b4, 0x87ceeb);
            scene.add(gridHelper);
            
            // Create colorful Kody robot
            const robotGeometry = new THREE.BoxGeometry(2, 3, 2);
            const robotMaterial = new THREE.MeshLambertMaterial({ color: 0xff69b4 }); // Hot pink
            robot = new THREE.Mesh(robotGeometry, robotMaterial);
            robot.position.set(0, 1.5, 0);
            robot.castShadow = true;
            scene.add(robot);
            
            // Happy robot eyes
            const eyeGeometry = new THREE.SphereGeometry(0.3, 8, 8);
            const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00 }); // Bright yellow
            const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            leftEye.position.set(-0.4, 0.5, 1.1);
            rightEye.position.set(0.4, 0.5, 1.1);
            robot.add(leftEye);
            robot.add(rightEye);
            
            // Robot smile
            const smileGeometry = new THREE.TorusGeometry(0.4, 0.1, 8, 16, Math.PI);
            const smileMaterial = new THREE.MeshLambertMaterial({ color: 0x32cd32 }); // Lime green
            const smile = new THREE.Mesh(smileGeometry, smileMaterial);
            smile.position.set(0, 0, 1.1);
            smile.rotation.z = Math.PI;
            robot.add(smile);
            
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
            
            const colors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0xf9ca24, 0xf0932b, 0xeb4d4b, 0x6c5ce7, 0xa29bfe];
            wallPositions.forEach((pos, index) => {
              const wallGeometry = new THREE.BoxGeometry(4, 8, 4);
              const wallMaterial = new THREE.MeshLambertMaterial({ 
                color: colors[index % colors.length],
                transparent: true,
                opacity: 0.9
              });
              const wall = new THREE.Mesh(wallGeometry, wallMaterial);
              wall.position.set(pos[0], 4, pos[2]);
              wall.castShadow = true;
              scene.add(wall);
              walls.push(wall);
              
              // Add sparkle effect
              const sparkleGeometry = new THREE.BoxGeometry(4.2, 8.2, 4.2);
              const sparkleMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xffffff,
                transparent: true,
                opacity: 0.3
              });
              const sparkle = new THREE.Mesh(sparkleGeometry, sparkleMaterial);
              sparkle.position.copy(wall.position);
              scene.add(sparkle);
            });
          }
          
          function createCrystals() {
            const crystalPositions = [
              [10, 1, 10], [-10, 1, 10], [10, 1, -10], [-10, 1, -10],
              [15, 1, 0], [-15, 1, 0], [0, 1, 15], [0, 1, -15]
            ];
            
            const crystalColors = [0xff1493, 0x00ff7f, 0x1e90ff, 0xffd700, 0xff69b4, 0x32cd32, 0xff6347, 0x9370db];
            crystalPositions.forEach((pos, index) => {
              const crystalGeometry = new THREE.OctahedronGeometry(1.2);
              const crystalMaterial = new THREE.MeshLambertMaterial({ 
                color: crystalColors[index % crystalColors.length],
                transparent: true,
                opacity: 0.9
              });
              const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
              crystal.position.set(pos[0], pos[1] + 2, pos[2]);
              crystal.userData = { collected: false, originalY: pos[1] + 2 };
              scene.add(crystal);
              crystals.push(crystal);
            });
          }
          
          function onKeyDown(event) {
            // Prevent default behavior for arrow keys to stop page scrolling
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
              event.preventDefault();
            }
            
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
            // Prevent default behavior for arrow keys to stop page scrolling
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
              event.preventDefault();
            }
            
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
            
            // Animate crystals with floating and rotation
            crystals.forEach((crystal, index) => {
              if (!crystal.userData.collected) {
                crystal.rotation.y += 0.03;
                crystal.rotation.x += 0.01;
                // Different floating speeds for each crystal
                const time = Date.now() * 0.002;
                crystal.position.y = crystal.userData.originalY + Math.sin(time + index) * 0.5;
                
                // Add subtle scale pulsing
                const scale = 1 + Math.sin(time * 2 + index) * 0.1;
                crystal.scale.set(scale, scale, scale);
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