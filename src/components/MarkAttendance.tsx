import React, { useState } from 'react';
import api from '../utils/api';

export default function MarkAttendance() {
  const [status, setStatus] = useState<'Present' | 'Absent'>('Present');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleMark = async () => {
    setLoading(true);
    setMessage('');

    try {
      await api.post('/attendance/mark', { date, status });
      setMessage('Attendance marked successfully!');
      setIsError(false);
      setDate(new Date().toISOString().split('T')[0]);
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to mark attendance');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
        <div className="flex gap-4">
          <button
            onClick={() => setStatus('Present')}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              status === 'Present'
                ? 'bg-green-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Present
          </button>
          <button
            onClick={() => setStatus('Absent')}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              status === 'Absent'
                ? 'bg-red-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Absent
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded text-sm font-medium ${
          isError
            ? 'bg-red-50 border border-red-200 text-red-700'
            : 'bg-green-50 border border-green-200 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <button
        onClick={handleMark}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
      >
        {loading ? 'Marking...' : 'Mark Attendance'}
      </button>
    </div>
  );
}
