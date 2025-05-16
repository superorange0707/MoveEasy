'use client';

import { useState } from 'react';
import { ServiceManager } from '@/lib/services/serviceManager';
import { Address } from '@/lib/db/schema';

type Service = {
  id: string;
  name: string;
  category: string;
  logo?: string;
  description: string;
  selected: boolean;
  credentials?: Record<string, string>;
};

type ServiceCategory = {
  id: string;
  name: string;
  services: Service[];
};

type ServiceSelectionProps = {
  onSubmit: (services: Service[]) => void;
  oldAddress: Address;
  newAddress: Address;
};

export default function ServiceSelection({ onSubmit, oldAddress, newAddress }: ServiceSelectionProps) {
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([
    {
      id: 'utilities',
      name: 'Utilities',
      services: [
        {
          id: 'british-gas',
          name: 'British Gas',
          category: 'utilities',
          description: 'Update your gas and electricity account with your new address',
          selected: false,
        },
        {
          id: 'thames-water',
          name: 'Thames Water',
          category: 'utilities',
          description: 'Update your water service account with your new address',
          selected: false,
        },
        {
          id: 'scottish-power',
          name: 'Scottish Power',
          category: 'utilities',
          description: 'Update your energy account with your new address',
          selected: false,
        },
        {
          id: 'bt',
          name: 'BT',
          category: 'utilities',
          description: 'Update your broadband and phone services with your new address',
          selected: false,
        },
      ],
    },
    {
      id: 'postal',
      name: 'Postal & Delivery Services',
      services: [
        {
          id: 'royal-mail',
          name: 'Royal Mail Redirection',
          category: 'postal',
          description: 'Set up mail redirection service with Royal Mail',
          selected: false,
        },
        {
          id: 'parcelforce',
          name: 'Parcelforce',
          category: 'postal',
          description: 'Update your delivery preferences with Parcelforce',
          selected: false,
        },
      ],
    },
    {
      id: 'financial',
      name: 'Financial Services',
      services: [
        {
          id: 'hmrc',
          name: 'HMRC',
          category: 'financial',
          description: 'Update your address with HM Revenue & Customs',
          selected: false,
        },
        {
          id: 'lloyds',
          name: 'Lloyds Bank',
          category: 'financial',
          description: 'Update your address with Lloyds Bank',
          selected: false,
        },
        {
          id: 'barclays',
          name: 'Barclays',
          category: 'financial',
          description: 'Update your address with Barclays Bank',
          selected: false,
        },
        {
          id: 'nationwide',
          name: 'Nationwide',
          category: 'financial',
          description: 'Update your address with Nationwide Building Society',
          selected: false,
        },
      ],
    },
    {
      id: 'govt',
      name: 'Government Services',
      services: [
        {
          id: 'dvla',
          name: 'DVLA',
          category: 'govt',
          description: "Update your driving licence and vehicle registration",
          selected: false,
        },
        {
          id: 'electoral',
          name: 'Electoral Register',
          category: 'govt',
          description: 'Update your electoral roll registration',
          selected: false,
        },
        {
          id: 'council',
          name: 'Local Council',
          category: 'govt',
          description: 'Update your address with your local council for council tax and services',
          selected: false,
        },
        {
          id: 'nhs',
          name: 'NHS',
          category: 'govt',
          description: 'Update your address with your GP and NHS services',
          selected: false,
        },
      ],
    },
    {
      id: 'insurance',
      name: 'Insurance Services',
      services: [
        {
          id: 'aviva',
          name: 'Aviva Insurance',
          category: 'insurance',
          description: 'Update your home and car insurance policies',
          selected: false,
        },
        {
          id: 'axa',
          name: 'AXA Insurance',
          category: 'insurance',
          description: 'Update your insurance policies with AXA',
          selected: false,
        },
        {
          id: 'direct-line',
          name: 'Direct Line',
          category: 'insurance',
          description: 'Update your insurance policies with Direct Line',
          selected: false,
        },
      ],
    },
  ]);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setCredentials({});
    setError(null);
  };

  const handleCredentialChange = (field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleServiceSubmit = async (service: Service) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/services/update-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: service.id,
          credentials,
          oldAddress,
          newAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update address');
      }

      // Update the service status in the categories
      setServiceCategories(prev =>
        prev.map(category => ({
          ...category,
          services: category.services.map(s =>
            s.id === service.id
              ? { ...s, selected: true, credentials, reference: data.reference }
              : s
          ),
        }))
      );

      setSelectedService(null);
      setCredentials({});
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update address');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAll = () => {
    const selectedServices = serviceCategories
      .flatMap(category => category.services)
      .filter(service => service.selected);
    
    onSubmit(selectedServices);
  };

  const serviceManager = new ServiceManager();
  const requiredCredentials = selectedService
    ? serviceManager.getRequiredCredentials(selectedService.id)
    : [];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Select Services to Update</h2>

      <div className="grid gap-6">
        {serviceCategories.map(category => (
          <div key={category.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h3 className="text-lg font-medium">{category.name}</h3>
            </div>
            <div className="divide-y">
              {category.services.map(service => (
                <div key={service.id} className="p-6 flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium">{service.name}</h4>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                  <button
                    className={`px-4 py-2 rounded-md ${
                      service.selected
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    onClick={() => handleServiceSelect(service)}
                    disabled={service.selected}
                  >
                    {service.selected ? 'Updated' : 'Update Address'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">
              Enter {selectedService.name} Credentials
            </h3>
            
            <div className="space-y-4">
              {requiredCredentials.map(field => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type={field.includes('password') ? 'password' : 'text'}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={credentials[field] || ''}
                    onChange={e => handleCredentialChange(field, e.target.value)}
                  />
                </div>
              ))}
            </div>

            {error && (
              <div className="mt-4 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => setSelectedService(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                onClick={() => handleServiceSubmit(selectedService)}
                disabled={isSubmitting || !requiredCredentials.every(field => credentials[field])}
              >
                {isSubmitting ? 'Updating...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button
          className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          onClick={handleSubmitAll}
          disabled={!serviceCategories.some(category => 
            category.services.some(service => service.selected)
          )}
        >
          Continue
        </button>
      </div>
    </div>
  );
} 