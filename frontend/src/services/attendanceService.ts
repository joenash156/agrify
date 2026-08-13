import { createCrudService } from "./crudServiceFactory";
import type { Attendance } from "../types/attendance";

/** Raw shape from the backend — no joined employeeName (DAO doesn't join). */
export interface AttendanceRecordDto {
  attendanceId: string;
  employmentId: string;
  attendanceDate: string;
  checkIn: string | null;
  checkOut: string | null;
  attendanceStatus: Attendance["attendanceStatus"];
}

interface AttendanceCreateDto {
  employmentId: string;
  attendanceDate: string;
  checkIn: string | null;
  checkOut: string | null;
  attendanceStatus: Attendance["attendanceStatus"];
}

export const attendanceService = createCrudService<AttendanceRecordDto, AttendanceCreateDto>("/attendance");
