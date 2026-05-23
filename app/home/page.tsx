'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const stats = [
  { label: 'Children', value: '3', change: 'Active today', up: true, icon: '👨‍👩‍👧' },
  { label: 'Lessons done', value: '24', change: '+6 this week', up: true, icon: '📚' },
  { label: 'Screen time', value: '2h 14m', change: '18m less', up: false, icon: '⏱️' },
  { label: 'Rewards earned', value: '47', change: '+12 today', up: true, icon: '⭐' },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const barHeights = [55, 70, 45, 88, 60, 30, 20];

const children = [
  { initials: 'LJ', name: 'Liam', age: 'Age 8 · Grade 3', progress: 82, color: '#dcfce7', text: '#15803d' },
  { initials: 'SJ', name: 'Sofia', age: 'Age 6 · Grade 1', progress: 65, color: '#dbeafe', text: '#1d4ed8' },
  { initials: 'EJ', name: 'Ethan', age: 'Age 11 · Grade 6', progress: 91, color: '#fce7f3', text: '#db2777' },
];

const activities = [
  { text: 'Ethan completed Math Quiz — Level 5', time: '10 minutes ago', color: '#16a34a' },
  { text: 'Liam earned a reading badge', time: '32 minutes ago', color: '#2563eb' },
  { text: 'Sofia started Science: Animals lesson', time: '1 hour ago', color: '#d97706' },
  { text: "Liam's screen time limit reached", time: '2 hours ago', color: '#db2777' },
];

const sessions = [
  { name: 'Math — Fractions', meta: 'Liam · Today', time: '3:00 PM', color: '#dcfce7', text: '#16a34a', icon: '🧮' },
  { name: 'Reading Club', meta: 'Sofia · Tomorrow', time: '10:00 AM', color: '#dbeafe', text: '#2563eb', icon: '📖' },
  { name: 'Science Quiz', meta: 'Ethan · Thu', time: '4:30 PM', color: '#fef3c7', text: '#d97706', icon: '🔬' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/auth/sign-in');
      return;
    }
    setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth/sign-in');
  };

  const firstName = user?.fullName?.split(' ')[0] || 'there';
  const letters = ['K', 'I', 'D', 'S', 'L', '💚', 'X'];

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f0faf4] font-nunito">

      {/* Top bar */}
      <div className="bg-white border-b border-green-100 px-6 py-3 flex items-center justify-between">
        <div className="flex gap-1 items-center">
          {letters.map((l, i) => (
            <span key={i} className="text-lg font-black text-green-600">{l}</span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition">
              🔔
            </button>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div className="w-9 h-9 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-xs font-bold text-green-700">
            {user.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-bold text-red-500 hover:text-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-6">

        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-xl font-black text-gray-800">{getGreeting()}, {firstName}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Here's what's happening with your children today</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-green-100 p-4 shadow-sm">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{s.label}</div>
              <div className="text-xl font-black text-gray-800">{s.value}</div>
              <div className={`text-xs font-semibold mt-1 ${s.up ? 'text-green-600' : 'text-red-500'}`}>
                {s.up ? '↑' : '↓'} {s.change}
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

          {/* Bar chart */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm font-black text-gray-800">Weekly activity</p>
                <p className="text-xs text-gray-400 mt-0.5">Total learning minutes per day</p>
              </div>
              <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">This week</span>
            </div>
            <div className="flex items-end gap-2 h-36">
              {days.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t-lg transition-all ${i === 3 ? 'bg-green-500' : 'bg-green-100 hover:bg-green-300'}`}
                    style={{ height: `${barHeights[i]}%` }}
                  />
                  <span className="text-[10px] text-gray-400 font-semibold">{day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Children */}
          <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-black text-gray-800">Children</p>
              <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">3 active</span>
            </div>
            <div className="flex flex-col gap-3">
              {children.map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-gray-50">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{ background: c.color, color: c.text }}
                  >
                    {c.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-gray-800">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.age}</p>
                  </div>
                  <div className="text-right w-14">
                    <p className="text-xs font-black text-green-600">{c.progress}%</p>
                    <div className="h-1 bg-gray-200 rounded-full mt-1">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Activity */}
          <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
            <p className="text-sm font-black text-gray-800 mb-4">Recent activity</p>
            <div className="flex flex-col gap-4">
              {activities.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: a.color }} />
                  <div>
                    <p className="text-sm text-gray-700">{a.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming sessions */}
          <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
            <p className="text-sm font-black text-gray-800 mb-4">Upcoming sessions</p>
            <div className="flex flex-col gap-3">
              {sessions.map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-xl border border-gray-100">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: s.color }}
                  >
                    {s.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-gray-800">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.meta}</p>
                  </div>
                  <p className="text-xs font-bold text-gray-500">{s.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}