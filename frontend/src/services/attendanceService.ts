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

// Attendance is otherwise an append-only log once recorded — the one exception is
// checkOut(), a self-service action that closes out the caller's own open record.
export const attendanceService = {
  findAll: async (): Promise<AttendanceRecordDto[]> => (await httpClient.get<AttendanceRecordDto[]>(BASE_PATH)).data,
  create: async (payload: AttendanceCreateDto): Promise<AttendanceRecordDto> =>
    (await httpClient.post<AttendanceRecordDto>(BASE_PATH, payload)).data,
  clockIn: async (username: string): Promise<ClockInResponse> =>
    (await httpClient.post<ClockInResponse>(`${BASE_PATH}/clock-in`, { username })).data,
  checkOut: async (attendanceId: string): Promise<AttendanceRecordDto> =>
    (await httpClient.put<AttendanceRecordDto>(`${BASE_PATH}/${attendanceId}/check-out`, {})).data,
};
