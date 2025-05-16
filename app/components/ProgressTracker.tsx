'use client';

import { useState, useEffect } from 'react';
import { CheckIcon, ClockIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { ServiceUpdateResult } from '@/lib/services/types';

type Service = {
  id: string;
  name: string;
  category: string;
  reference?: string;
  credentials?: Record<string, string>;
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
  services: Service[];
};

export default function ProgressTracker({ services }: ProgressTrackerProps) {
  const [serviceStatuses, setServiceStatuses] = useState<Record<string, ServiceUpdateResult>>({});
  const [isPolling, setIsPolling] = useState(true);

  useEffect(() => {
    // Initialize statuses
    const initialStatuses: Record<string, ServiceUpdateResult> = {};
    services.forEach(service => {
      initialStatuses[service.id] = {
        success: false,
        message: 'Waiting to start...',
      };
    });
    setServiceStatuses(initialStatuses);

    // Start polling for updates
    const pollInterval = setInterval(async () => {
      let allCompleted = true;

      for (const service of services) {
        if (!service.reference) continue;

        try {
          const response = await fetch('/api/services/check-status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              serviceId: service.id,
              reference: service.reference,
            }),
          });

          const data = await response.json();

          setServiceStatuses(prev => ({
            ...prev,
            [service.id]: data,
          }));

          if (!data.success) {
            allCompleted = false;
          }
        } catch (error) {
          console.error(`Failed to check status for ${service.name}:`, error);
          allCompleted = false;
        }
      }

      if (allCompleted) {
        setIsPolling(false);
        clearInterval(pollInterval);
      }
    }, 5000); // Poll every 5 seconds

    return () => {
      clearInterval(pollInterval);
      setIsPolling(false);
    };
  }, [services]);

  const getStatusIcon = (status: ServiceUpdateResult) => {
    if (status.success) {
      return <CheckIcon className="w-5 h-5 text-green-500" />;
    }
    if (status.error) {
      return <XMarkIcon className="w-5 h-5 text-red-500" />;
    }
    return <ClockIcon className="w-5 h-5 text-yellow-500 animate-pulse" />;
  };

  const getStatusColor = (status: ServiceUpdateResult) => {
    if (status.success) return 'bg-green-50 border-green-200 text-green-700';
    if (status.error) return 'bg-red-50 border-red-200 text-red-700';
    return 'bg-yellow-50 border-yellow-200 text-yellow-700';
  };

  const getStatusText = (status: ServiceUpdateResult) => {
    if (status.success) return 'Completed';
    if (status.error) return 'Failed';
    return 'In Progress';
  };

  const handleRetry = async (serviceId: string) => {
    try {
      const response = await fetch('/api/services/retry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId,
          reference: services.find(s => s.id === serviceId)?.reference,
        }),
      });

      if (response.ok) {
        setServiceStatuses(prev => ({
          ...prev,
          [serviceId]: {
            success: false,
            message: 'Retrying update...',
          },
        }));
        setIsPolling(true);
      }
    } catch (error) {
      console.error('Failed to retry service:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Address Update Progress</h2>
          {isPolling && (
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
              Checking status every 5 seconds...
            </div>
          )}
        </div>

        <div className="divide-y divide-gray-200">
          {services.map(service => {
            const status = serviceStatuses[service.id] || { success: false };
            return (
              <div key={service.id} className={`p-6 ${getStatusColor(status)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                      <p className="text-sm mt-1">
                        {status.message || 'Initializing...'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {status.error && (
                      <button
                        onClick={() => handleRetry(service.id)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <ArrowPathIcon className="w-4 h-4 mr-1" />
                        Retry
                      </button>
                    )}
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      status.success ? 'bg-green-100 text-green-800' :
                      status.error ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {getStatusText(status)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!isPolling && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-green-700">
                <CheckIcon className="w-5 h-5 mr-2" />
                <p className="text-sm font-medium">
                  All updates completed successfully
                </p>
              </div>
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => window.location.href = '/dashboard'}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 