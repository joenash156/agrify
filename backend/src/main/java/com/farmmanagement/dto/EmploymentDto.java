package com.farmmanagement.dto;

import java.util.UUID;

import java.math.BigDecimal;
import java.time.LocalDate;

public class EmploymentDto {
    private UUID userId;
    private UUID farmId;
    private String role;
    private BigDecimal salary;
    private LocalDate hireDate;
    private String employmentStatus;

    public EmploymentDto() {}

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public UUID getFarmId() { return farmId; }
    public void setFarmId(UUID farmId) { this.farmId = farmId; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public BigDecimal getSalary() { return salary; }
    public void setSalary(BigDecimal salary) { this.salary = salary; }
    public LocalDate getHireDate() { return hireDate; }
    public void setHireDate(LocalDate hireDate) { this.hireDate = hireDate; }
    public String getEmploymentStatus() { return employmentStatus; }
    public void setEmploymentStatus(String employmentStatus) { this.employmentStatus = employmentStatus; }
}
