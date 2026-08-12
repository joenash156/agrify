export interface Attendance {
  attendanceId: string;
  employmentId: string;
  employeeName: string;
  attendanceDate: string;
  checkIn: string | null;
  checkOut: string | null;
  attendanceStatus: "PRESENT" | "ABSENT" | "LATE" | "LEAVE";
}
