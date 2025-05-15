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
  // Sample service data structure with UK-specific providers
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
    const selectedServices = serviceCategories.flatMap(category =>
      category.services.filter(service => service.selected)
    );
    onSubmit(selectedServices);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {serviceCategories.map(category => (
          <div key={category.id} className="border-b last:border-b-0">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.services.map(service => (
                  <div
                    key={service.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      service.selected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => toggleServiceSelection(category.id, service.id)}
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <h3 className="font-medium">{service.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {service.description}
                        </p>
                      </div>
                      <div className="ml-4">
                        <input
                          type="checkbox"
                          checked={service.selected}
                          onChange={() => toggleServiceSelection(category.id, service.id)}
                          className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Continue
        </button>
      </div>
    </div>
  );
} 