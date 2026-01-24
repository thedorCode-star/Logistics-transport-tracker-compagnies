'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import socket from '@/lib/socket';

interface Shipment {
  id: string;
  company: {
    name: string;
  };
  description: string;
  status: string;
  date: string;
  statusHistory: {
    id: string;
    status: string;
    changedAt: string;
  }[];
}

export default function Tracking() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [newShipment, setNewShipment] = useState({
    company: '',
    description: '',
    status: 'Pending'
  });
  const [loading, setLoading] = useState(false);
  const [expandedShipment, setExpandedShipment] = useState<string | null>(null);

  const statuses = ['Pending', 'Loading', 'In Transit', 'Delayed', 'Delivered', 'Cancelled'];

  const fetchShipments = async () => {
    try {
      const res = await fetch('/api/shipments');
      const data = await res.json();
      setShipments(data);
    } catch (error) {
      console.error('Failed to fetch shipments:', error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch('/api/companies');
      const data = await res.json();
      setCompanies(data);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    }
  };

  useEffect(() => {
    fetchShipments();
    fetchCompanies();

    // Listen for real-time updates
    socket.on('shipment-updated', (updatedShipment: Shipment) => {
      setShipments(prev => prev.map(s => s.id === updatedShipment.id ? updatedShipment : s));
    });

    return () => {
      socket.off('shipment-updated');
    };
  }, []);

  const addShipment = async () => {
    if (!newShipment.company || !newShipment.description) return;
    setLoading(true);
    try {
      const res = await fetch('/api/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newShipment)
      });
      if (res.ok) {
        await fetchShipments(); // Refresh list
        setNewShipment({ company: '', description: '', status: 'Pending' });
      }
    } catch (error) {
      console.error('Failed to add shipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/shipments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        // Refetch all shipments to get updated data including history
        await fetchShipments();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6 shadow-lg animate-pulse-slow">
            <span className="text-3xl">📦</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-4">
            Shipment Tracking
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Monitor your mining transport shipments in real-time with automatic updates and comprehensive tracking history.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-blue-100 mb-8 hover:shadow-2xl transition-shadow duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center mb-6">
            <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white text-xl">+</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Add New Shipment</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Company</label>
              <select
                value={newShipment.company}
                onChange={(e) => setNewShipment({ ...newShipment, company: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400"
              >
                <option value="">Select Company</option>
                {companies.map(company => (
                  <option key={company.id} value={company.name}>{company.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                placeholder="e.g., Coal shipment to Johannesburg"
                value={newShipment.description}
                onChange={(e) => setNewShipment({ ...newShipment, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                value={newShipment.status}
                onChange={(e) => setNewShipment({ ...newShipment, status: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={addShipment}
            disabled={loading}
            className="w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Adding...
              </div>
            ) : (
              'Add Shipment'
            )}
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl transition-shadow duration-300 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center mb-6">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white text-xl">📋</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Your Shipments</h2>
            <span className="ml-2 text-sm text-gray-500 bg-blue-100 px-2 py-1 rounded-full">
              Auto-refreshing
            </span>
          </div>
          {shipments.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl text-gray-400">📦</span>
              </div>
              <p className="text-gray-600 text-lg">No shipments yet.</p>
              <p className="text-gray-400 text-sm mt-2">Add your first shipment above to get started.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              {shipments.map((shipment, index) => (
                <div
                  key={shipment.id}
                  className="bg-gradient-to-r from-white to-blue-50/50 p-6 rounded-xl shadow-md border border-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          ID: {shipment.id.slice(-8)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          shipment.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          shipment.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                          shipment.status === 'Delayed' ? 'bg-red-100 text-red-800' :
                          shipment.status === 'Cancelled' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {shipment.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{shipment.company.name}</h3>
                      <p className="text-gray-600 mb-2">{shipment.description}</p>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(shipment.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-4">
                      <select
                        value={shipment.status}
                        onChange={(e) => updateStatus(shipment.id, e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400"
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="border-t border-blue-100 pt-4">
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Status History:</strong>
                      {shipment.statusHistory.length > 0 ? (
                        <span className="ml-2 text-blue-600">
                          Last updated: {new Date(shipment.statusHistory[0].changedAt).toLocaleString()}
                        </span>
                      ) : (
                        <span className="ml-2 text-gray-400">No history yet</span>
                      )}
                    </div>
                    <button
                      onClick={() => setExpandedShipment(expandedShipment === shipment.id ? null : shipment.id)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200 flex items-center"
                    >
                      <span className="mr-1">{expandedShipment === shipment.id ? '▼' : '▶'}</span>
                      View Full History ({shipment.statusHistory.length} changes)
                    </button>
                    {expandedShipment === shipment.id && (
                      <div className="mt-3 bg-blue-50/50 rounded-lg p-4 border border-blue-200">
                        <ul className="space-y-2">
                          {shipment.statusHistory.map((history) => (
                            <li key={history.id} className="flex items-center justify-between text-sm">
                              <span className="font-medium text-gray-900">{history.status}</span>
                              <span className="text-gray-500">{new Date(history.changedAt).toLocaleString()}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}