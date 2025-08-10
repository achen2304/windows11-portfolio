'use client';

import React, { useCallback, useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TaskbarApp, PanelType } from './taskbar-types';
import {
  startPanelApps,
  quickLinks,
} from '@/components/webpage/apps/taskbar-pannel-apps';
import Taskbar from './taskbar';
import StartPanel from './taskbar-pannel';
import CalendarPanel from './calendar-pannel';
import SystemPanel from './system pannel/system-panel';
import SoundboardPanel from './soundboard-pannel';

interface TaskbarShellProps {
  apps?: TaskbarApp[];
  onAppClick?: (appId: string) => void;
  className?: string;
}

const TaskbarShellContent: React.FC<TaskbarShellProps> = ({
  apps = [],
  onAppClick = () => {},
  className = '',
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activePanels, setActivePanels] = useState<Set<PanelType>>(new Set());

  const activePanelParam = searchParams.get('panel');
  const activePanel: PanelType =
    activePanelParam &&
    ['start', 'system', 'calendar', 'soundboard', 'notifications'].includes(
      activePanelParam
    )
      ? (activePanelParam as PanelType)
      : null;

  useEffect(() => {
    if (
      activePanel &&
      ['start', 'system', 'calendar', 'soundboard'].includes(activePanel)
    ) {
      setActivePanels(new Set([activePanel]));
    } else {
      setActivePanels(new Set());
    }
  }, [activePanel]);

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

  const handleStartClick = useCallback(() => {
    togglePanel('start');
  }, [togglePanel]);

  const handleSystemTrayClick = useCallback(() => {
    togglePanel('system');
  }, [togglePanel]);

  const handleDateTimeClick = useCallback(() => {
    togglePanel('calendar');
  }, [togglePanel]);

  const handleSoundboardClick = useCallback(() => {
    togglePanel('soundboard');
  }, [togglePanel]);

  const handleAppClick = useCallback(
    (appId: string) => {
      closePanel();
      onAppClick(appId);
    },
    [closePanel, onAppClick]
  );

  return (
    <>
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
            background: 'transparent',
          }}
        />
      )}

      <Taskbar
        apps={apps}
        onAppClick={handleAppClick}
        onStartClick={handleStartClick}
        onSystemTrayClick={handleSystemTrayClick}
        onDateTimeClick={handleDateTimeClick}
        onSoundboardClick={handleSoundboardClick}
        activePanels={activePanels}
        className={className}
      />

      <StartPanel
        isOpen={activePanel === 'start'}
        onClose={closePanel}
        apps={startPanelApps}
        quickLinks={quickLinks}
        onAppClick={handleAppClick}
      />

      <SystemPanel isOpen={activePanel === 'system'} onClose={closePanel} />

      <CalendarPanel isOpen={activePanel === 'calendar'} onClose={closePanel} />

      <SoundboardPanel
        isOpen={activePanel === 'soundboard'}
        onClose={closePanel}
      />
    </>
  );
};

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
