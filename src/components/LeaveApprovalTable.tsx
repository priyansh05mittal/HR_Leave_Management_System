import React, { useState, useEffect } from 'react';
import api from '../utils/api';

interface Leave {
  _id: string;
  userId: { _id: string; name: string; email: string };
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export default function LeaveApprovalTable() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await api.get('/leave/all');
      setLeaves(response.data.leaves);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch leaves');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await api.put(`/leave/${id}/approve`);
      setLeaves(leaves.map((leave) =>
        leave._id === id ? { ...leave, status: 'Approved' as const } : leave
      ));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to approve leave');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await api.put(`/leave/${id}/reject`);
      setLeaves(leaves.map((leave) =>
        leave._id === id ? { ...leave, status: 'Rejected' as const } : leave
      ));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reject leave');
    } finally {
      setActionLoading(null);
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
    return <div className="text-center text-slate-500">Loading leave requests...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  const pendingLeaves = leaves.filter((l) => l.status === 'Pending');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700 text-sm font-medium">Total Requests</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{leaves.length}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700 text-sm font-medium">Pending</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">{pendingLeaves.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700 text-sm font-medium">Approved</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            {leaves.filter((l) => l.status === 'Approved').length}
          </p>
        </div>
      </div>

      {leaves.length === 0 ? (
        <p className="text-slate-600">No leave requests.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 border-b border-slate-300">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-slate-900">Employee</th>
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
                  <td className="px-4 py-3 text-sm text-slate-900 font-medium">
                    {leave.userId.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{leave.leaveType}</td>
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
                  <td className="px-4 py-3 text-sm space-x-2 flex">
                    {leave.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(leave._id)}
                          disabled={actionLoading === leave._id}
                          className="text-green-600 hover:text-green-700 font-medium disabled:opacity-50"
                        >
                          {actionLoading === leave._id ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(leave._id)}
                          disabled={actionLoading === leave._id}
                          className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
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
