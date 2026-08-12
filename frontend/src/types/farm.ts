export interface Farm {
  farmId: string;
  farmName: string;
  location: string;
  size: number; // hectares
  farmStatus: "ACTIVE" | "SEASONAL" | "INACTIVE" | "FALLOW";
  employeeCount?: number;
  cropCount?: number;
  createdAt: string;
  updatedAt: string;
}
