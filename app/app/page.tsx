'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import NavBar from '../components/NavBar';
import { Address } from '@/lib/db/schema';

// Dynamically import components with SSR disabled
const AddressForm = dynamic(() => import('../components/AddressForm'), { ssr: false });
const ChatInterface = dynamic(() => import('../components/ChatInterface'), { ssr: false });
const ServiceSelection = dynamic(() => import('../components/ServiceSelection'), { ssr: false });
const ProgressTracker = dynamic(() => import('../components/ProgressTracker'), { ssr: false });

type Step = 'intro' | 'address' | 'services' | 'progress';

type Service = {
  id: string;
  name: string;
  category: string;
  reference?: string;
  credentials?: Record<string, string>;
};

type ServiceStatus = {
  id: string;
  name: string;
  category: string;
  status: 'pending' | 'completed' | 'failed';
  message?: string;
  lastUpdated: Date;
};

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('intro');
  const [addresses, setAddresses] = useState<{ oldAddress: Address; newAddress: Address } | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [serviceStatuses, setServiceStatuses] = useState<ServiceStatus[]>([]);

  const handleAddressSubmit = (oldAddress: Address, newAddress: Address) => {
    setAddresses({ oldAddress, newAddress });
    setCurrentStep('services');
  };

  const handleServiceSelection = (services: Service[]) => {
    setSelectedServices(services);
    setCurrentStep('progress');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'intro':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Update Your Address Everywhere Without the Hassle
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  MoveEasy helps you update your address across all your services in one place.
                  Save time and avoid missing important mail or services.
                </p>
                <button
                  onClick={() => setCurrentStep('address')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Get Started
                </button>
              </div>
              <div className="p-6">
                <ChatInterface />
              </div>
            </div>
          </div>
        );
        
      case 'address':
        return <AddressForm onSubmit={handleAddressSubmit} />;
        
      case 'services':
        return addresses ? (
          <ServiceSelection
            onSubmit={handleServiceSelection}
            oldAddress={addresses.oldAddress}
            newAddress={addresses.newAddress}
          />
        ) : null;
        
      case 'progress':
        return <ProgressTracker services={selectedServices} />;
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        {renderStep()}
      </main>
    </div>
  );
}
