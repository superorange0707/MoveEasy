import { Address } from '../db/schema';
import { AddressUpdateService, ServiceCredentials, ServiceUpdateResult } from './types';
import { BritishGasService } from './britishGas';

export class ServiceManager {
  private services: Map<string, AddressUpdateService>;

  constructor() {
    this.services = new Map();
    this.registerService(new BritishGasService());
  }

  private registerService(service: AddressUpdateService) {
    this.services.set(service.serviceId, service);
  }

  async initializeService(serviceId: string, credentials: ServiceCredentials): Promise<void> {
    const service = this.services.get(serviceId);
    if (!service) {
      throw new Error(`Service ${serviceId} not found`);
    }

    await service.initialize(credentials);
  }

  async validateServiceCredentials(serviceId: string): Promise<boolean> {
    const service = this.services.get(serviceId);
    if (!service) {
      throw new Error(`Service ${serviceId} not found`);
    }

    return service.validateCredentials();
  }

  async updateAddress(
    serviceId: string,
    oldAddress: Address,
    newAddress: Address
  ): Promise<ServiceUpdateResult> {
    const service = this.services.get(serviceId);
    if (!service) {
      throw new Error(`Service ${serviceId} not found`);
    }

    return service.updateAddress(oldAddress, newAddress);
  }

  async checkUpdateStatus(serviceId: string, reference: string): Promise<ServiceUpdateResult> {
    const service = this.services.get(serviceId);
    if (!service) {
      throw new Error(`Service ${serviceId} not found`);
    }

    return service.checkUpdateStatus(reference);
  }

  getRequiredCredentials(serviceId: string): string[] {
    const service = this.services.get(serviceId);
    if (!service) {
      throw new Error(`Service ${serviceId} not found`);
    }

    return service.getRequiredCredentials();
  }

  getAvailableServices(): Array<{
    id: string;
    name: string;
    category: string;
    requiredCredentials: string[];
  }> {
    return Array.from(this.services.values()).map(service => ({
      id: service.serviceId,
      name: service.serviceName,
      category: service.serviceCategory,
      requiredCredentials: service.getRequiredCredentials(),
    }));
  }
} 