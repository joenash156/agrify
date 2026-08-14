package com.farmmanagement.dao;

import java.util.UUID;

import com.farmmanagement.dto.SaleSummaryDto;
import com.farmmanagement.model.Sale;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SaleDao {
    List<Sale> findAll();
    Optional<Sale> findById(UUID id);
    /** employmentId null → all sales (admin/manager); non-null → only that employment's sales (sales person). */
    List<SaleSummaryDto> findAllWithDetails(UUID employmentId);
    Sale save(Sale item);
    boolean update(UUID id, Sale item);
    boolean delete(UUID id);
    void voidSale(UUID saleId, String reason, UUID voidedByUserId, LocalDateTime voidedAt);
}
