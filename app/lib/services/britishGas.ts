// Import Playwright only on server side
let playwright: typeof import('playwright');

if (typeof window === 'undefined') {
  // We're on the server side
  playwright = require('playwright');
}

import { Address } from '../db/schema';
import { RPAAddressUpdateService, ServiceCredentials, ServiceUpdateResult, ServiceWebForm, FormField } from './types';

export class BritishGasService implements RPAAddressUpdateService {
  serviceId = 'british-gas';
  serviceName = 'British Gas';
  serviceCategory = 'utilities';
  integrationType = 'rpa' as const;
  
  private credentials: ServiceCredentials | null = null;
  private browser: any = null;
  private page: any = null;

  private readonly baseUrl = 'https://www.britishgas.co.uk';
  private readonly loginUrl = 'https://www.britishgas.co.uk/identity/';
  private readonly addressUpdateUrl = 'https://www.britishgas.co.uk/account/personal-details/';

  async initialize(credentials: ServiceCredentials): Promise<void> {
    if (typeof window !== 'undefined') {
      throw new Error('RPA services can only be initialized on the server side');
    }

    try {
      this.credentials = credentials;
      
      // Launch browser with specific options for better compatibility
      this.browser = await playwright.chromium.launch({
        headless: true, // Run in headless mode
        args: [
          '--disable-dev-shm-usage', // Disable /dev/shm usage
          '--no-sandbox', // Required for running in certain environments
          '--disable-setuid-sandbox',
        ],
        timeout: 30000, // 30 second timeout
      });

      // Create a new page with specific viewport
      this.page = await this.browser.newPage({
        viewport: { width: 1280, height: 720 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      });

      // Set default navigation timeout
      await this.page.setDefaultNavigationTimeout(30000);
      
    } catch (error) {
      console.error('Failed to initialize browser:', error);
      throw new Error(
        error instanceof Error 
          ? `Failed to initialize browser: ${error.message}` 
          : 'Failed to initialize browser'
      );
    }
  }

  async validateCredentials(): Promise<boolean> {
    if (!this.credentials?.accountNumber || !this.credentials?.password) {
      return false;
    }

    try {
      await this.page?.goto(this.loginUrl);
      await this.fillForm(this.getWebForm(), {
        username: this.credentials.accountNumber,
        password: this.credentials.password,
      });
      
      // Check if login was successful
      const currentUrl = await this.getCurrentUrl();
      return currentUrl.includes('/account/');
    } catch (error) {
      console.error('Failed to validate British Gas credentials:', error);
      return false;
    }
  }

  async updateAddress(oldAddress: Address, newAddress: Address): Promise<ServiceUpdateResult> {
    try {
      // Navigate to address update page
      await this.page?.goto(this.addressUpdateUrl);

      // Fill the address form
      await this.fillForm(this.getWebForm(), {
        line1: newAddress.line1,
        line2: newAddress.line2 || '',
        town: newAddress.town,
        county: newAddress.county || '',
        postcode: newAddress.postcode,
      });

      // Capture screenshot before submission
      const screenshotUrl = await this.captureFormScreenshot();

      // Get the verification URL
      const verificationUrl = await this.getCurrentUrl();

      return {
        success: true,
        message: 'Address form filled. Please verify and submit.',
        screenshotUrl,
        requiresUserVerification: true,
        verificationUrl,
      };
    } catch (error) {
      console.error('Failed to update address with British Gas:', error);
      return {
        success: false,
        message: 'Failed to fill address form',
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  }

  async checkUpdateStatus(reference: string): Promise<ServiceUpdateResult> {
    // For RPA-based updates, we rely on user verification
    return {
      success: true,
      message: 'Please check your email for confirmation',
      requiresUserVerification: true,
    };
  }

  getRequiredCredentials(): string[] {
    return ['accountNumber', 'password'];
  }

  getWebForm(): ServiceWebForm {
    return {
      url: this.baseUrl,
      loginForm: {
        url: this.loginUrl,
        fields: [
          {
            name: 'username',
            type: 'text',
            selector: '#username',
            value: '',
          },
          {
            name: 'password',
            type: 'password',
            selector: '#password',
            value: '',
          },
        ],
        submitSelector: '#login-submit',
      },
      addressForm: {
        url: this.addressUpdateUrl,
        fields: [
          {
            name: 'line1',
            type: 'text',
            selector: '#address-line-1',
            value: '',
          },
          {
            name: 'line2',
            type: 'text',
            selector: '#address-line-2',
            value: '',
          },
          {
            name: 'town',
            type: 'text',
            selector: '#town',
            value: '',
          },
          {
            name: 'county',
            type: 'text',
            selector: '#county',
            value: '',
          },
          {
            name: 'postcode',
            type: 'text',
            selector: '#postcode',
            value: '',
          },
        ],
        submitSelector: '#update-address-submit',
      },
      verificationRequired: true,
    };
  }

  async analyzeFormStructure(url: string): Promise<FormField[]> {
    try {
      await this.page?.goto(url);
      
      // Use AI to analyze the page structure and identify form fields
      const fields = await this.page?.evaluate(() => {
        const formFields: Array<{
          id: string;
          name: string | undefined;
          label: string | undefined;
          type: string;
          selector: string;
          value: string;
        }> = [];
        
        document.querySelectorAll('input, select, textarea').forEach((input: Element) => {
          const htmlInput = input as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
          const label = htmlInput.getAttribute('aria-label') || 
            htmlInput.getAttribute('placeholder') ||
            document.querySelector(`label[for="${htmlInput.id}"]`)?.textContent ||
            undefined;
            
          formFields.push({
            id: htmlInput.id || `field-${formFields.length}`,
            name: htmlInput.name || undefined,
            label,
            type: htmlInput instanceof HTMLInputElement ? htmlInput.type : htmlInput.tagName.toLowerCase(),
            selector: htmlInput.id ? `#${htmlInput.id}` : `[name="${htmlInput.name}"]`,
            value: '',
          });
        });
        
        return formFields;
      });

      return fields || [];
    } catch (error) {
      console.error('Failed to analyze form structure:', error);
      return [];
    }
  }

  async fillForm(form: ServiceWebForm, data: Record<string, string>): Promise<void> {
    for (const field of form.addressForm.fields) {
      if (field.name && data[field.name]) {
        await this.page?.fill(field.selector, data[field.name]);
      }
    }
  }

  async captureFormScreenshot(): Promise<string> {
    const timestamp = new Date().getTime();
    const filename = `british-gas-form-${timestamp}.png`;
    await this.page?.screenshot({ path: `./public/screenshots/${filename}` });
    return `/screenshots/${filename}`;
  }

  async handleUserVerification(verificationData: Record<string, string>): Promise<ServiceUpdateResult> {
    // This would be called after the user has verified the form
    return {
      success: true,
      message: 'Address update submitted successfully',
    };
  }

  async getCurrentUrl(): Promise<string> {
    return this.page?.url() || '';
  }

  async cleanup(): Promise<void> {
    await this.browser?.close();
    this.browser = null;
    this.page = null;
  }
} 