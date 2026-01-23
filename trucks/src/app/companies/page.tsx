'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Company {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  complianceCertified: boolean;
}

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await fetch('/api/companies');
      const data = await res.json();
      setCompanies(data);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading companies...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Truck Load Companies Directory</h1>
          <p className="text-xl text-gray-600">Browse our comprehensive directory of logistics and transport companies.</p>
          <Link href="/tracking" className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Go to Tracking
          </Link>
        </div>

        {companies.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">No companies found. Please run the database seed to populate companies.</p>
            <p className="text-sm text-gray-500">Run: npm run db:seed</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div key={company.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{company.name}</h2>
                  {company.complianceCertified && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Certified
                    </span>
                  )}
                </div>
                <p className="text-sm text-blue-600 mb-2">{company.category}</p>
                <p className="text-gray-600 mb-4 line-clamp-3">{company.description}</p>
                <div className="space-y-2 text-sm">
                  <p><strong>Address:</strong> {company.address}</p>
                  <p><strong>Phone:</strong> {company.phone}</p>
                  <p><strong>Email:</strong> <a href={`mailto:${company.email}`} className="text-blue-600 hover:underline">{company.email}</a></p>
                  <p><strong>Website:</strong> <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{company.website}</a></p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}