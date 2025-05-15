'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import NavBar from '../components/NavBar';

// Dynamically import components with SSR disabled
const AddressForm = dynamic(() => import('../components/AddressForm'), { ssr: false });
const ChatInterface = dynamic(() => import('../components/ChatInterface'), { ssr: false });
const ServiceSelection = dynamic(() => import('../components/ServiceSelection'), { ssr: false });
const ProgressTracker = dynamic(() => import('../components/ProgressTracker'), { ssr: false });

type Address = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  additionalInfo?: string;
};

type Service = {
  id: string;
  name: string;
  category: string;
  logo?: string;
  description: string;
  selected: boolean;
};

type ServiceStatus = {
  id: string;
  name: string;
  category: string;
  status: 'pending' | 'completed' | 'failed';
  message?: string;
  lastUpdated: Date;
};

type Step = 'intro' | 'address' | 'services' | 'progress';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('intro');
  const [addresses, setAddresses] = useState<{ currentAddress: Address; newAddress: Address } | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [serviceStatuses, setServiceStatuses] = useState<ServiceStatus[]>([]);

  const handleAddressSubmit = (data: { currentAddress: Address; newAddress: Address }) => {
    setAddresses(data);
    setCurrentStep('services');
  };

  const handleServiceSelection = (services: Service[]) => {
    setSelectedServices(services);
    
    // Create initial service statuses
    const statuses = services.map(service => ({
      id: service.id,
      name: service.name,
      category: service.category,
      status: 'pending' as const,
      lastUpdated: new Date(),
    }));
    
    setServiceStatuses(statuses);
    setCurrentStep('progress');
    
    // Simulate service updates
    simulateServiceUpdates(statuses);
  };
  
  // Temporary function to simulate service updates
  const simulateServiceUpdates = (statuses: ServiceStatus[]) => {
    const updateQueue = [...statuses];
    
    const processNext = () => {
      if (updateQueue.length === 0) return;
      
      const service = updateQueue.shift();
      if (!service) return;
      
      // Randomly determine success or failure
      const success = Math.random() > 0.2;
      
      setTimeout(() => {
        setServiceStatuses(prev => 
          prev.map(s => {
            if (s.id === service.id) {
              return {
                ...s,
                status: success ? 'completed' : 'failed',
                message: success 
                  ? 'Successfully updated address' 
                  : 'Failed to update. Please try again.',
                lastUpdated: new Date(),
              };
            }
            return s;
          })
        );
        
        processNext();
      }, 2000 + Math.random() * 3000); // Random delay between 2-5 seconds
    };
    
    processNext();
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
        return <ServiceSelection onSubmit={handleServiceSelection} />;
        
      case 'progress':
        return <ProgressTracker services={serviceStatuses} />;
        
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
