import { createCrudService } from "./crudServiceFactory";

export interface Customer {
  customerId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  address: string;
}

interface CustomerDto {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  address: string;
}

export const customerService = createCrudService<Customer, CustomerDto>("/customer");
