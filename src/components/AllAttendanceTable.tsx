import React, { useState, useEffect } from 'react';
import api from '../utils/api';

interface Attendance {
  _id: string;
  userId: { _id: string; name: string; email: string };
  date: string;
  status: 'Present' | 'Absent';
}

export default function AllAttendanceTable() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const params = filterDate ? { date: filterDate } : {};
      const response = await api.get('/attendance/all', { params });
      setAttendance(response.data.attendance);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    setLoading(true);
    fetchAttendance();
  };

  if (loading) {
    return <div className="text-center text-slate-500">Loading attendance records...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  const presentCount = attendance.filter((a) => a.status === 'Present').length;
  const absentCount = attendance.filter((a) => a.status === 'Absent').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700 text-sm font-medium">Present</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{presentCount}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm font-medium">Absent</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{absentCount}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700 text-sm font-medium">Total Records</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{attendance.length}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleFilter}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition font-medium"
        >
          Filter
        </button>
        {filterDate && (
          <button
            onClick={() => {
              setFilterDate('');
              setLoading(true);
              const params = {};
              api.get('/attendance/all', { params }).then((response) => {
                setAttendance(response.data.attendance);
                setLoading(false);
              });
            }}
            className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg transition font-medium"
          >
            Clear
          </button>
        )}
      </div>

      {attendance.length === 0 ? (
        <p className="text-slate-600">No attendance records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 border-b border-slate-300">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-slate-900">Employee</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-slate-900">Email</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-slate-900">Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-slate-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record._id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-900 font-medium">
                    {record.userId.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{record.userId.email}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium border ${
                        record.status === 'Present'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-red-50 text-red-700 border-red-200'
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
