package com.farmmanagement.model;

import java.util.UUID;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Payment {
    private UUID paymentId;
    /** Human-facing sequential reference (e.g. "PAY-000001") — DB-generated, immutable once assigned. */
    private String publicId;
    private UUID saleId;
    private BigDecimal amount;
    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime paymentDate;

    public Payment() {}

    public UUID getPaymentId() { return paymentId; }
    public void setPaymentId(UUID paymentId) { this.paymentId = paymentId; }
    public String getPublicId() { return publicId; }
    public void setPublicId(String publicId) { this.publicId = publicId; }
    public UUID getSaleId() { return saleId; }
    public void setSaleId(UUID saleId) { this.saleId = saleId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }
}
