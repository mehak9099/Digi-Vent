import React from 'react';
import { AlertTriangle, Database, Zap } from 'lucide-react';

interface DemoModeIndicatorProps {
  isVisible?: boolean;
}

const DemoModeIndicator: React.FC<DemoModeIndicatorProps> = ({ isVisible = true }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-3 rounded-lg shadow-lg border border-yellow-300">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5" />
          <div>
            <p className="font-semibold text-sm">Demo Mode Active</p>
            <p className="text-xs opacity-90">Using mock data - Connect Supabase for full features</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoModeIndicator;