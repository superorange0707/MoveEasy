import { NextResponse } from 'next/server';
import { ServiceManager } from '@/lib/services/serviceManager';
import { addressSchema } from '@/lib/db/schema';
import { z } from 'zod';

const updateAddressSchema = z.object({
  serviceId: z.string(),
  credentials: z.record(z.string()),
  oldAddress: addressSchema,
  newAddress: addressSchema,
});

const serviceManager = new ServiceManager();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = updateAddressSchema.parse(body);

    // Initialize service with credentials
    await serviceManager.initializeService(validatedData.serviceId, validatedData.credentials);

    // Validate credentials
    const isValid = await serviceManager.validateServiceCredentials(validatedData.serviceId);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid service credentials' },
        { status: 401 }
      );
    }

    // Update address
    const result = await serviceManager.updateAddress(
      validatedData.serviceId,
      validatedData.oldAddress,
      validatedData.newAddress
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      reference: result.reference,
    });
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      { error: 'Failed to process address update request' },
      { status: 500 }
    );
  }
} 