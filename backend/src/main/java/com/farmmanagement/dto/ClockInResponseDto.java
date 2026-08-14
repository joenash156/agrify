package com.farmmanagement.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class ClockInResponseDto {
    private String employeeName;
    private LocalDate attendanceDate;
    private LocalTime checkIn;

    public ClockInResponseDto() {}

    public ClockInResponseDto(String employeeName, LocalDate attendanceDate, LocalTime checkIn) {
        this.employeeName = employeeName;
        this.attendanceDate = attendanceDate;
        this.checkIn = checkIn;
    }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }
    public LocalDate getAttendanceDate() { return attendanceDate; }
    public void setAttendanceDate(LocalDate attendanceDate) { this.attendanceDate = attendanceDate; }
    public LocalTime getCheckIn() { return checkIn; }
    public void setCheckIn(LocalTime checkIn) { this.checkIn = checkIn; }
}
