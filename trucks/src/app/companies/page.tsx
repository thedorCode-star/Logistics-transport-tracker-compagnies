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
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchCompanies();
  }, [search, categoryFilter, sortBy, sortOrder]);

  const fetchCompanies = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryFilter) params.append('category', categoryFilter);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const res = await fetch(`/api/companies?${params.toString()}`);
      const data = await res.json();
      setCompanies(data);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategoryFilter('');
    setSortBy('name');
    setSortOrder('asc');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading companies...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6 shadow-lg animate-pulse-slow">
            <span className="text-4xl">🏢</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-6">
            Companies Directory
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover certified logistics partners for your mining operations. Browse our comprehensive directory of transport companies.
          </p>
          <Link href="/tracking" className="inline-flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <span className="mr-2">📊</span>
            Go to Tracking
          </Link>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Search Companies
              </label>
              <input
                type="text"
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, description, or address..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                🏷️ Filter by Category
              </label>
              <select
                id="category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Categories</option>
                <option value="General Mining Transport">General Mining Transport</option>
                <option value="Hazardous Materials Transport">Hazardous Materials Transport</option>
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                🔄 Sort By
              </label>
              <select
                id="sort"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="category-asc">Category (A-Z)</option>
                <option value="category-desc">Category (Z-A)</option>
                <option value="complianceCertified-desc">Certified First</option>
                <option value="complianceCertified-asc">Non-Certified First</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(search || categoryFilter || sortBy !== 'name' || sortOrder !== 'asc') && (
            <div className="flex justify-center">
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-blue-600">{companies.length}</span> companies
            {(search || categoryFilter) && (
              <span>
                {' '}matching your criteria
                <button
                  onClick={clearFilters}
                  className="ml-2 text-blue-500 hover:text-blue-700 underline text-sm"
                >
                  (Clear filters)
                </button>
              </span>
            )}
          </p>
        </div>

        {companies.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-32 w-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-6xl text-gray-400">🏭</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {search || categoryFilter ? 'No companies match your filters' : 'No companies found'}
            </h2>
            <p className="text-gray-600 mb-6">
              {search || categoryFilter
                ? 'Try adjusting your search terms or filters to find more results.'
                : 'Please run the database seed to populate companies.'
              }
            </p>
            {search || categoryFilter ? (
              <button
                onClick={clearFilters}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Clear Filters
              </button>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
                <code className="text-blue-800 font-mono">npm run db:seed</code>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companies.map((company, index) => (
              <div
                key={company.id}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {company.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        company.category === 'Hazardous Materials Transport'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {company.category === 'Hazardous Materials Transport' && '⚠️ '}
                        {company.category}
                      </span>
                    </div>
                  </div>
                  {company.complianceCertified && (
                    <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Certified
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {company.description}
                </p>
                <div className="space-y-3 text-sm text-gray-600 mb-6">
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-3 mt-0.5">📍</span>
                    <span>{company.address}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-500 mr-3">📞</span>
                    <span>{company.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-500 mr-3">✉️</span>
                    <a href={`mailto:${company.email}`} className="text-blue-600 hover:underline">
                      {company.email}
                    </a>
                  </div>
                </div>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center font-medium"
                >
                  <span className="mr-2">🌐</span>
                  Visit Website
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}