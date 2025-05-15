'use client';

import { useState } from 'react';

type Service = {
  id: string;
  name: string;
  category: string;
  logo?: string;
  description: string;
  selected: boolean;
};

type ServiceCategory = {
  id: string;
  name: string;
  services: Service[];
};

type ServiceSelectionProps = {
  onSubmit: (selectedServices: Service[]) => void;
};

export default function ServiceSelection({ onSubmit }: ServiceSelectionProps) {
  // Sample service data structure
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([
    {
      id: 'utilities',
      name: 'Utilities',
      services: [
        {
          id: 'electric',
          name: 'Electricity Provider',
          category: 'utilities',
          description: 'Update your electricity service provider with your new address',
          selected: false,
        },
        {
          id: 'water',
          name: 'Water Service',
          category: 'utilities',
          description: 'Update your water service provider with your new address',
          selected: false,
        },
        {
          id: 'gas',
          name: 'Gas Provider',
          category: 'utilities',
          description: 'Update your gas provider with your new address',
          selected: false,
        },
      ],
    },
    {
      id: 'postal',
      name: 'Postal Services',
      services: [
        {
          id: 'usps',
          name: 'USPS Mail Forwarding',
          category: 'postal',
          description: 'Set up mail forwarding with the United States Postal Service',
          selected: false,
        },
        {
          id: 'ups',
          name: 'UPS Address Update',
          category: 'postal',
          description: 'Update your address with UPS',
          selected: false,
        },
      ],
    },
    {
      id: 'financial',
      name: 'Financial Institutions',
      services: [
        {
          id: 'bank',
          name: 'Banking Services',
          category: 'financial',
          description: 'Update your address with your bank',
          selected: false,
        },
        {
          id: 'creditcard',
          name: 'Credit Card Companies',
          category: 'financial',
          description: 'Update your address with your credit card providers',
          selected: false,
        },
        {
          id: 'insurance',
          name: 'Insurance Providers',
          category: 'financial',
          description: 'Update your address with your insurance companies',
          selected: false,
        },
      ],
    },
    {
      id: 'govt',
      name: 'Government Services',
      services: [
        {
          id: 'dmv',
          name: 'DMV/Vehicle Registration',
          category: 'govt',
          description: "Update your driver\'s license and vehicle registration",
          selected: false,
        },
        {
          id: 'tax',
          name: 'Tax Authorities',
          category: 'govt',
          description: 'Update your address with federal and state tax authorities',
          selected: false,
        },
      ],
    },
  ]);

  const toggleServiceSelection = (categoryId: string, serviceId: string) => {
    setServiceCategories(
      serviceCategories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            services: category.services.map(service => {
              if (service.id === serviceId) {
                return {
                  ...service,
                  selected: !service.selected,
                };
              }
              return service;
            }),
          };
        }
        return category;
      })
    );
  };

  const handleSubmit = () => {
    const selectedServices = serviceCategories
      .flatMap(category => category.services)
      .filter(service => service.selected);
    
    onSubmit(selectedServices);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Select Services to Update</h2>
      
      <div className="mb-8">
        <p className="text-gray-600">
          Select the services you would like to update with your new address. We'll help you update each one efficiently.
        </p>
      </div>
      
      <div className="space-y-8">
        {serviceCategories.map(category => (
          <div key={category.id} className="border-b pb-6">
            <h3 className="text-xl font-medium mb-4">{category.name}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {category.services.map(service => (
                <div 
                  key={service.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    service.selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => toggleServiceSelection(category.id, service.id)}
                >
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={service.selected}
                      onChange={() => toggleServiceSelection(category.id, service.id)}
                      className="h-5 w-5 text-blue-600 mt-1"
                    />
                    <div className="ml-3">
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Continue with Selected Services
        </button>
      </div>
    </div>
  );
} 