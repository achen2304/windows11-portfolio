'use client';

import React, { useCallback, useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TaskbarApp, PanelType } from './taskbar-types';
import { startPanelApps, quickLinks } from '@/data/apps/taskbar-pannel-apps';
import Taskbar from './taskbar';
import StartPanel from './taskbar-pannel';
import CalendarPanel from './calendar-pannel';
import SystemPanel from './system pannel/system-panel';

interface TaskbarShellProps {
  apps?: TaskbarApp[];
  onAppClick?: (appId: string) => void;
  className?: string;
}

// Create a wrapped version that uses searchParams inside Suspense
const TaskbarShellContent: React.FC<TaskbarShellProps> = ({
  apps = [],
  onAppClick = () => {},
  className = '',
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activePanels, setActivePanels] = useState<Set<PanelType>>(new Set());

  // Get active panel from URL params
  const activePanelParam = searchParams.get('panel');
  const activePanel: PanelType =
    activePanelParam &&
    ['start', 'system', 'calendar', 'notifications'].includes(activePanelParam)
      ? (activePanelParam as PanelType)
      : null;

  // Update activePanels set when URL changes
  useEffect(() => {
    if (activePanel && ['start', 'system', 'calendar'].includes(activePanel)) {
      setActivePanels(new Set([activePanel]));
    } else {
      setActivePanels(new Set());
    }
  }, [activePanel]);

  // Panel management functions
  const openPanel = useCallback(
    (panelType: Exclude<PanelType, null>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('panel', panelType);
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const closePanel = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('panel');
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const togglePanel = useCallback(
    (panelType: Exclude<PanelType, null>) => {
      if (activePanel === panelType) {
        closePanel();
      } else {
        openPanel(panelType);
      }
    },
    [activePanel, openPanel, closePanel]
  );

  // Event handlers
  const handleStartClick = useCallback(() => {
    togglePanel('start');
  }, [togglePanel, activePanel]);

  const handleSystemTrayClick = useCallback(() => {
    togglePanel('system');
  }, [togglePanel, activePanel]);

  const handleDateTimeClick = useCallback(() => {
    togglePanel('calendar');
  }, [togglePanel, activePanel]);

  const handleAppClick = useCallback(
    (appId: string) => {
      // Close any open panels when clicking an app
      closePanel();
      onAppClick(appId);
    },
    [closePanel, onAppClick]
  );

  return (
    <>
      {/* Centralized Backdrop - Only show when any panel is open */}
      {activePanel && (
        <div
          className="fixed inset-0 z-[150]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            closePanel();
          }}
          style={{
            pointerEvents: 'auto',
            background: 'transparent', // Invisible backdrop
          }}
        />
      )}

      {/* Main Taskbar */}
      <Taskbar
        apps={apps}
        onAppClick={handleAppClick}
        onStartClick={handleStartClick}
        onSystemTrayClick={handleSystemTrayClick}
        onDateTimeClick={handleDateTimeClick}
        activePanels={activePanels}
        className={className}
      />

      {/* Start Panel */}
      <StartPanel
        isOpen={activePanel === 'start'}
        onClose={closePanel}
        apps={startPanelApps}
        quickLinks={quickLinks}
        onAppClick={handleAppClick}
      />

      {/* System Panel */}
      <SystemPanel isOpen={activePanel === 'system'} onClose={closePanel} />

      {/* Calendar Panel */}
      <CalendarPanel isOpen={activePanel === 'calendar'} onClose={closePanel} />
    </>
  );
};

// Main component wrapped in Suspense
const TaskbarShell: React.FC<TaskbarShellProps> = (props) => {
  return (
    <Suspense
      fallback={
        <div className="fixed bottom-0 left-0 right-0 z-[300] h-12 bg-black/70"></div>
      }
    >
      <TaskbarShellContent {...props} />
    </Suspense>
  );
};

export default TaskbarShell;
