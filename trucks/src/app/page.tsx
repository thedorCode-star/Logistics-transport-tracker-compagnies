'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { companies } from "@/data/companies";
// import { CheckCircle, ExternalLink, X } from 'lucide-react';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           company.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '' || company.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const categories = Array.from(new Set(companies.map(c => c.category)));

  const verifyCertification = (company: any) => {
    setSelectedCompany(company);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            South African Mining Transport Companies
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover certified logistics partners for your mining operations. Browse our comprehensive directory of transport companies specializing in bulk materials, hazardous goods, and compliance-ready services.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCompanies.map((company, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{company.name}</h2>
                {company.complianceCertified && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <span className="h-3 w-3 mr-1 text-green-600">✓</span>
                    ADR Compliant
                  </span>
                )}
              </div>
              <p className="text-sm text-blue-600 mb-3 font-medium">{company.category}</p>
              <p className="text-gray-700 mb-4 line-clamp-3">{company.description}</p>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p><strong>Address:</strong> {company.address}</p>
                <p><strong>Phone:</strong> {company.phone}</p>
                <p><strong>Email:</strong> <a href={`mailto:${company.email}`} className="text-blue-600 hover:underline">{company.email}</a></p>
              </div>
              <div className="flex space-x-2">
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <span className="h-4 w-4 mr-2">↗</span>
                  Visit Website
                </a>
                {company.complianceCertified && (
                  <button
                    onClick={() => verifyCertification(company)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Verify
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No companies match your search criteria.</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
          </div>
        )}

        {/* Certification Verification Modal */}
        {selectedCompany && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Certification Verification</h3>
                  <button
                    onClick={() => setSelectedCompany(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="h-6 w-6">×</span>
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <span className="h-6 w-6 text-green-600 mr-3">✓</span>
                      <div>
                        <h4 className="font-semibold text-green-900">ADR Compliance Verified</h4>
                        <p className="text-green-700 text-sm">This company meets South African hazardous materials transport standards.</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Company Details</h4>
                    <p><strong>Name:</strong> {selectedCompany.name}</p>
                    <p><strong>Category:</strong> {selectedCompany.category}</p>
                    <p><strong>Website:</strong> <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{selectedCompany.website}</a></p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Compliance Standards</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>National Road Traffic Act compliance</li>
                      <li>Hazardous Substances Act adherence</li>
                      <li>Mine Health and Safety Act certification</li>
                      <li>Annual vehicle and driver inspections</li>
                      <li>Emergency response training</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>Note:</strong> Verification is based on publicly available information and company declarations.
                      For official certification, contact the Department of Transport or conduct independent audits.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
