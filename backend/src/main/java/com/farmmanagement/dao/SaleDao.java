package com.farmmanagement.dao;

import java.util.UUID;

import com.farmmanagement.dto.SaleSummaryDto;
import com.farmmanagement.model.Sale;
import java.util.List;
import java.util.Optional;

public interface SaleDao {
    List<Sale> findAll();
    Optional<Sale> findById(UUID id);
    List<SaleSummaryDto> findAllWithDetails();
    Sale save(Sale item);
    boolean update(UUID id, Sale item);
    boolean delete(UUID id);
}
