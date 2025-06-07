'use client';

import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useTheme } from '../theme-provider';
import { themes } from '@/lib/themes';
import {
  CalendarPanelProps,
  CalendarEvent,
  NotificationItem,
} from './taskbar-types';
import { ChevronUp, ChevronDown, Copy, Check, X, Info } from 'lucide-react';
import { notificationUtils, copyToClipboard } from '@/lib/notification-utils';
import { useToast } from '@/components/ui/toast';

const CalendarPanel: React.FC<CalendarPanelProps> = ({
  isOpen,
  onClose,
  events = [],
  notifications = [],
  onEventClick = () => {},
  onDateSelect = () => {},
  className = '',
}) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const { addToast } = useToast();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [focusMinutes, setFocusMinutes] = useState(30);
  const [storeNotifications, setStoreNotifications] = useState(
    notificationUtils.getNotifications()
  );

  // Subscribe to notification changes
  useEffect(() => {
    const unsubscribe = notificationUtils.subscribe(() => {
      setStoreNotifications(notificationUtils.getNotifications());
    });
    return unsubscribe;
  }, []);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add days from previous month to fill the first week
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonthDays - i);
      days.push(prevDate);
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    // Add days from next month to fill remaining cells (total 42 days = 6 rows)
    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push(nextDate);
    }

    return days;
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date | null) => {
    if (!date) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date | null) => {
    if (!date) return false;
    return (
      date.getMonth() === currentMonth.getMonth() &&
      date.getFullYear() === currentMonth.getFullYear()
    );
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const days = getDaysInMonth();

  return (
    <>
      {/* Panel Container - Groups both cards */}
      <div
        className="fixed bottom-14 right-2 z-[200] w-80 space-y-2"
        style={{
          visibility: isOpen ? 'visible' : 'hidden',
        }}
      >
        {/* Notifications Card */}
        <div
          className={`rounded-lg backdrop-blur-xl shadow-2xl transition-all duration-300 ease-out ${className}`}
          style={{
            background: currentTheme.glass.background,
            border: `1px solid ${currentTheme.glass.border}`,
            WebkitBackdropFilter: 'blur(30px)',
            transform: isOpen
              ? 'translateX(0)'
              : 'translateX(calc(100% + 1rem))',
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? 'auto' : 'none',
          }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3
                className="text-sm font-medium"
                style={{ color: currentTheme.text.primary }}
              >
                Notifications
              </h3>
            </div>

            <div className="min-h-[60px]">
              {storeNotifications.length === 0 ? (
                <div className="flex items-center justify-center h-[60px]">
                  <p
                    className="text-sm"
                    style={{ color: currentTheme.text.secondary }}
                  >
                    No new notifications
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {storeNotifications.slice(0, 5).map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      theme={currentTheme}
                      onClose={() =>
                        notificationUtils.removeNotification(notification.id)
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Calendar Card */}
        <div
          className="rounded-lg backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-300 ease-out"
          style={{
            background: currentTheme.glass.background,
            border: `1px solid ${currentTheme.glass.border}`,
            WebkitBackdropFilter: 'blur(30px)',
            transform: isOpen
              ? 'translateX(0)'
              : 'translateX(calc(100% + 1rem))',
            opacity: isOpen ? 1 : 0,
            transitionDelay: isOpen ? '100ms' : '0ms',
            pointerEvents: isOpen ? 'auto' : 'none',
          }}
        >
          {/* Date Header */}
          <div
            className="p-4 rounded-t-lg"
            style={{
              background: currentTheme.glass.backgroundDark,
              borderBottom: `1px solid ${currentTheme.divider}`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span
                  className="text-sm font-medium"
                  style={{ color: currentTheme.text.primary }}
                >
                  {moment().format('dddd, MMMM D')}
                </span>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="p-4">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <span
                className="text-sm font-medium"
                style={{ color: currentTheme.text.primary }}
              >
                {monthNames[currentMonth.getMonth()]}{' '}
                {currentMonth.getFullYear()}
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-1 rounded hover:bg-gray-700 transition-colors"
                >
                  <ChevronUp
                    size={12}
                    style={{ color: currentTheme.text.muted }}
                  />
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-1 rounded hover:bg-gray-700 transition-colors"
                >
                  <ChevronDown
                    size={12}
                    style={{ color: currentTheme.text.muted }}
                  />
                </button>
              </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-xs text-center py-1"
                  style={{ color: currentTheme.text.muted }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => (
                <button
                  key={index}
                  onClick={() => date && handleDateClick(date)}
                  disabled={!date}
                  className="h-8 w-8 text-xs rounded-full transition-colors relative flex items-center justify-center"
                  style={{
                    backgroundColor:
                      date && isSelected(date)
                        ? currentTheme.button.backgroundSelected
                        : date && isToday(date)
                        ? currentTheme.button.backgroundActive
                        : currentTheme.button.background,
                    color:
                      date && isSelected(date)
                        ? '#ffffff'
                        : date && isCurrentMonth(date)
                        ? currentTheme.text.primary
                        : currentTheme.text.muted,
                  }}
                  onMouseEnter={(e) => {
                    if (date && !isSelected(date) && !isToday(date)) {
                      e.currentTarget.style.backgroundColor =
                        currentTheme.button.backgroundHover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (date && !isSelected(date) && !isToday(date)) {
                      e.currentTarget.style.backgroundColor =
                        currentTheme.button.background;
                    }
                  }}
                >
                  {date?.getDate()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// NotificationCard component
function NotificationCard({
  notification,
  theme,
  onClose,
}: {
  notification: any;
  theme: any;
  onClose: () => void;
}) {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
      case 'copy':
        return <Check size={14} className="text-green-500" />;
      case 'error':
        return <X size={14} className="text-red-500" />;
      case 'info':
      default:
        return <Info size={14} style={{ color: theme.text.muted }} />;
    }
  };

  return (
    <div
      className="p-3 rounded-md transition-colors duration-200"
      style={{
        backgroundColor: theme.glass.cardBackgroundDark,
        border: `1px solid ${theme.glass.border}`,
      }}
    >
      <div className="flex items-start space-x-2">
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <div
            className="text-xs font-medium"
            style={{ color: theme.text.primary }}
          >
            {notification.title}
          </div>
          {notification.description && (
            <div className="text-xs mt-1" style={{ color: theme.text.muted }}>
              {notification.description}
            </div>
          )}
          <div className="text-xs mt-1" style={{ color: theme.text.muted }}>
            {moment(notification.timestamp).fromNow()}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="flex-shrink-0 p-1 rounded hover:bg-opacity-10 transition-colors"
          style={{ color: theme.text.muted }}
          title="Close notification"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}

export default CalendarPanel;
