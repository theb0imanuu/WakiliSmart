import { Link } from 'react-router-dom';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, getDate } from 'date-fns';
import api from '../../utils/api';

const Calendar = () => {
  const [view, setView] = useState('Month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        const month = format(currentDate, 'M');
        const year = format(currentDate, 'yyyy');
        const response = await api.get(`/bookings?month=${month}&year=${year}`);
        setAppointments(response.data);
      } catch (err) {
        setError('Failed to fetch appointments.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [currentDate]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getEventsForDay = (day) => {
    return appointments.filter(app => format(new Date(app.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
  };

  const getEventStyle = (purpose) => {
    const purposeMap = {
      'Court': 'red',
      'Consultation': 'green',
      'Filing Deadline': 'red',
      'Meeting': 'blue',
      'Internal': 'purple',
    };
    const color = purposeMap[purpose] || 'gray';
    const styles = {
      purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      red: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
      green: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
      blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      gray: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600",
    };
    return styles[color];
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark -m-6 lg:-m-8">
      
      {/* 1. Calendar Toolbar */}
      <div className="px-6 py-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 shrink-0 bg-white dark:bg-[#1a202c] border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
            {format(currentDate, 'MMMM yyyy')}
            <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary">expand_more</span>
          </h1>
          <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-1 shadow-sm">
            <button onClick={prevMonth} className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-500"><span className="material-symbols-outlined text-lg">chevron_left</span></button>
            <button onClick={() => setCurrentDate(new Date())} className="px-3 text-sm font-bold text-slate-700 dark:text-white">Today</button>
            <button onClick={nextMonth} className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-500"><span className="material-symbols-outlined text-lg">chevron_right</span></button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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
          <Link to="/dashboard/calendar/new" className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary hover:bg-blue-700 text-white text-sm font-bold shadow-md transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>New Appointment</span>
          </Link>
        </div>
      </div>

      {/* 2. Filter Chips */}
      <div className="px-6 py-3 flex gap-3 overflow-x-auto shrink-0 bg-[#f8f9fc] dark:bg-[#0f131a] border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 self-center">Filter:</span>
        <button className="flex h-7 shrink-0 items-center gap-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 hover:border-primary transition-colors cursor-pointer">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">All Events</span>
        </button>
      </div>

      {/* 3. Calendar Grid */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="h-full bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col shadow-sm">
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-t-xl">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="py-3 text-center text-xs font-bold text-slate-500 uppercase">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 grid-rows-5 flex-1 divide-x divide-y divide-slate-200 dark:divide-slate-700">
            {days.map((day, index) => {
              const dayEvents = getEventsForDay(day);
              return (
                <div 
                  key={index} 
                  className={`p-2 relative group transition-colors min-h-[100px] 
                    ${isSameMonth(day, monthStart) ? 'bg-white dark:bg-[#1a202c] hover:bg-slate-50 dark:hover:bg-slate-800' : 'bg-slate-50/50 dark:bg-slate-900/50'}
                    ${isToday(day) ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}
                  `}
                >
                  <div className="flex justify-end mb-1">
                    <span className={`text-sm font-medium ${
                      isToday(day) 
                        ? 'h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center shadow-sm' 
                        : isSameMonth(day, monthStart) ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'
                    }`}>
                      {getDate(day)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {dayEvents.map(event => (
                      <div 
                        key={event.id} 
                        className={`px-2 py-1 text-xs rounded border truncate font-semibold cursor-pointer hover:opacity-80 transition-opacity ${getEventStyle(event.purpose)}`}
                      >
                        {event.purpose}
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