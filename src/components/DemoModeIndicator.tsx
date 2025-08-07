import React from 'react';

interface DemoModeIndicatorProps {
  isVisible?: boolean;
}

const DemoModeIndicator: React.FC<DemoModeIndicatorProps> = ({ isVisible = false }) => {
  // Always return null to hide the banner completely
  return null;
};

export default DemoModeIndicator;