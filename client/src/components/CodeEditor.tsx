import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, RotateCcw } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { LevelData } from "@shared/schema";

interface CodeEditorProps {
  level: LevelData;
  onComplete: (stars: number) => void;
}

interface PythonExecutionResult {
  output: string;
  kodyResponse: string;
  success: boolean;
}

export default function CodeEditor({ level, onComplete }: CodeEditorProps) {
  const [code, setCode] = useState(getDefaultCode(level.id));
  const [output, setOutput] = useState("# Output akan muncul di sini setelah menjalankan kode");
  const [kodyResponse, setKodyResponse] = useState("Menunggu instruksi...");
  const [kodyResponseClass, setKodyResponseClass] = useState("text-gray-700");

  const executePython = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest("POST", "/api/execute-python", { code });
      return response.json() as Promise<PythonExecutionResult>;
    },
    onSuccess: (result) => {
      setOutput(result.output);
      setKodyResponse(result.kodyResponse);
      setKodyResponseClass(result.success ? "text-green-600 font-semibold" : "text-gray-600");
      
      if (result.success) {
        setTimeout(() => {
          onComplete(3); // Award 3 stars for successful code execution
        }, 1500);
      }
    },
    onError: (error) => {
      setOutput("Error: " + error.message);
      setKodyResponse("🤖 Terjadi kesalahan. Coba lagi ya!");
      setKodyResponseClass("text-red-600");
    }
  });

  const handleRun = () => {
    executePython.mutate(code);
  };

  const handleReset = () => {
    setCode(getDefaultCode(level.id));
    setOutput("# Output akan muncul di sini setelah menjalankan kode");
    setKodyResponse("Menunggu instruksi...");
    setKodyResponseClass("text-gray-700");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">🐍 Editor Python Kody</h3>
        <p className="text-gray-600">Tulis kode Python untuk mengontrol Kody!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Tulis Kode Python:</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm">
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 bg-transparent text-green-400 resize-none outline-none border-none focus:ring-0 font-mono"
                placeholder="# Ketik kode Python di sini untuk mengontrol Kody"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleRun}
                disabled={executePython.isPending}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                {executePython.isPending ? "Menjalankan..." : "Jalankan Kode"}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Display */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Hasil Output:</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-100 rounded-xl p-4 min-h-[200px]">
              <div className="font-mono text-sm text-gray-800 whitespace-pre-wrap">
                {output}
              </div>
            </div>

            {/* Virtual Kody Response */}
            <Card className="bg-green-50 border-2 border-green-200">
              <CardContent className="pt-4">
                <h4 className="font-semibold text-green-600 mb-2">🤖 Respons Kody:</h4>
                <div className={kodyResponseClass}>
                  {kodyResponse}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="bg-blue-50 border-2 border-blue-200">
        <CardContent className="pt-4">
          <h4 className="font-semibold text-blue-600 mb-2">💡 Petunjuk:</h4>
          <div className="text-sm text-gray-700">
            {getInstructions(level.id)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getDefaultCode(levelId: number): string {
  switch (levelId) {
    case 2:
      return `# Ketik kode Python di sini untuk mengontrol Kody
power = "on"
if power == "on":
    print("Kody aktif!")
else:
    print("Kody tidur...")`;
    case 5:
      return `# Kontrol pergerakan Kody
move = "maju"
if move == "maju":
    print("Kody jalan!")
else:
    print("Kody berhenti...")`;
    default:
      return `# Ketik kode Python di sini
print("Hello, Kody!")`;
  }
}

function getInstructions(levelId: number): string {
  switch (levelId) {
    case 2:
      return "Gunakan variabel 'power' dengan nilai 'on', lalu buat kondisi if-else untuk mengecek status power. Jangan lupa print pesan yang sesuai!";
    case 5:
      return "Gunakan variabel 'move' dengan nilai 'maju', lalu buat kondisi if-else untuk mengontrol gerakan Kody.";
    default:
      return "Ikuti petunjuk untuk menyelesaikan tantangan coding ini!";
  }
}
