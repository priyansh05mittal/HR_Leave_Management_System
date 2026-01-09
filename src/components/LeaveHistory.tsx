import React, { useState, useEffect } from 'react';
import api from '../utils/api';

interface Leave {
  _id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export default function LeaveHistory() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await api.get('/leave/my-leaves');
      setLeaves(response.data.leaves);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch leaves');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this leave request?')) {
      return;
    }

    try {
      await api.delete(`/leave/${id}`);
      setLeaves(leaves.filter((leave) => leave._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel leave');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  if (loading) {
    return <div className="text-center text-slate-500">Loading leaves...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {leaves.length === 0 ? (
        <p className="text-slate-600">No leave requests yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 border-b border-slate-300">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-slate-900">Type</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-slate-900">Start</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-slate-900">End</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-slate-900">Days</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-slate-900">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-slate-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-900 font-medium">{leave.leaveType}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {new Date(leave.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {new Date(leave.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{leave.totalDays}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded border text-xs font-medium ${getStatusColor(leave.status)}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {leave.status === 'Pending' && (
                      <button
                        onClick={() => handleCancel(leave._id)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Cancel
                      </button>
                    )}
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
