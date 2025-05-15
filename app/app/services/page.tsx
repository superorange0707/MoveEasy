'use client';

import { useState } from 'react';
import NavBar from '../../components/NavBar';

type ServiceProvider = {
  id: string;
  name: string;
  category: string;
  description: string;
  integrationMethod: 'API' | 'RPA' | 'Manual';
  status: 'operational' | 'maintenance' | 'disruption';
  popular: boolean;
};

type ServiceCategory = {
  id: string;
  name: string;
  description: string;
  providers: ServiceProvider[];
};

export default function Services() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [showOnlyApi, setShowOnlyApi] = useState(false);
  
  const serviceCategories: ServiceCategory[] = [
    {
      id: 'utilities',
      name: 'Utilities',
      description: 'Update your address with utility service providers',
      providers: [
        {
          id: 'electric-co',
          name: 'National Electric Co.',
          category: 'utilities',
          description: 'Update your electricity service provider with your new address',
          integrationMethod: 'API',
          status: 'operational',
          popular: true,
        },
        {
          id: 'water-co',
          name: 'City Water Service',
          category: 'utilities',
          description: 'Update your water service provider with your new address',
          integrationMethod: 'RPA',
          status: 'operational',
          popular: true,
        },
        {
          id: 'gas-co',
          name: 'Metro Gas Service',
          category: 'utilities',
          description: 'Update your gas provider with your new address',
          integrationMethod: 'API',
          status: 'maintenance',
          popular: false,
        },
        {
          id: 'internet-co',
          name: 'Fast Internet Provider',
          category: 'utilities',
          description: 'Update your internet service provider with your new address',
          integrationMethod: 'API',
          status: 'operational',
          popular: true,
        },
      ],
    },
    {
      id: 'postal',
      name: 'Postal Services',
      description: 'Update your address with postal and delivery services',
      providers: [
        {
          id: 'usps',
          name: 'United States Postal Service',
          category: 'postal',
          description: 'Set up mail forwarding with the USPS',
          integrationMethod: 'API',
          status: 'operational',
          popular: true,
        },
        {
          id: 'ups',
          name: 'UPS',
          category: 'postal',
          description: 'Update your address with UPS',
          integrationMethod: 'Manual',
          status: 'operational',
          popular: false,
        },
        {
          id: 'fedex',
          name: 'FedEx',
          category: 'postal',
          description: 'Update your address with FedEx',
          integrationMethod: 'RPA',
          status: 'disruption',
          popular: false,
        },
      ],
    },
    {
      id: 'financial',
      name: 'Financial Institutions',
      description: 'Update your address with banks, credit cards, and insurance providers',
      providers: [
        {
          id: 'national-bank',
          name: 'National Bank',
          category: 'financial',
          description: 'Update your address with National Bank',
          integrationMethod: 'API',
          status: 'operational',
          popular: true,
        },
        {
          id: 'credit-one',
          name: 'Credit One',
          category: 'financial',
          description: 'Update your address with Credit One credit cards',
          integrationMethod: 'API',
          status: 'operational',
          popular: true,
        },
        {
          id: 'secure-insurance',
          name: 'Secure Insurance',
          category: 'financial',
          description: 'Update your address with Secure Insurance',
          integrationMethod: 'RPA',
          status: 'operational',
          popular: false,
        },
      ],
    },
    {
      id: 'government',
      name: 'Government Services',
      description: 'Update your address with federal, state, and local government agencies',
      providers: [
        {
          id: 'dmv',
          name: 'Department of Motor Vehicles',
          category: 'government',
          description: "Update your driver's license and vehicle registration",
          integrationMethod: 'Manual',
          status: 'operational',
          popular: true,
        },
        {
          id: 'irs',
          name: 'Internal Revenue Service',
          category: 'government',
          description: 'Update your address with the IRS',
          integrationMethod: 'RPA',
          status: 'operational',
          popular: false,
        },
        {
          id: 'voter-reg',
          name: 'Voter Registration',
          category: 'government',
          description: 'Update your voter registration information',
          integrationMethod: 'RPA',
          status: 'operational',
          popular: true,
        },
      ],
    },
  ];

  // Filter service providers based on search and filters
  const filteredCategories = serviceCategories
    .map(category => {
      // Filter providers in this category
      const filteredProviders = category.providers.filter(provider => {
        // Apply search filter
        const matchesSearch = searchQuery === '' || 
          provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Apply API-only filter
        const matchesApiFilter = !showOnlyApi || provider.integrationMethod === 'API';
        
        return matchesSearch && matchesApiFilter;
      });
      
      // Return category with filtered providers
      return {
        ...category,
        providers: filteredProviders,
      };
    })
    // Apply category filter
    .filter(category => !filterCategory || category.id === filterCategory)
    // Remove categories with no matching providers
    .filter(category => category.providers.length > 0);

  const statusBadge = (status: ServiceProvider['status']) => {
    switch (status) {
      case 'operational':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Operational</span>;
      case 'maintenance':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Maintenance</span>;
      case 'disruption':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Disruption</span>;
      default:
        return null;
    }
  };

  const integrationBadge = (method: ServiceProvider['integrationMethod']) => {
    switch (method) {
      case 'API':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">API</span>;
      case 'RPA':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">RPA</span>;
      case 'Manual':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Manual</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Service Providers</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
                <select
                  value={filterCategory || ''}
                  onChange={(e) => setFilterCategory(e.target.value || null)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Categories</option>
                  {serviceCategories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showOnlyApi}
                    onChange={(e) => setShowOnlyApi(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show only API integrations</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            {filteredCategories.map(category => (
              <div key={category.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-semibold">{category.name}</h2>
                  <p className="text-gray-600 mt-1">{category.description}</p>
                </div>
                
                <div className="divide-y">
                  {category.providers.map(provider => (
                    <div key={provider.id} className="p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium">{provider.name}</h3>
                          {provider.popular && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mt-1">{provider.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {integrationBadge(provider.integrationMethod)}
                          {statusBadge(provider.status)}
                        </div>
                      </div>
                      <div>
                        <button
                          className={`px-4 py-2 rounded-md ${
                            provider.status === 'operational'
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-300 text-gray-700 cursor-not-allowed'
                          }`}
                          disabled={provider.status !== 'operational'}
                        >
                          Update Address
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {filteredCategories.length === 0 && (
              <div className="bg-white shadow-md rounded-lg p-8 text-center">
                <p className="text-gray-600">No service providers match your search criteria.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterCategory(null);
                    setShowOnlyApi(false);
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-800"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 