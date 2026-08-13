package com.farmmanagement.dto;

import java.util.UUID;

import java.time.LocalDate;
import java.time.LocalTime;

public class AttendanceDto {
    private UUID employmentId;
    private LocalDate attendanceDate;
    private LocalTime checkIn;
    private LocalTime checkOut;
    private String attendanceStatus;

    public AttendanceDto() {}

    public UUID getEmploymentId() { return employmentId; }
    public void setEmploymentId(UUID employmentId) { this.employmentId = employmentId; }
    public LocalDate getAttendanceDate() { return attendanceDate; }
    public void setAttendanceDate(LocalDate attendanceDate) { this.attendanceDate = attendanceDate; }
    public LocalTime getCheckIn() { return checkIn; }
    public void setCheckIn(LocalTime checkIn) { this.checkIn = checkIn; }
    public LocalTime getCheckOut() { return checkOut; }
    public void setCheckOut(LocalTime checkOut) { this.checkOut = checkOut; }
    public String getAttendanceStatus() { return attendanceStatus; }
    public void setAttendanceStatus(String attendanceStatus) { this.attendanceStatus = attendanceStatus; }
}
