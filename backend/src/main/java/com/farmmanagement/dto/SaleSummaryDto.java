package com.farmmanagement.dto;

import java.util.UUID;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Sale joined with customer/staff names and item count — powers the Sales & Orders list page. */
public class SaleSummaryDto {
    private UUID saleId;
    private String publicId;
    private UUID customerId;
    private String customerName;
    private UUID employmentId;
    private String soldByName;
    private LocalDateTime saleDate;
    private BigDecimal total;
    private String saleStatus;
    private int itemCount;
    private boolean isVoided;
    private LocalDateTime voidedAt;
    private String voidedReason;
    private String voidedByName;

    public SaleSummaryDto() {}

    public SaleSummaryDto(UUID saleId, String publicId, UUID customerId, String customerName, UUID employmentId, String soldByName,
                           LocalDateTime saleDate, BigDecimal total, String saleStatus, int itemCount,
                           boolean isVoided, LocalDateTime voidedAt, String voidedReason, String voidedByName) {
        this.saleId = saleId;
        this.publicId = publicId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.employmentId = employmentId;
        this.soldByName = soldByName;
        this.saleDate = saleDate;
        this.total = total;
        this.saleStatus = saleStatus;
        this.itemCount = itemCount;
        this.isVoided = isVoided;
        this.voidedAt = voidedAt;
        this.voidedReason = voidedReason;
        this.voidedByName = voidedByName;
    }

    public UUID getSaleId() { return saleId; }
    public void setSaleId(UUID saleId) { this.saleId = saleId; }
    public String getPublicId() { return publicId; }
    public void setPublicId(String publicId) { this.publicId = publicId; }
    public UUID getCustomerId() { return customerId; }
    public void setCustomerId(UUID customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public UUID getEmploymentId() { return employmentId; }
    public void setEmploymentId(UUID employmentId) { this.employmentId = employmentId; }
    public String getSoldByName() { return soldByName; }
    public void setSoldByName(String soldByName) { this.soldByName = soldByName; }
    public LocalDateTime getSaleDate() { return saleDate; }
    public void setSaleDate(LocalDateTime saleDate) { this.saleDate = saleDate; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    public String getSaleStatus() { return saleStatus; }
    public void setSaleStatus(String saleStatus) { this.saleStatus = saleStatus; }
    public int getItemCount() { return itemCount; }
    public void setItemCount(int itemCount) { this.itemCount = itemCount; }
    public boolean isVoided() { return isVoided; }
    public void setVoided(boolean voided) { isVoided = voided; }
    public LocalDateTime getVoidedAt() { return voidedAt; }
    public void setVoidedAt(LocalDateTime voidedAt) { this.voidedAt = voidedAt; }
    public String getVoidedReason() { return voidedReason; }
    public void setVoidedReason(String voidedReason) { this.voidedReason = voidedReason; }
    public String getVoidedByName() { return voidedByName; }
    public void setVoidedByName(String voidedByName) { this.voidedByName = voidedByName; }
}
