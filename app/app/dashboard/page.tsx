'use client';

import { useState } from 'react';
import NavBar from '../../components/NavBar';
import dynamic from 'next/dynamic';

const ProgressTracker = dynamic(() => import('../../components/ProgressTracker'), { ssr: false });

type ServiceStatus = {
  id: string;
  name: string;
  category: string;
  status: 'pending' | 'completed' | 'failed';
  message?: string;
  lastUpdated: Date;
};

export default function Dashboard() {
  const [serviceStatuses, setServiceStatuses] = useState<ServiceStatus[]>([
    {
      id: 'electric',
      name: 'Electricity Provider',
      category: 'utilities',
      status: 'completed',
      message: 'Address updated successfully',
      lastUpdated: new Date(Date.now() - 86400000 * 2), // 2 days ago
    },
    {
      id: 'water',
      name: 'Water Service',
      category: 'utilities',
      status: 'pending',
      lastUpdated: new Date(Date.now() - 86400000 * 1), // 1 day ago
    },
    {
      id: 'usps',
      name: 'USPS Mail Forwarding',
      category: 'postal',
      status: 'completed',
      message: 'Mail forwarding activated',
      lastUpdated: new Date(Date.now() - 86400000 * 3), // 3 days ago
    },
    {
      id: 'bank',
      name: 'Banking Services',
      category: 'financial',
      status: 'failed',
      message: 'Authentication failed. Please try again.',
      lastUpdated: new Date(),
    },
  ]);

  // Previous addresses
  const previousMoves = [
    {
      id: 1,
      fromAddress: '123 Old Street, Previous City, PC 12345',
      toAddress: '456 Current Avenue, Current City, CC 67890',
      moveDate: 'January 15, 2024',
      servicesUpdated: 12,
    },
    {
      id: 2,
      fromAddress: '789 Past Lane, Former Town, FT 11223',
      toAddress: '123 Old Street, Previous City, PC 12345',
      moveDate: 'March 5, 2022',
      servicesUpdated: 8,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Current Move</h2>
                <div className="flex justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-500">From</p>
                    <p className="font-medium">123 Old Street, Previous City, PC 12345</p>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">To</p>
                    <p className="font-medium">456 Current Avenue, Current City, CC 67890</p>
                  </div>
                </div>
                
                <ProgressTracker services={serviceStatuses} />
              </div>
              
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Previous Moves</h2>
                {previousMoves.map(move => (
                  <div key={move.id} className="border-b last:border-0 py-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Move on {move.moveDate}</span>
                      <span className="text-sm text-gray-500">{move.servicesUpdated} services updated</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div>
                        <p className="text-gray-500">From</p>
                        <p>{move.fromAddress}</p>
                      </div>
                      <div className="flex items-center mx-4">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-500">To</p>
                        <p>{move.toAddress}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-4">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Start New Move
                  </button>
                  <button className="w-full bg-white text-blue-600 border border-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Retry Failed Updates
                  </button>
                  <button className="w-full bg-white text-gray-600 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Export Service List
                  </button>
                </div>
              </div>
              
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-1">Update Your Tax Information</h3>
                    <p className="text-sm text-gray-600">Moving to a new state? Don't forget to update your tax information with the IRS.</p>
                    <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">Add to My Services</button>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-1">Vehicle Registration</h3>
                    <p className="text-sm text-gray-600">Your vehicle registration may need to be updated with your new address.</p>
                    <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">Add to My Services</button>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-1">Voter Registration</h3>
                    <p className="text-sm text-gray-600">Don't forget to update your voter registration for upcoming elections.</p>
                    <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">Add to My Services</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 