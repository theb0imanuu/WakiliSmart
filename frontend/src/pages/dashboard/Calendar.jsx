import React, { useState } from 'react';

const Calendar = () => {
  const [view, setView] = useState('Month');

  // Mock Events Data
  const events = [
    { id: 1, day: 2, title: "09:00 Staff Mtg", type: "internal", color: "purple" },
    { id: 2, day: 4, title: "Court: Case #902", type: "court", color: "red" },
    { id: 3, day: 7, title: "Consult: J. Doe", type: "consult", color: "green" },
    { id: 4, day: 9, title: "10:00 Consult", type: "consult", color: "green" },
    { id: 5, day: 9, title: "14:00 Briefing", type: "internal", color: "blue" },
    { id: 6, day: 11, title: "Filing Deadline", type: "urgent", color: "red" },
    { id: 7, day: 16, title: "Consult: M. Smith", type: "consult", color: "green" },
    { id: 8, day: 23, title: "Court: Case #411", type: "court", color: "red" },
    { id: 9, day: 29, title: "Doc Review", type: "internal", color: "blue" },
  ];

  // Helper to get events for a specific day
  const getEventsForDay = (day) => events.filter(e => e.day === day);

  // Helper for event styling
  const getEventStyle = (color) => {
    const styles = {
      purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      red: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
      green: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
      blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    };
    return styles[color] || styles.blue;
  };

  // Generate Calendar Grid Days (Mocking Oct 2023 structure from design)
  // 30, 29 (prev month) -> 1..31 (current) -> 1, 2 (next)
  const days = [];
  // Prev month filler
  days.push({ num: 29, current: false });
  days.push({ num: 30, current: false });
  // Current month
  for (let i = 1; i <= 31; i++) {
    days.push({ num: i, current: true });
  }
  // Next month filler
  days.push({ num: 1, current: false });
  days.push({ num: 2, current: false });

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark -m-6 lg:-m-8">
      
      {/* 1. Calendar Toolbar */}
      <div className="px-6 py-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 shrink-0 bg-white dark:bg-[#1a202c] border-b border-slate-200 dark:border-slate-800">
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
            October 2023 
            <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary">expand_more</span>
          </h1>
          <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-1 shadow-sm">
            <button className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-500"><span className="material-symbols-outlined text-lg">chevron_left</span></button>
            <button className="px-3 text-sm font-bold text-slate-700 dark:text-white">Today</button>
            <button className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-500"><span className="material-symbols-outlined text-lg">chevron_right</span></button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Switcher */}
          <div className="flex h-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
            {['Month', 'Week', 'Day'].map((v) => (
              <button 
                key={v}
                onClick={() => setView(v)}
                className={`h-full px-4 rounded-md flex items-center justify-center text-sm font-medium transition-all ${view === v ? 'bg-white dark:bg-[#111621] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
              >
                {v}
              </button>
            ))}
          </div>
          
          {/* New Event Button */}
          <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary hover:bg-blue-700 text-white text-sm font-bold shadow-md transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Chips (Optional but helpful) */}
      <div className="px-6 py-3 flex gap-3 overflow-x-auto shrink-0 bg-[#f8f9fc] dark:bg-[#0f131a] border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 self-center">Filter:</span>
        <button className="flex h-7 shrink-0 items-center gap-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 hover:border-primary transition-colors cursor-pointer">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">All Events</span>
        </button>
        <button className="flex h-7 shrink-0 items-center gap-2 rounded-full bg-transparent border border-transparent px-3 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Court</span>
        </button>
        <button className="flex h-7 shrink-0 items-center gap-2 rounded-full bg-transparent border border-transparent px-3 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Consultation</span>
        </button>
      </div>

      {/* 3. Calendar Grid */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="h-full bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col shadow-sm">
          
          {/* Weekday Header */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-t-xl">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="py-3 text-center text-xs font-bold text-slate-500 uppercase">{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 grid-rows-5 flex-1 divide-x divide-y divide-slate-200 dark:divide-slate-700">
            {days.map((day, index) => {
              const dayEvents = day.current ? getEventsForDay(day.num) : [];
              const isToday = day.num === 9 && day.current; // Mocking "Today" as the 9th

              return (
                <div 
                  key={index} 
                  className={`p-2 relative group transition-colors min-h-[100px] 
                    ${day.current ? 'bg-white dark:bg-[#1a202c] hover:bg-slate-50 dark:hover:bg-slate-800' : 'bg-slate-50/50 dark:bg-slate-900/50'}
                    ${isToday ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}
                  `}
                >
                  {/* Date Number */}
                  <div className="flex justify-end mb-1">
                    <span className={`text-sm font-medium ${
                      isToday 
                        ? 'h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center shadow-sm' 
                        : day.current ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'
                    }`}>
                      {day.num}
                    </span>
                  </div>

                  {/* Events List */}
                  <div className="flex flex-col gap-1">
                    {dayEvents.map(event => (
                      <div 
                        key={event.id} 
                        className={`px-2 py-1 text-xs rounded border truncate font-semibold cursor-pointer hover:opacity-80 transition-opacity ${getEventStyle(event.color)}`}
                      >
                        {event.color === 'red' && <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mr-1"></span>}
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

    </div>
  );
};

export default Calendar;