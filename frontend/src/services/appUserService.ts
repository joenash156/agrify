import { createCrudService } from "./crudServiceFactory";

export interface AppUser {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  otherPhoneNumber: string;
  /** Kept in sync with their employment record — null until they've ever been employed. */
  workingStatus: "ACTIVE" | "ON_LEAVE" | "SUSPENDED" | "TERMINATED" | null;
  createdAt: string;
  updatedAt: string;
}

export const appUserService = createCrudService<AppUser>("/appuser");
