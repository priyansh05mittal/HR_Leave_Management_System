import React, { useState } from 'react';
import api from '../utils/api';

interface Props {
  onSuccess: () => void;
}

export default function ApplyLeaveForm({ onSuccess }: Props) {
  const [leaveType, setLeaveType] = useState('Casual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/leave/apply', {
        leaveType,
        startDate,
        endDate,
        reason
      });

      setSuccess('Leave request submitted successfully!');
      setLeaveType('Casual');
      setStartDate('');
      setEndDate('');
      setReason('');

      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to apply leave');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
          {success}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Leave Type</label>
        <select
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Casual</option>
          <option>Sick</option>
          <option>Paid</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Reason (Optional)</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Leave Request'}
      </button>
    </form>
  );
}
