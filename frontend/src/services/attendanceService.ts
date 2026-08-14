import { httpClient } from "./httpClient";
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

export interface ClockInResponse {
  employeeName: string;
  attendanceDate: string;
  checkIn: string;
}

const BASE_PATH = "/attendance";

// No update/remove — attendance is an append-only log once recorded (backend has no
// PUT/DELETE routes for it), matching the "view only after recording" product rule.
export const attendanceService = {
  findAll: async (): Promise<AttendanceRecordDto[]> => (await httpClient.get<AttendanceRecordDto[]>(BASE_PATH)).data,
  create: async (payload: AttendanceCreateDto): Promise<AttendanceRecordDto> =>
    (await httpClient.post<AttendanceRecordDto>(BASE_PATH, payload)).data,
  clockIn: async (username: string): Promise<ClockInResponse> =>
    (await httpClient.post<ClockInResponse>(`${BASE_PATH}/clock-in`, { username })).data,
};
