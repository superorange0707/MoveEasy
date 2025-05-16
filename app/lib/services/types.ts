import { Address } from '../db/schema';

export type ServiceCredentials = {
  username?: string;
  password?: string;
  apiKey?: string;
  accountNumber?: string;
  [key: string]: string | undefined;
};

export type ServiceUpdateResult = {
  success: boolean;
  message: string;
  error?: Error;
  reference?: string;
  screenshotUrl?: string;
  requiresUserVerification?: boolean;
  verificationUrl?: string;
};

export type FormField = {
  id?: string;
  name?: string;
  label?: string;
  type: string;
  selector: string;
  value: string;
};

export type ServiceWebForm = {
  url: string;
  loginForm?: {
    url: string;
    fields: FormField[];
    submitSelector: string;
  };
  addressForm: {
    url: string;
    fields: FormField[];
    submitSelector: string;
  };
  verificationRequired: boolean;
  verificationForm?: {
    url: string;
    fields: FormField[];
    submitSelector: string;
  };
};

export interface AddressUpdateService {
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  integrationType: 'api' | 'rpa' | 'manual';
  
  // Initialize service with credentials
  initialize(credentials: ServiceCredentials): Promise<void>;
  
  // Validate credentials before attempting update
  validateCredentials(): Promise<boolean>;
  
  // Update address with the service
  updateAddress(oldAddress: Address, newAddress: Address): Promise<ServiceUpdateResult>;
  
  // Check status of an update
  checkUpdateStatus(reference: string): Promise<ServiceUpdateResult>;
  
  // Get required credentials for this service
  getRequiredCredentials(): string[];
}

export interface RPAAddressUpdateService extends AddressUpdateService {
  // Get web form configuration
  getWebForm(): ServiceWebForm;
  
  // Analyze web page structure
  analyzeFormStructure(url: string): Promise<FormField[]>;
  
  // Fill form with provided data
  fillForm(form: ServiceWebForm, data: Record<string, string>): Promise<void>;
  
  // Take screenshot of the form
  captureFormScreenshot(): Promise<string>;
  
  // Handle user verification
  handleUserVerification(verificationData: Record<string, string>): Promise<ServiceUpdateResult>;
  
  // Get current browser page URL
  getCurrentUrl(): Promise<string>;
  
  // Close browser session
  cleanup(): Promise<void>;
} 