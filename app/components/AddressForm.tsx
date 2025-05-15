'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

type AddressData = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  additionalInfo?: string;
};

type AddressFormProps = {
  onSubmit: (data: { currentAddress: AddressData; newAddress: AddressData }) => void;
};

export default function AddressForm({ onSubmit }: AddressFormProps) {
  const [step, setStep] = useState<'current' | 'new'>('current');
  const [currentAddress, setCurrentAddress] = useState<AddressData | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<AddressData>();
  
  const onCurrentAddressSubmit = (data: AddressData) => {
    setCurrentAddress(data);
    setStep('new');
  };
  
  const onNewAddressSubmit = (data: AddressData) => {
    if (currentAddress) {
      onSubmit({ currentAddress, newAddress: data });
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {step === 'current' ? 'Enter Your Current Address' : 'Enter Your New Address'}
      </h2>
      
      <form onSubmit={handleSubmit(step === 'current' ? onCurrentAddressSubmit : onNewAddressSubmit)}>
        <div className="space-y-4">
          <div>
            <label htmlFor="street" className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              type="text"
              id="street"
              {...register('street', { required: 'Street address is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                {...register('city', { required: 'City is required' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
            </div>
            
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                id="state"
                {...register('state', { required: 'State is required' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                ZIP Code
              </label>
              <input
                type="text"
                id="zipCode"
                {...register('zipCode', { required: 'ZIP code is required' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>}
            </div>
            
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                id="country"
                {...register('country', { required: 'Country is required' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
            </div>
          </div>
          
          <div>
            <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700">
              Additional Information (optional)
            </label>
            <textarea
              id="additionalInfo"
              {...register('additionalInfo')}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex justify-end">
            {step === 'new' && (
              <button
                type="button"
                onClick={() => setStep('current')}
                className="mr-4 bg-gray-200 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {step === 'current' ? 'Next' : 'Submit'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 