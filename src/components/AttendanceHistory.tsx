import React, { useState, useEffect } from 'react';
import api from '../utils/api';

interface Attendance {
  _id: string;
  date: string;
  status: 'Present' | 'Absent';
}

export default function AttendanceHistory() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await api.get('/attendance/my-attendance');
      setAttendance(response.data.attendance);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-slate-500">Loading attendance...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  const presentCount = attendance.filter((a) => a.status === 'Present').length;
  const absentCount = attendance.filter((a) => a.status === 'Absent').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700 text-sm font-medium">Present Days</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{presentCount}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm font-medium">Absent Days</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{absentCount}</p>
        </div>
      </div>

      {attendance.length === 0 ? (
        <p className="text-slate-600">No attendance records yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 border-b border-slate-300">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-slate-900">Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-slate-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record._id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-900">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        record.status === 'Present'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
