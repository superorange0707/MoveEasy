'use client';

import { useState } from 'react';
import UKAddressLookup from './UKAddressLookup';

type Address = {
  line1: string;
  line2?: string;
  town: string;
  county?: string;
  postcode: string;
};

type AddressFormProps = {
  onSubmit: (oldAddress: Address, newAddress: Address) => void;
};

export default function AddressForm({ onSubmit }: AddressFormProps) {
  const [oldAddress, setOldAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState<Address | null>(null);
  const [step, setStep] = useState<'old' | 'new'>('old');
  const [isManualEntry, setIsManualEntry] = useState(false);

  const handleManualSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const address: Address = {
      line1: formData.get('line1') as string,
      line2: formData.get('line2') as string || undefined,
      town: formData.get('town') as string,
      county: formData.get('county') as string || undefined,
      postcode: formData.get('postcode') as string,
    };

    if (step === 'old') {
      setOldAddress(address);
      setStep('new');
    } else {
      setNewAddress(address);
      if (oldAddress) {
        onSubmit(oldAddress, address);
      }
    }
  };

  const renderManualForm = () => (
    <form onSubmit={handleManualSubmit} className="space-y-4">
      <div>
        <label htmlFor="line1" className="block text-sm font-medium text-gray-700">
          Address Line 1
        </label>
        <input
          type="text"
          name="line1"
          id="line1"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
        />
      </div>

      <div>
        <label htmlFor="line2" className="block text-sm font-medium text-gray-700">
          Address Line 2 (Optional)
        </label>
        <input
          type="text"
          name="line2"
          id="line2"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
        />
      </div>

      <div>
        <label htmlFor="town" className="block text-sm font-medium text-gray-700">
          Town/City
        </label>
        <input
          type="text"
          name="town"
          id="town"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
        />
      </div>

      <div>
        <label htmlFor="county" className="block text-sm font-medium text-gray-700">
          County (Optional)
        </label>
        <input
          type="text"
          name="county"
          id="county"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
        />
      </div>

      <div>
        <label htmlFor="postcode" className="block text-sm font-medium text-gray-700">
          Postcode
        </label>
        <input
          type="text"
          name="postcode"
          id="postcode"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
        />
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setIsManualEntry(false)}
          className="text-blue-600 hover:text-blue-800"
        >
          Use Postcode Lookup
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {step === 'old' ? 'Continue to New Address' : 'Submit'}
        </button>
      </div>
    </form>
  );

  const handleAddressSelect = (address: Address) => {
    if (step === 'old') {
      setOldAddress(address);
      setStep('new');
    } else {
      setNewAddress(address);
      if (oldAddress) {
        onSubmit(oldAddress, address);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          {step === 'old' ? 'Current Address' : 'New Address'}
        </h2>

        <div className="mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
              {step === 'old' ? '1' : '2'}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                {step === 'old'
                  ? 'Where are you moving from?'
                  : 'Where are you moving to?'}
              </h3>
              <p className="text-gray-700">
                {isManualEntry
                  ? 'Enter the address manually'
                  : 'Enter your postcode to find your address'}
              </p>
            </div>
          </div>
        </div>

        {isManualEntry ? (
          renderManualForm()
        ) : (
          <div>
            <UKAddressLookup onAddressSelect={handleAddressSelect} />
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsManualEntry(true)}
                className="text-blue-600 hover:text-blue-800"
              >
                Enter Address Manually
              </button>
            </div>
          </div>
        )}

        {step === 'new' && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                ✓
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Current Address</h3>
                <p className="text-gray-700">
                  {oldAddress?.line1}
                  {oldAddress?.line2 ? `, ${oldAddress.line2}` : ''}, {oldAddress?.town},{' '}
                  {oldAddress?.postcode}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 