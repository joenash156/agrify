export interface Equipment {
  equipmentId: string;
  farmId: string;
  farmName: string;
  equipmentName: string;
  equipmentType: string;
  purchaseDate: string;
  purchaseCost: number;
  equipmentStatus: "AVAILABLE" | "IN_USE" | "MAINTENANCE" | "BROKEN" | "RETIRED";
}
