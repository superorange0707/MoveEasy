'use client';

import { CheckIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/solid';

type ServiceStatus = {
  id: string;
  name: string;
  category: string;
  status: 'pending' | 'completed' | 'failed';
  message?: string;
  lastUpdated: Date;
};

// Helper function for consistent time formatting
const formatDateTime = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

type ProgressTrackerProps = {
  services: ServiceStatus[];
};

export default function ProgressTracker({ services }: ProgressTrackerProps) {
  // Calculate progress statistics
  const totalServices = services.length;
  const completedServices = services.filter(s => s.status === 'completed').length;
  const pendingServices = services.filter(s => s.status === 'pending').length;
  const failedServices = services.filter(s => s.status === 'failed').length;
  
  const progressPercentage = Math.round((completedServices / totalServices) * 100) || 0;
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Address Change Progress</h2>
      
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-gray-700 font-medium">Overall Progress</span>
          <span className="text-gray-700 font-medium">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between mt-4 text-sm">
          <div className="text-center">
            <div className="text-gray-500">Total</div>
            <div className="font-semibold text-gray-800 text-lg">{totalServices}</div>
          </div>
          <div className="text-center">
            <div className="text-green-500">Completed</div>
            <div className="font-semibold text-green-600 text-lg">{completedServices}</div>
          </div>
          <div className="text-center">
            <div className="text-blue-500">Pending</div>
            <div className="font-semibold text-blue-600 text-lg">{pendingServices}</div>
          </div>
          <div className="text-center">
            <div className="text-red-500">Failed</div>
            <div className="font-semibold text-red-600 text-lg">{failedServices}</div>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-6">
        <h3 className="text-xl font-medium mb-4">Service Updates</h3>
        
        <div className="space-y-4">
          {services.map(service => (
            <div 
              key={service.id}
              className="border rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center">
                    {service.status === 'completed' && (
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                    )}
                    {service.status === 'pending' && (
                      <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
                    )}
                    {service.status === 'failed' && (
                      <XMarkIcon className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <h4 className="font-medium">{service.name}</h4>
                  </div>
                  {service.message && (
                    <p className="text-sm text-gray-600 mt-1 ml-7">{service.message}</p>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDateTime(service.lastUpdated)}
                </div>
              </div>
              
              {service.status === 'failed' && (
                <div className="mt-3 flex justify-end">
                  <button
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 