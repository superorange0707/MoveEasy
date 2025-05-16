'use client';

import { useState } from 'react';
import { Address } from '@/lib/db/schema';

type UKAddressLookupProps = {
  onAddressSelect: (address: Partial<Address>) => void;
  className?: string;
};

// The API key should be set in your .env.local file
const IDEAL_POSTCODES_API_KEY = process.env.NEXT_PUBLIC_IDEAL_POSTCODES_API_KEY;
const API_URL = 'https://api.ideal-postcodes.co.uk/v1';

export default function UKAddressLookup({ onAddressSelect, className = '' }: UKAddressLookupProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [addresses, setAddresses] = useState<Partial<Address>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const searchAddress = async (query: string) => {
    if (query.length < 3) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `${API_URL}/addresses?api_key=${IDEAL_POSTCODES_API_KEY}&query=${encodeURIComponent(query)}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to search addresses');
      }

      if (!data.result?.hits || data.result.hits.length === 0) {
        setAddresses([]);
        setError('No addresses found. Please try a different search.');
        return;
      }

      // Transform the response to match our address format
      const formattedAddresses = data.result.hits.map((hit: any) => ({
        line1: [
          hit.sub_building_name,
          hit.building_name,
          hit.building_number,
          hit.thoroughfare
        ].filter(Boolean).join(', '),
        line2: hit.dependent_thoroughfare || undefined,
        town: hit.post_town || '',
        county: hit.county || undefined,
        postcode: hit.postcode || '',
        country: 'UK',
      }));

      setAddresses(formattedAddresses);
      setError('');
    } catch (err) {
      console.error('Address search error:', err);
      setError(err instanceof Error ? err.message : 'Failed to search addresses');
      setAddresses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchAddress(value);
  };

  const handleAddressSelect = (address: Partial<Address>) => {
    onAddressSelect(address);
    setSearchTerm('');
    setAddresses([]);
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="relative">
          <label htmlFor="address-search" className="block text-sm font-medium text-gray-700">
            Search Address
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="address-search"
              className="block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
              placeholder="Enter postcode, street, or building name..."
              value={searchTerm}
              onChange={handleSearchChange}
              autoComplete="off"
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        {addresses.length > 0 && (
          <ul className="mt-4 divide-y divide-gray-200 max-h-60 overflow-auto rounded-md border border-gray-200 bg-white shadow-sm">
            {addresses.map((address, index) => (
              <li key={index}>
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                  onClick={() => handleAddressSelect(address)}
                >
                  <p className="text-sm text-gray-900">
                    {[
                      address.line1,
                      address.line2,
                      address.town,
                      address.county,
                      address.postcode
                    ].filter(Boolean).join(', ')}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-2 text-sm text-gray-500">
          <p>
            Can't find your address?{' '}
            <button 
              type="button" 
              onClick={() => onAddressSelect({
                line1: '',
                line2: '',
                town: '',
                county: '',
                postcode: '',
                country: 'UK',
              })}
              className="text-blue-600 hover:text-blue-800"
            >
              Enter manually
            </button>
          </p>
        </div>
      </div>
    </div>
  );
} 