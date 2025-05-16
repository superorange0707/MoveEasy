import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { BritishGasService } from '@/lib/services/britishGas';
import { Address as ServiceAddress } from '@/lib/db/schema';

type Address = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postcode: string;
};

type MoveRequest = {
  fromAddress: Address;
  toAddress: Address;
  services: string[];
};

function convertToServiceAddress(address: Address): ServiceAddress {
  return {
    id: `addr_${Date.now()}`,
    line1: address.line1,
    line2: address.line2,
    town: address.city,
    county: address.state,
    country: 'United Kingdom', // Default for UK services
    postcode: address.postcode,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function POST(request: NextRequest) {
  try {
    const data: MoveRequest = await request.json();
    
    // Validate the request data
    if (!data.fromAddress || !data.toAddress || !data.services) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert addresses to service format
    const fromServiceAddress = convertToServiceAddress(data.fromAddress);
    const toServiceAddress = convertToServiceAddress(data.toAddress);

    // Initialize services
    const serviceInstances = {
      'electric': new BritishGasService(),
      // Add other services here as they are implemented
    };

    // Start the move process for each selected service
    const results = await Promise.all(
      data.services.map(async (serviceId) => {
        const service = serviceInstances[serviceId as keyof typeof serviceInstances];
        if (!service) {
          return {
            serviceId,
            success: false,
            message: 'Service not implemented yet',
          };
        }

        try {
          // Initialize the service
          await service.initialize({
            // Add any required credentials here
            // This would typically come from a secure storage or user input
            accountNumber: process.env.BRITISH_GAS_ACCOUNT || '',
            password: process.env.BRITISH_GAS_PASSWORD || '',
          });

          // Update the address
          const result = await service.updateAddress(
            fromServiceAddress,
            toServiceAddress
          );

          return {
            serviceId,
            ...result,
          };
        } catch (error) {
          console.error(`Error updating address for service ${serviceId}:`, error);
          return {
            serviceId,
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred',
          };
        } finally {
          // Clean up service resources
          await service.cleanup();
        }
      })
    );

    // Store the move in the database
    // This would typically be handled by a database service
    const move = {
      id: Date.now().toString(),
      fromAddress: data.fromAddress,
      toAddress: data.toAddress,
      services: results,
      createdAt: new Date(),
      status: 'in_progress',
    };

    return NextResponse.json(move);
  } catch (error) {
    console.error('Error processing move request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 