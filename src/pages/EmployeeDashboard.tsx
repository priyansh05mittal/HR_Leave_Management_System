import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import ApplyLeaveForm from '../components/ApplyLeaveForm';
import LeaveHistory from '../components/LeaveHistory';
import AttendanceHistory from '../components/AttendanceHistory';
import MarkAttendance from '../components/MarkAttendance';

export default function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [leaveBalance, setLeaveBalance] = useState(user?.leaveBalance || 0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/auth/me');
        setLeaveBalance(response.data.user.leaveBalance);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Employee Dashboard</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-slate-600 text-sm font-medium">Leave Balance</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">{leaveBalance}</p>
            <p className="text-slate-500 text-xs mt-2">Days available</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-slate-600 text-sm font-medium">Email</p>
            <p className="text-lg font-semibold text-slate-900 mt-2">{user?.email}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-slate-600 text-sm font-medium">Role</p>
            <p className="text-lg font-semibold text-slate-900 mt-2 capitalize">{user?.role}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-slate-200">
            <div className="flex">
              {['overview', 'apply', 'leaves', 'attendance'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-medium text-sm transition ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'overview' && 'Overview'}
                  {tab === 'apply' && 'Apply Leave'}
                  {tab === 'leaves' && 'Leave History'}
                  {tab === 'attendance' && 'Attendance'}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <p className="text-slate-600">Quick actions and summary view</p>
                <div className="grid grid-cols-2 gap-4">
                  <MarkAttendance />
                </div>
              </div>
            )}
            {activeTab === 'apply' && <ApplyLeaveForm onSuccess={() => {
              setActiveTab('leaves');
              setTimeout(() => {
                const fetchUserData = async () => {
                  const response = await api.get('/auth/me');
                  setLeaveBalance(response.data.user.leaveBalance);
                };
                fetchUserData();
              }, 500);
            }} />}
            {activeTab === 'leaves' && <LeaveHistory />}
            {activeTab === 'attendance' && <AttendanceHistory />}
          </div>
        </div>
      </main>
    </div>
  );
}
