interface ProgressBarProps {
  percentage: number;
  currentLevel: number;
  totalLevels: number;
}

export default function ProgressBar({ percentage, currentLevel, totalLevels }: ProgressBarProps) {
  return (
    <div className="flex justify-center items-center space-x-4">
      <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-3 rounded-full flex-1 max-w-md overflow-hidden">
        <div 
          className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-lg font-bold text-gray-600">
        Level {currentLevel}/{totalLevels}
      </span>
    </div>
  );
}
