package com.farmmanagement.dto;

import java.util.UUID;

import java.math.BigDecimal;

public class PaymentDto {
    private UUID saleId;
    private BigDecimal amount;
    private String paymentMethod;
    private String paymentStatus;

    public PaymentDto() {}

    public UUID getSaleId() { return saleId; }
    public void setSaleId(UUID saleId) { this.saleId = saleId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
}
