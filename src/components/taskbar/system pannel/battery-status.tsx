'use client';

import { BatteryMedium, BatteryCharging } from 'lucide-react';
import { BatteryInfo } from '../taskbar-types';
interface ThemeObject {
  text: {
    primary: string;
    secondary: string;
  };
  glass: {
    background: string;
    backgroundDark: string;
  };
}

interface BatteryStatusProps {
  batteryInfo: BatteryInfo;
  currentTheme: ThemeObject;
}

const BatteryStatus = ({ batteryInfo, currentTheme }: BatteryStatusProps) => {
  return (
    <div
      className="px-4 py-2"
      style={{ background: currentTheme.glass.backgroundDark }}
    >
      <div className="flex items-center py-2">
        <div className="flex items-center space-x-3">
          {batteryInfo.isCharging ? (
            <BatteryCharging
              size={18}
              style={{
                color: currentTheme.text.primary,
                opacity: 0.8,
              }}
            />
          ) : (
            <BatteryMedium
              size={18}
              style={{
                color: currentTheme.text.primary,
                opacity: 0.8,
              }}
            />
          )}
          <span
            className="text-xs font-medium"
            style={{
              color: currentTheme.text.primary,
            }}
          >
            {batteryInfo.percentage}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default BatteryStatus;
