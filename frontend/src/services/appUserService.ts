import { createCrudService } from "./crudServiceFactory";

export interface AppUser {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  otherPhoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export const appUserService = createCrudService<AppUser>("/appuser");
