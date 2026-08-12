import type { Attendance } from "../types/attendance";
import type { StatCardData } from "../types/dashboard";
import { faCircleCheck, faClock, faTriangleExclamation, faUserClock } from "@fortawesome/free-solid-svg-icons";

export const MOCK_ATTENDANCE: Attendance[] = [
  { attendanceId: "att-001", employmentId: "emp-101", employeeName: "Ama Serwaa", attendanceDate: "2026-08-12", checkIn: "08:02", checkOut: "17:05", attendanceStatus: "PRESENT" },
  { attendanceId: "att-002", employmentId: "emp-102", employeeName: "Yaw Owusu", attendanceDate: "2026-08-12", checkIn: "08:45", checkOut: "17:10", attendanceStatus: "LATE" },
  { attendanceId: "att-003", employmentId: "emp-103", employeeName: "Kwabena Owusu-Ansah", attendanceDate: "2026-08-12", checkIn: "07:58", checkOut: "16:50", attendanceStatus: "PRESENT" },
  { attendanceId: "att-004", employmentId: "emp-104", employeeName: "Akosua Nyarko", attendanceDate: "2026-08-12", checkIn: null, checkOut: null, attendanceStatus: "LEAVE" },
  { attendanceId: "att-005", employmentId: "emp-105", employeeName: "Kojo Antwi", attendanceDate: "2026-08-12", checkIn: null, checkOut: null, attendanceStatus: "ABSENT" },
  { attendanceId: "att-006", employmentId: "emp-106", employeeName: "Adjoa Boateng", attendanceDate: "2026-08-11", checkIn: "08:10", checkOut: "17:00", attendanceStatus: "PRESENT" },
];

export const ATTENDANCE_STATS: StatCardData[] = [
  { id: "present", title: "Present Today", value: 2, trend: "neutral", subtitle: "Out of 5 tracked", icon: faCircleCheck, accentColor: "teal" },
  { id: "late", title: "Late Check-ins", value: 1, trend: "down", subtitle: "Today", icon: faClock, accentColor: "amber" },
  { id: "absent", title: "Absent Today", value: 1, trend: "down", subtitle: "Unreported absence", icon: faTriangleExclamation, accentColor: "rose" },
  { id: "leave", title: "On Leave", value: 1, trend: "neutral", subtitle: "Approved leave", icon: faUserClock, accentColor: "blue" },
];
