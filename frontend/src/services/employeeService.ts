import { createCrudService } from "./crudServiceFactory";
import type { Employee } from "../types/employee";

/** Raw shape from the backend — no joined first/last name, email, farmName (DAO doesn't join). */
export interface EmploymentRecordDto {
  employmentId: string;
  userId: string;
  farmId: string;
  role: string;
  salary: number;
  hireDate: string;
  employmentStatus: Employee["employmentStatus"];
}

interface EmploymentCreateDto {
  userId: string;
  farmId: string;
  role: string;
  salary: number;
  hireDate: string;
  employmentStatus: Employee["employmentStatus"];
}

export const employeeService = createCrudService<EmploymentRecordDto, EmploymentCreateDto>("/employment");
