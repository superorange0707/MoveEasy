'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '../../../components/NavBar';

type Address = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postcode: string;
};

type Service = {
  id: string;
  name: string;
  category: string;
  description: string;
  required: boolean;
};

const availableServices: Service[] = [
  {
    id: 'electric',
    name: 'Electricity Provider',
    category: 'utilities',
    description: 'Update your electricity service provider with your new address',
    required: true,
  },
  {
    id: 'water',
    name: 'Water Service',
    category: 'utilities',
    description: 'Update your water service provider with your new address',
    required: true,
  },
  {
    id: 'usps',
    name: 'USPS Mail Forwarding',
    category: 'postal',
    description: 'Set up mail forwarding from your old address to your new address',
    required: true,
  },
  {
    id: 'bank',
    name: 'Banking Services',
    category: 'financial',
    description: 'Update your address with your bank and credit card providers',
    required: true,
  },
  {
    id: 'tax',
    name: 'Tax Information',
    category: 'government',
    description: 'Update your address with tax authorities',
    required: false,
  },
  {
    id: 'vehicle',
    name: 'Vehicle Registration',
    category: 'government',
    description: 'Update your vehicle registration with your new address',
    required: false,
  },
  {
    id: 'voter',
    name: 'Voter Registration',
    category: 'government',
    description: 'Update your voter registration for your new address',
    required: false,
  },
];

export default function NewMove() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [fromAddress, setFromAddress] = useState<Address>({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postcode: '',
  });
  const [toAddress, setToAddress] = useState<Address>({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postcode: '',
  });
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set(availableServices.filter(s => s.required).map(s => s.id))
  );

  const handleServiceToggle = (serviceId: string) => {
    const newSelected = new Set(selectedServices);
    if (newSelected.has(serviceId)) {
      // Don't allow deselecting required services
      if (!availableServices.find(s => s.id === serviceId)?.required) {
        newSelected.delete(serviceId);
      }
    } else {
      newSelected.add(serviceId);
    }
    setSelectedServices(newSelected);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/moves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromAddress,
          toAddress,
          services: Array.from(selectedServices),
        }),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        // Handle error
        console.error('Failed to create move');
      }
    } catch (error) {
      console.error('Error creating move:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Start New Move</h1>
            <p className="mt-2 text-gray-700">
              Let us help you update your address across all your services.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-lg">
            {/* Step indicators */}
            <div className="border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step >= 1 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                  }`}>
                    1
                  </div>
                  <span className="ml-2 font-medium">Previous Address</span>
                </div>
                <div className={`h-0.5 w-16 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step >= 2 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                  }`}>
                    2
                  </div>
                  <span className="ml-2 font-medium">New Address</span>
                </div>
                <div className={`h-0.5 w-16 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step >= 3 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                  }`}>
                    3
                  </div>
                  <span className="ml-2 font-medium">Select Services</span>
                </div>
              </div>
            </div>

            {/* Step content */}
            <div className="p-6">
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Previous Address</h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="from-line1" className="block text-sm font-medium text-gray-700">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        id="from-line1"
                        value={fromAddress.line1}
                        onChange={(e) => setFromAddress({ ...fromAddress, line1: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="from-line2" className="block text-sm font-medium text-gray-700">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        id="from-line2"
                        value={fromAddress.line2}
                        onChange={(e) => setFromAddress({ ...fromAddress, line2: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="from-city" className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          id="from-city"
                          value={fromAddress.city}
                          onChange={(e) => setFromAddress({ ...fromAddress, city: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="from-state" className="block text-sm font-medium text-gray-700">
                          State
                        </label>
                        <input
                          type="text"
                          id="from-state"
                          value={fromAddress.state}
                          onChange={(e) => setFromAddress({ ...fromAddress, state: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="from-postcode" className="block text-sm font-medium text-gray-700">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="from-postcode"
                        value={fromAddress.postcode}
                        onChange={(e) => setFromAddress({ ...fromAddress, postcode: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">New Address</h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="to-line1" className="block text-sm font-medium text-gray-700">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        id="to-line1"
                        value={toAddress.line1}
                        onChange={(e) => setToAddress({ ...toAddress, line1: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="to-line2" className="block text-sm font-medium text-gray-700">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        id="to-line2"
                        value={toAddress.line2}
                        onChange={(e) => setToAddress({ ...toAddress, line2: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="to-city" className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          id="to-city"
                          value={toAddress.city}
                          onChange={(e) => setToAddress({ ...toAddress, city: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="to-state" className="block text-sm font-medium text-gray-700">
                          State
                        </label>
                        <input
                          type="text"
                          id="to-state"
                          value={toAddress.state}
                          onChange={(e) => setToAddress({ ...toAddress, state: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="to-postcode" className="block text-sm font-medium text-gray-700">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="to-postcode"
                        value={toAddress.postcode}
                        onChange={(e) => setToAddress({ ...toAddress, postcode: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Select Services to Update</h2>
                  <p className="text-gray-700">Choose which services you'd like to update with your new address.</p>
                  <div className="space-y-4">
                    {availableServices.map((service) => (
                      <div
                        key={service.id}
                        className={`border rounded-lg p-4 ${
                          selectedServices.has(service.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                      >
                        <label className="flex items-start cursor-pointer">
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              checked={selectedServices.has(service.id)}
                              onChange={() => handleServiceToggle(service.id)}
                              disabled={service.required}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3">
                            <span className="block text-sm font-medium text-gray-900">
                              {service.name}
                              {service.required && <span className="text-red-500 ml-1">*</span>}
                            </span>
                            <span className="block text-sm text-gray-700">{service.description}</span>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="px-6 py-4 bg-gray-50 border-t rounded-b-lg flex justify-between">
              <button
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className={`px-4 py-2 rounded-md ${
                  step === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (step < 3) {
                    setStep(step + 1);
                  } else {
                    handleSubmit();
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {step === 3 ? 'Start Move' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 