package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.SaleDao;
import com.farmmanagement.dto.SaleDto;
import com.farmmanagement.dto.SaleSummaryDto;
import com.farmmanagement.model.Sale;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SaleService {
    private final SaleDao dao;
    public SaleService(SaleDao dao) { this.dao = dao; }
    public List<Sale> findAll() { return dao.findAll(); }
    public List<SaleSummaryDto> findAllWithDetails() { return dao.findAllWithDetails(); }
    public Sale findById(UUID id) { return dao.findById(id).orElseThrow(() -> new RuntimeException("Sale not found")); }
    public Sale create(SaleDto dto) {
        Sale item = new Sale();
        item.setSaleId(java.util.UUID.randomUUID());
        item.setCustomerId(dto.getCustomerId());
        item.setEmploymentId(dto.getEmploymentId());
        item.setTotal(dto.getTotal());
        item.setSaleStatus(dto.getSaleStatus());
        return dao.save(item);
    }
    public Sale update(UUID id, SaleDto dto) {
        Sale item = new Sale();
        item.setSaleId(id);
        item.setCustomerId(dto.getCustomerId());
        item.setEmploymentId(dto.getEmploymentId());
        item.setTotal(dto.getTotal());
        item.setSaleStatus(dto.getSaleStatus());
        if (!dao.update(id, item)) throw new RuntimeException("Sale not found");
        return findById(id);
    }
    public void delete(UUID id) { if (!dao.delete(id)) throw new RuntimeException("Sale not found"); }
}
