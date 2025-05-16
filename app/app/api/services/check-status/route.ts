import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { BritishGasService } from '@/lib/services/britishGas';

type StatusRequest = {
  serviceId: string;
  reference: string;
};

export async function POST(request: NextRequest) {
  try {
    const data: StatusRequest = await request.json();
    
    // Validate the request data
    if (!data.serviceId || !data.reference) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize the appropriate service
    const serviceInstances = {
      'electric': new BritishGasService(),
      // Add other services here as they are implemented
    };

    const service = serviceInstances[data.serviceId as keyof typeof serviceInstances];
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    try {
      // Initialize the service
      await service.initialize({
        // Add any required credentials here
        accountNumber: process.env.BRITISH_GAS_ACCOUNT || '',
        password: process.env.BRITISH_GAS_PASSWORD || '',
      });

      // Check the status
      const result = await service.checkUpdateStatus(data.reference);

      return NextResponse.json(result);
    } catch (error) {
      console.error(`Error checking status for service ${data.serviceId}:`, error);
      return NextResponse.json(
        {
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        },
        { status: 500 }
      );
    } finally {
      // Clean up service resources
      await service.cleanup();
    }
  } catch (error) {
    console.error('Error processing status check request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 