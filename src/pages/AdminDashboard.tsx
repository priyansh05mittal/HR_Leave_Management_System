import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LeaveApprovalTable from '../components/LeaveApprovalTable';
import AllAttendanceTable from '../components/AllAttendanceTable';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('leaves');

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-slate-200">
            <div className="flex">
              {['leaves', 'attendance'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-medium text-sm transition ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'leaves' && 'Leave Requests'}
                  {tab === 'attendance' && 'Attendance Records'}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'leaves' && <LeaveApprovalTable />}
            {activeTab === 'attendance' && <AllAttendanceTable />}
          </div>
        </div>
      </main>
    </div>
  );
}
