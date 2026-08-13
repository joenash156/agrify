package com.farmmanagement.dto;

import java.util.UUID;

import java.math.BigDecimal;

public class SaleDto {
    private UUID customerId;
    private UUID employmentId;
    private BigDecimal total;
    private String saleStatus;

    public SaleDto() {}

    public UUID getCustomerId() { return customerId; }
    public void setCustomerId(UUID customerId) { this.customerId = customerId; }
    public UUID getEmploymentId() { return employmentId; }
    public void setEmploymentId(UUID employmentId) { this.employmentId = employmentId; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    public String getSaleStatus() { return saleStatus; }
    public void setSaleStatus(String saleStatus) { this.saleStatus = saleStatus; }
}
