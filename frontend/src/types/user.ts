export type UserRole = "ADMIN" | "FARM_MANAGER" | "SALES_PERSON" | "WORKER";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  farmName?: string;
}

export interface UserAccount {
  accountId: string;
  userId: string;
  username: string;
  accountStatus: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}
