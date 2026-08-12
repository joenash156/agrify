export interface Employee {
  employmentId: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  farmName: string;
  /** Job title within the farm (e.g. "Field Supervisor") — distinct from the app-level UserRole. */
  jobTitle: string;
  salary: number;
  hireDate: string;
  employmentStatus: "ACTIVE" | "TERMINATED" | "ON_LEAVE" | "SUSPENDED";
}
