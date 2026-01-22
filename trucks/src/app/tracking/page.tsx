'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Shipment {
  id: string;
  company: string;
  description: string;
  status: string;
  date: string;
}

export default function Tracking() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [newShipment, setNewShipment] = useState({
    company: '',
    description: '',
    status: 'Pending'
  });
  const [loading, setLoading] = useState(false);

  const fetchShipments = async () => {
    try {
      const res = await fetch('/api/shipments');
      const data = await res.json();
      setShipments(data);
    } catch (error) {
      console.error('Failed to fetch shipments:', error);
    }
  };

  useEffect(() => {
    fetchShipments();
    const interval = setInterval(fetchShipments, 5000); // Poll every 5 seconds for real-time updates
    return () => clearInterval(interval);
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
      await fetch(`/api/shipments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      await fetchShipments(); // Refresh list
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
            <input
              type="text"
              placeholder="Company Name"
              value={newShipment.company}
              onChange={(e) => setNewShipment({ ...newShipment, company: e.target.value })}
              className="border p-2 rounded"
            />
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
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Delayed">Delayed</option>
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
                <div key={shipment.id} className="border p-4 rounded flex justify-between items-center">
                  <div>
                    <p><strong>ID:</strong> {shipment.id}</p>
                    <p><strong>Company:</strong> {shipment.company}</p>
                    <p><strong>Description:</strong> {shipment.description}</p>
                    <p><strong>Date:</strong> {shipment.date}</p>
                  </div>
                  <div>
                    <select
                      value={shipment.status}
                      onChange={(e) => updateStatus(shipment.id, e.target.value)}
                      className="border p-2 rounded mr-2"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Delayed">Delayed</option>
                    </select>
                    <span className={`px-2 py-1 rounded text-sm ${
                      shipment.status === 'Delivered' ? 'bg-green-200 text-green-800' :
                      shipment.status === 'In Transit' ? 'bg-blue-200 text-blue-800' :
                      shipment.status === 'Delayed' ? 'bg-red-200 text-red-800' :
                      'bg-yellow-200 text-yellow-800'
                    }`}>
                      {shipment.status}
                    </span>
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