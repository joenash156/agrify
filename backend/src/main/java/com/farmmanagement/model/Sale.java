package com.farmmanagement.model;

import java.util.UUID;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Sale {
    private UUID saleId;
    /** Human-facing sequential reference (e.g. "SL-000001") — DB-generated, immutable once assigned. */
    private String publicId;
    private UUID customerId;
    private UUID employmentId;
    private LocalDateTime saleDate;
    private BigDecimal total;
    private String saleStatus;
    private boolean isVoided;
    private LocalDateTime voidedAt;
    private String voidedReason;
    private UUID voidedBy;

    public Sale() {}

    public UUID getSaleId() { return saleId; }
    public void setSaleId(UUID saleId) { this.saleId = saleId; }
    public String getPublicId() { return publicId; }
    public void setPublicId(String publicId) { this.publicId = publicId; }
    public UUID getCustomerId() { return customerId; }
    public void setCustomerId(UUID customerId) { this.customerId = customerId; }
    public UUID getEmploymentId() { return employmentId; }
    public void setEmploymentId(UUID employmentId) { this.employmentId = employmentId; }
    public LocalDateTime getSaleDate() { return saleDate; }
    public void setSaleDate(LocalDateTime saleDate) { this.saleDate = saleDate; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    public String getSaleStatus() { return saleStatus; }
    public void setSaleStatus(String saleStatus) { this.saleStatus = saleStatus; }
    public boolean isVoided() { return isVoided; }
    public void setVoided(boolean voided) { isVoided = voided; }
    public LocalDateTime getVoidedAt() { return voidedAt; }
    public void setVoidedAt(LocalDateTime voidedAt) { this.voidedAt = voidedAt; }
    public String getVoidedReason() { return voidedReason; }
    public void setVoidedReason(String voidedReason) { this.voidedReason = voidedReason; }
    public UUID getVoidedBy() { return voidedBy; }
    public void setVoidedBy(UUID voidedBy) { this.voidedBy = voidedBy; }
}
