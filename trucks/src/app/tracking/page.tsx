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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipment Tracking</h1>
          <p className="text-xl text-gray-600">Monitor your mining transport shipments in real-time with automatic updates.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Add New Shipment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <select
              value={newShipment.company}
              onChange={(e) => setNewShipment({ ...newShipment, company: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="">Select Company</option>
              {companies.map(company => (
                <option key={company.id} value={company.name}>{company.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Description"
              value={newShipment.description}
              onChange={(e) => setNewShipment({ ...newShipment, description: e.target.value })}
              className="border p-2 rounded"
            />
            <select
              value={newShipment.status}
              onChange={(e) => setNewShipment({ ...newShipment, status: e.target.value })}
              className="border p-2 rounded"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <button onClick={addShipment} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50">
            {loading ? 'Adding...' : 'Add Shipment'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Your Shipments (Auto-refreshing)</h2>
          {shipments.length === 0 ? (
            <p className="text-gray-600">No shipments yet.</p>
          ) : (
            <div className="space-y-4">
              {shipments.map((shipment) => (
                <div key={shipment.id} className="border p-4 rounded">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p><strong>ID:</strong> {shipment.id}</p>
                      <p><strong>Company:</strong> {shipment.company.name}</p>
                      <p><strong>Description:</strong> {shipment.description}</p>
                      <p><strong>Date:</strong> {shipment.date}</p>
                    </div>
                    <div>
                      <select
                        value={shipment.status}
                        onChange={(e) => updateStatus(shipment.id, e.target.value)}
                        className="border p-2 rounded mr-2"
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <span className={`px-2 py-1 rounded text-sm ${
                        shipment.status === 'Delivered' ? 'bg-green-200 text-green-800' :
                        shipment.status === 'In Transit' ? 'bg-blue-200 text-blue-800' :
                        shipment.status === 'Delayed' ? 'bg-red-200 text-red-800' :
                        shipment.status === 'Cancelled' ? 'bg-gray-200 text-gray-800' :
                        'bg-yellow-200 text-yellow-800'
                      }`}>
                        {shipment.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Status History:</strong>
                      {shipment.statusHistory.length > 0 ? (
                        <span className="ml-2">
                          Last updated: {new Date(shipment.statusHistory[0].changedAt).toLocaleString()}
                        </span>
                      ) : (
                        <span className="ml-2 text-gray-400">No history yet</span>
                      )}
                    </div>
                    <button
                      onClick={() => setExpandedShipment(expandedShipment === shipment.id ? null : shipment.id)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {expandedShipment === shipment.id ? 'Hide' : 'View'} Full History ({shipment.statusHistory.length} changes)
                    </button>
                    {expandedShipment === shipment.id && (
                      <div className="mt-2 border-t pt-2">
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {shipment.statusHistory.map((history) => (
                            <li key={history.id}>
                              <span className="font-medium">{history.status}</span> - {new Date(history.changedAt).toLocaleString()}
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