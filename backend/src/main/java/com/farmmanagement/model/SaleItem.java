package com.farmmanagement.model;

import java.util.UUID;

import java.math.BigDecimal;

public class SaleItem {
    private UUID saleItemId;
    private UUID saleId;
    private UUID inventoryId;
    private BigDecimal quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;

    public SaleItem() {}

    public UUID getSaleItemId() { return saleItemId; }
    public void setSaleItemId(UUID saleItemId) { this.saleItemId = saleItemId; }
    public UUID getSaleId() { return saleId; }
    public void setSaleId(UUID saleId) { this.saleId = saleId; }
    public UUID getInventoryId() { return inventoryId; }
    public void setInventoryId(UUID inventoryId) { this.inventoryId = inventoryId; }
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
}
